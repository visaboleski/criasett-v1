export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type CorporateDocumentStatus = 'draft' | 'published' | 'archived';
export type CorporateDocumentVersionState = 'draft' | 'current' | 'superseded' | 'archived';

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
			document_categories: {
				Row: {
					id: string;
					slug: string;
					title: string;
					description: string | null;
					sort_order: number;
					active: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					slug: string;
					title: string;
					description?: string | null;
					sort_order?: number;
					active?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					slug?: string;
					title?: string;
					description?: string | null;
					sort_order?: number;
					active?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			corporate_documents: {
				Row: {
					id: string;
					category_id: string;
					slug: string;
					title: string;
					summary: string | null;
					responsible_department: string | null;
					status: CorporateDocumentStatus;
					current_version_id: string | null;
					sort_order: number;
					published_at: string | null;
					created_by: string | null;
					updated_by: string | null;
					created_at: string;
					updated_at: string;
					deleted_at: string | null;
				};
				Insert: {
					id?: string;
					category_id: string;
					slug: string;
					title: string;
					summary?: string | null;
					responsible_department?: string | null;
					status?: CorporateDocumentStatus;
					current_version_id?: string | null;
					sort_order?: number;
					published_at?: string | null;
					created_by?: string | null;
					updated_by?: string | null;
					created_at?: string;
					updated_at?: string;
					deleted_at?: string | null;
				};
				Update: {
					id?: string;
					category_id?: string;
					slug?: string;
					title?: string;
					summary?: string | null;
					responsible_department?: string | null;
					status?: CorporateDocumentStatus;
					current_version_id?: string | null;
					sort_order?: number;
					published_at?: string | null;
					created_by?: string | null;
					updated_by?: string | null;
					created_at?: string;
					updated_at?: string;
					deleted_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'corporate_documents_category_id_fkey';
						columns: ['category_id'];
						isOneToOne: false;
						referencedRelation: 'document_categories';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'corporate_documents_current_version_same_document';
						columns: ['id', 'current_version_id'];
						isOneToOne: false;
						referencedRelation: 'corporate_document_versions';
						referencedColumns: ['document_id', 'id'];
					},
				];
			};
			corporate_document_versions: {
				Row: {
					id: string;
					document_id: string;
					version_label: string;
					effective_date: string | null;
					revision_date: string | null;
					storage_path: string;
					original_filename: string;
					public_filename: string;
					mime_type: string;
					file_size: number;
					checksum_sha256: string;
					state: CorporateDocumentVersionState;
					published_at: string | null;
					superseded_at: string | null;
					created_by: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					document_id: string;
					version_label: string;
					effective_date?: string | null;
					revision_date?: string | null;
					storage_path: string;
					original_filename: string;
					public_filename: string;
					mime_type: string;
					file_size: number;
					checksum_sha256: string;
					state?: CorporateDocumentVersionState;
					published_at?: string | null;
					superseded_at?: string | null;
					created_by?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					document_id?: string;
					version_label?: string;
					effective_date?: string | null;
					revision_date?: string | null;
					storage_path?: string;
					original_filename?: string;
					public_filename?: string;
					mime_type?: string;
					file_size?: number;
					checksum_sha256?: string;
					state?: CorporateDocumentVersionState;
					published_at?: string | null;
					superseded_at?: string | null;
					created_by?: string | null;
					created_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'corporate_document_versions_document_id_fkey';
						columns: ['document_id'];
						isOneToOne: false;
						referencedRelation: 'corporate_documents';
						referencedColumns: ['id'];
					},
				];
			};
		};
		Views: Record<string, never>;
		Functions: {
			archive_corporate_document: {
				Args: {
					p_document_id: string;
				};
				Returns: {
					id: string;
					category_id: string;
					slug: string;
					title: string;
					summary: string | null;
					responsible_department: string | null;
					status: CorporateDocumentStatus;
					current_version_id: string | null;
					sort_order: number;
					published_at: string | null;
					created_by: string | null;
					updated_by: string | null;
					created_at: string;
					updated_at: string;
					deleted_at: string | null;
				};
			};
			is_admin: {
				Args: Record<string, never>;
				Returns: boolean;
			};
			publish_corporate_document_version: {
				Args: {
					p_document_id: string;
					p_version_id: string;
				};
				Returns: {
					id: string;
					category_id: string;
					slug: string;
					title: string;
					summary: string | null;
					responsible_department: string | null;
					status: CorporateDocumentStatus;
					current_version_id: string | null;
					sort_order: number;
					published_at: string | null;
					created_by: string | null;
					updated_by: string | null;
					created_at: string;
					updated_at: string;
					deleted_at: string | null;
				};
			};
		};
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
};

export type AdminProfile = Database['public']['Tables']['admin_profiles']['Row'];
export type DocumentCategory = Database['public']['Tables']['document_categories']['Row'];
export type CorporateDocument = Database['public']['Tables']['corporate_documents']['Row'];
export type CorporateDocumentVersion =
	Database['public']['Tables']['corporate_document_versions']['Row'];
