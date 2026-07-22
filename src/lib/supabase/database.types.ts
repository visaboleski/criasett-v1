export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			admin_profiles: {
				Row: {
					user_id: string;
					active: boolean;
					display_name: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					user_id: string;
					active?: boolean;
					display_name?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					user_id?: string;
					active?: boolean;
					display_name?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: {
			is_admin: {
				Args: Record<string, never>;
				Returns: boolean;
			};
		};
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
};

export type AdminProfile = Database['public']['Tables']['admin_profiles']['Row'];
