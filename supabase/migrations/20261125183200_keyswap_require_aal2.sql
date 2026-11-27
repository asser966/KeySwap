drop policy if exists "Users manage their own saved layouts"
  on public.saved_layouts;

create policy "Users manage their own saved layouts with MFA"
  on public.saved_layouts
  for all
  using (
    auth.uid() = user_id
    and auth.jwt() ->> 'aal' = 'aal2'
  )
  with check (
    auth.uid() = user_id
    and auth.jwt() ->> 'aal' = 'aal2'
  );

drop policy if exists "Users can view their own subscription"
  on public.subscriptions;

create policy "Users can view their own subscription with MFA"
  on public.subscriptions
  for select
  using (
    auth.uid() = user_id
    and auth.jwt() ->> 'aal' = 'aal2'
  );
