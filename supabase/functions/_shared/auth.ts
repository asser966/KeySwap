import { createClient, type User } from 'https://esm.sh/@supabase/supabase-js@2';
import { requiredEnv } from './http.ts';

type AuthorizationResult =
  | { user: User; error: null; status: 200 }
  | { user: null; error: string; status: 401 | 403 };

export async function requireAal2User(request: Request): Promise<AuthorizationResult> {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return { user: null, error: 'Sign in to continue.', status: 401 };
  }

  const accessToken = authorization.slice('Bearer '.length);
  const supabase = createClient(
    requiredEnv('SUPABASE_URL'),
    requiredEnv('SUPABASE_ANON_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return { user: null, error: 'Sign in to continue.', status: 401 };
  }

  const { data: assurance, error: assuranceError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel(accessToken);
  if (assuranceError) throw new Error('Could not verify account assurance level.');
  if (assurance.currentLevel !== 'aal2') {
    return {
      user: null,
      error: 'Verify an authenticator code before using this protected action.',
      status: 403
    };
  }

  return { user: data.user, error: null, status: 200 };
}
