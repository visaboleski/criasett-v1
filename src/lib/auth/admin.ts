import type { SupabaseClient, User } from '@supabase/supabase-js';

import type { AdminProfile, Database } from '@lib/supabase/database.types';

export type AdminSession = {
	user: Pick<User, 'id' | 'email'>;
	profile: Pick<AdminProfile, 'user_id' | 'display_name' | 'active'>;
};

export async function getAdminSession(
	supabase: SupabaseClient<Database>,
): Promise<AdminSession | null> {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) return null;

	const { data: profile, error: profileError } = await supabase
		.from('admin_profiles')
		.select('user_id, display_name, active')
		.eq('user_id', user.id)
		.eq('active', true)
		.maybeSingle();

	if (profileError || !profile) return null;

	return {
		user: {
			id: user.id,
			email: user.email,
		},
		profile,
	};
}
