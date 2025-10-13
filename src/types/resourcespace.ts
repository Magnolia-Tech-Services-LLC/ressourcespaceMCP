import { z } from 'zod';

// Base API Response Types
export interface ResourceSpaceAPIResponse<T = unknown> {
  data?: T;
  error?: string;
  status?: 'success' | 'error';
}

// Resource Types
export const ResourceSchema = z.object({
  ref: z.union([z.string(), z.number()]),
  resource_type: z.union([z.string(), z.number()]).optional(),
  has_image: z.union([z.string(), z.number(), z.boolean()]).optional(),
  is_transcoding: z.union([z.string(), z.number(), z.boolean()]).optional(),
  hit_count: z.union([z.string(), z.number()]).optional(),
  creation_date: z.string().optional(),
  rating: z.union([z.string(), z.number()]).optional(),
  user_rating: z.union([z.string(), z.number()]).optional(),
  archive: z.union([z.string(), z.number()]).optional(),
  access: z.union([z.string(), z.number()]).optional(),
  colour_key: z.string().optional(),
  created_by: z.union([z.string(), z.number()]).optional(),
  request_count: z.union([z.string(), z.number()]).optional(),
  new_hit_count: z.union([z.string(), z.number()]).optional(),
  field8: z.any().optional(), // title
  field3: z.any().optional(), // description
});

export type Resource = z.infer<typeof ResourceSchema>;

// Collection Types
export const CollectionSchema = z.object({
  ref: z.union([z.string(), z.number()]),
  name: z.string(),
  user: z.union([z.string(), z.number()]),
  created: z.string().optional(),
  public: z.union([z.string(), z.number(), z.boolean()]).optional(),
  allow_changes: z.union([z.string(), z.number(), z.boolean()]).optional(),
  cant_delete: z.union([z.string(), z.number(), z.boolean()]).optional(),
  keywords: z.string().optional(),
  count: z.union([z.string(), z.number()]).optional(),
});

export type Collection = z.infer<typeof CollectionSchema>;

// User Types
export const UserSchema = z.object({
  ref: z.union([z.string(), z.number()]),
  username: z.string(),
  fullname: z.string().optional(),
  email: z.string().optional(),
  usergroup: z.union([z.string(), z.number()]).optional(),
  last_active: z.string().optional(),
  created: z.string().optional(),
  approved: z.union([z.string(), z.number(), z.boolean()]).optional(),
  lang: z.string().optional(),
  comments: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Field/Metadata Types
export const ResourceFieldSchema = z.object({
  ref: z.union([z.string(), z.number()]),
  name: z.string(),
  title: z.string(),
  type: z.union([z.string(), z.number()]),
  order_by: z.union([z.string(), z.number()]).optional(),
  keywords_index: z.union([z.string(), z.number(), z.boolean()]).optional(),
  partial_index: z.union([z.string(), z.number(), z.boolean()]).optional(),
  resource_type: z.union([z.string(), z.number()]).optional(),
  resource_column: z.string().optional(),
  display_field: z.union([z.string(), z.number(), z.boolean()]).optional(),
  use_for_similar: z.union([z.string(), z.number(), z.boolean()]).optional(),
  iptc_equiv: z.string().optional(),
  display_template: z.string().optional(),
  advanced_search: z.union([z.string(), z.number(), z.boolean()]).optional(),
  simple_search: z.union([z.string(), z.number(), z.boolean()]).optional(),
  help_text: z.string().optional(),
  display_condition: z.string().optional(),
  onchange_macro: z.string().optional(),
  field_constraint: z.union([z.string(), z.number()]).optional(),
  required: z.union([z.string(), z.number(), z.boolean()]).optional(),
  options: z.array(z.any()).optional(),
});

export type ResourceField = z.infer<typeof ResourceFieldSchema>;

// Search Result Types
export const SearchResultSchema = z.object({
  resources: z.array(ResourceSchema),
  total: z.number().optional(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

// System Info Types
export const SystemInfoSchema = z.object({
  version: z.string(),
  server_os: z.string().optional(),
  php_version: z.string().optional(),
  mysql_version: z.string().optional(),
  plugins: z.array(z.string()).optional(),
});

export type SystemInfo = z.infer<typeof SystemInfoSchema>;

// Alternative File Types
export const AlternativeFileSchema = z.object({
  ref: z.union([z.string(), z.number()]),
  resource: z.union([z.string(), z.number()]),
  name: z.string(),
  description: z.string().optional(),
  file_name: z.string().optional(),
  file_extension: z.string().optional(),
  file_size: z.union([z.string(), z.number()]).optional(),
  creation_date: z.string().optional(),
  unoconv: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

export type AlternativeFile = z.infer<typeof AlternativeFileSchema>;

// Resource Type
export const ResourceTypeSchema = z.object({
  ref: z.union([z.string(), z.number()]),
  name: z.string(),
  order_by: z.union([z.string(), z.number()]).optional(),
  config_options: z.string().optional(),
});

export type ResourceType = z.infer<typeof ResourceTypeSchema>;

// Keyword Types
export const KeywordSchema = z.object({
  keyword: z.string(),
  count: z.union([z.string(), z.number()]).optional(),
});

export type Keyword = z.infer<typeof KeywordSchema>;

// Activity Log Types
export const ActivityLogSchema = z.object({
  ref: z.union([z.string(), z.number()]),
  date: z.string(),
  user: z.union([z.string(), z.number()]),
  resource: z.union([z.string(), z.number()]).optional(),
  type: z.string(),
  notes: z.string().optional(),
});

export type ActivityLog = z.infer<typeof ActivityLogSchema>;

// Request Types
export interface ResourceSpaceRequestParams {
  function: string;
  [key: string]: string | number | boolean | undefined;
}

// Error Types
export class ResourceSpaceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ResourceSpaceError';
  }
}

