-- Enforce the free-plan save cap at the database boundary, not just in the UI.
create table public.saved_layouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  language text not null check (language in (
    'en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES',
    'it-IT', 'nl-NL', 'sv-SE', 'pt-BR', 'ar-SA'
  )),
  layout jsonb not null check (jsonb_typeof(layout) = 'array'),
  created_at timestamptz not null default now()
);

create index saved_layouts_user_created_idx
  on public.saved_layouts (user_id, created_at desc);

alter table public.saved_layouts enable row level security;

create policy "Users manage their own saved layouts"
  on public.saved_layouts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.saved_layouts to authenticated;
grant all on public.saved_layouts to service_role;

create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  stripe_event_created bigint not null,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

revoke all on public.subscriptions from anon, authenticated;
grant select on public.subscriptions to authenticated;
grant all on public.subscriptions to service_role;

create function public.apply_stripe_subscription_event(
  p_user_id uuid,
  p_stripe_customer_id text,
  p_stripe_subscription_id text,
  p_status text,
  p_current_period_end timestamptz,
  p_cancel_at_period_end boolean,
  p_event_created bigint
)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  insert into public.subscriptions (
    user_id,
    stripe_customer_id,
    stripe_subscription_id,
    status,
    current_period_end,
    cancel_at_period_end,
    stripe_event_created,
    updated_at
  )
  values (
    p_user_id,
    p_stripe_customer_id,
    p_stripe_subscription_id,
    p_status,
    p_current_period_end,
    p_cancel_at_period_end,
    p_event_created,
    now()
  )
  on conflict (user_id) do update set
    stripe_customer_id = excluded.stripe_customer_id,
    stripe_subscription_id = excluded.stripe_subscription_id,
    status = excluded.status,
    current_period_end = excluded.current_period_end,
    cancel_at_period_end = excluded.cancel_at_period_end,
    stripe_event_created = excluded.stripe_event_created,
    updated_at = now()
  where public.subscriptions.stripe_event_created <= excluded.stripe_event_created;
$$;

revoke execute on function public.apply_stripe_subscription_event(
  uuid, text, text, text, timestamptz, boolean, bigint
) from public, anon, authenticated;
grant execute on function public.apply_stripe_subscription_event(
  uuid, text, text, text, timestamptz, boolean, bigint
) to service_role;

create function public.enforce_saved_layout_limit()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  saved_count integer;
  has_paid_plan boolean;
begin
  if auth.uid() is distinct from new.user_id then
    raise exception 'SAVED_LAYOUT_OWNER_MISMATCH' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));

  select exists (
    select 1
    from public.subscriptions
    where user_id = new.user_id
      and status in ('active', 'trialing')
  ) into has_paid_plan;

  if has_paid_plan then
    return new;
  end if;

  select count(*)
    into saved_count
    from public.saved_layouts
    where user_id = new.user_id;

  if saved_count >= 5 then
    raise exception 'FREE_LAYOUT_LIMIT' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create trigger saved_layouts_enforce_limit
  before insert on public.saved_layouts
  for each row
  execute function public.enforce_saved_layout_limit();
