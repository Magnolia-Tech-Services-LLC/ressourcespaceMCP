# ResourceSpace API to MCP Tool Mapping

This document maps ResourceSpace API functions to the consolidated MCP tools in the multi-server architecture.

## 📖 Understanding Consolidated Tools

With the multi-server split, many CRUD operations are now consolidated into single tools using an `action` parameter. This reduces tool count while maintaining full functionality.

**Example:**
```javascript
// Old (4 separate tools):
get_resource_data(resource_id)
create_resource(resource_type)
delete_resource(resource_id)
copy_resource(resource_id)

// New (1 consolidated tool):
resource({ action: "get", resource_id })
resource({ action: "create", resource_type })
resource({ action: "delete", resource_id })
resource({ action: "copy", resource_id })
```

---

## Main Server (44 tools)

### Resource Management (8 tools)

| MCP Tool | Actions | ResourceSpace API Functions |
|----------|---------|----------------------------|
| `resource` | get, create, delete, copy | get_resource_data, create_resource, delete_resource, copy_resource |
| `resource_path` | - | get_resource_path |
| `resource_types` | - | get_resource_types |
| `resource_access` | - | get_resource_access |
| `resource_log` | - | get_resource_log |
| `resource_related` | - | get_related_resources |
| `alternative_files` | get, add, delete, revert | get_alternative_files, add_alternative_file, delete_alternative_file, revert_resource_to_alternative |
| `upload_file` | - | upload_file |

### Search & Discovery (7 tools)

| MCP Tool | Actions | ResourceSpace API Functions |
|----------|---------|----------------------------|
| `search` | - | do_search |
| `search_results` | - | get_search_results |
| `recent_resources` | - | get_recent_resources |
| `search_collections` | - | search_public_collections |
| `resource_collections` | - | get_resource_collections |
| `themes` | - | get_themes |
| `keywords` | - | get_keywords |

### Collections Management (8 tools)

| MCP Tool | Actions | ResourceSpace API Functions |
|----------|---------|----------------------------|
| `collection` | get, create, update, delete, copy | get_collection, create_collection, update_collection, delete_collection, copy_collection |
| `collection_resources` | - | get_collection_resources |
| `collections` | - | get_collections |
| `public_collections` | - | get_public_collections |
| `collection_resource` | add, remove | add_resource_to_collection, remove_resource_from_collection |
| `collection_share` | - | share_collection |
| `collection_log` | - | get_collection_log |
| `collection_order` | - | order_collection_resources |

### Metadata Operations (12 tools)

| MCP Tool | Actions | ResourceSpace API Functions |
|----------|---------|----------------------------|
| `field_data` | - | get_resource_field_data |
| `field_update` | - | update_field |
| `field_copy` | - | copy_field |
| `fields` | - | get_resource_type_fields |
| `field_options` | - | get_field_options |
| `nodes` | - | get_nodes |
| `resource_nodes` | get, add, remove | get_resource_nodes, add_resource_nodes, delete_resource_nodes |
| `metadata_copy` | - | copy_resource_metadata |
| `exif_data` | - | get_exif_data |
| `resource_type_update` | - | update_resource_type |
| `field_values` | - | get_field_values |
| `set_node` | - | create_node |

### Batch Operations (9 tools)

| MCP Tool | ResourceSpace API Function |
|----------|----------------------------|
| `batch_field_update` | batch_update_field |
| `batch_collection_add` | batch_add_to_collection |
| `batch_collection_remove` | batch_remove_from_collection |
| `batch_delete` | batch_delete_resources |
| `batch_archive_status` | batch_update_archive_status |
| `batch_field_copy` | batch_copy_field |
| `batch_nodes_add` | batch_add_nodes |
| `batch_nodes_remove` | batch_delete_nodes |
| `batch_download` | batch_download_resources |

---

## Admin Server (18 tools)

### User Management (8 tools)

| MCP Tool | Actions | ResourceSpace API Functions |
|----------|---------|----------------------------|
| `user` | get, create, update, delete | get_user, create_user, update_user, delete_user |
| `users` | - | get_users |
| `usergroup` | get, create, update, delete | get_usergroup, create_usergroup, update_usergroup, delete_usergroup |
| `usergroups` | - | get_usergroups |
| `user_preferences` | get, save | get_user_preferences, save_user_preferences |
| `user_activity` | - | get_user_activity |
| `user_collections` | - | get_user_collections |
| `approve_user` | - | approve_user |

### System Operations (10 tools)

| MCP Tool | Actions | ResourceSpace API Functions |
|----------|---------|----------------------------|
| `system_info` | - | get_system_info |
| `system_status` | - | get_system_status |
| `config` | get, set | get_config_options, set_config_option |
| `plugins` | - | get_plugins |
| `plugin_config` | get, set | get_plugin_config, set_plugin_config |
| `job_queue` | get, clear | get_job_queue, clear_job_queue |
| `resource_stats` | - | get_resource_stats |
| `cache_clear` | - | clear_cache |
| `reindex` | - | reindex_resources |
| `activity_log` | - | get_activity_log |

---

## IIIF Server (5 tools)

| MCP Tool | ResourceSpace API Function |
|----------|----------------------------|
| `iiif_manifest` | iiif_manifest |
| `iiif_info` | iiif_info |
| `iiif_image` | iiif_image |
| `iiif_collection` | iiif_collection |
| `iiif_search` | iiif_search |

---

## Consent Manager Server (8 tools)

| MCP Tool | Actions | ResourceSpace API Functions |
|----------|---------|----------------------------|
| `consent` | get, create, update, delete | get_consent, create_consent, update_consent, delete_consent |
| `consents` | - | get_consents |
| `consents_by_collection` | - | get_consents_by_collection |
| `consent_link` | - | consent_link |
| `consent_unlink` | - | consent_unlink |
| `consent_batch_link` | - | consent_batch_link |
| `consent_file_save` | - | consent_file_save |
| `licenses` | - | get_licenses |

---

## Summary

- **Main Server:** 44 tools covering core DAM operations
- **Admin Server:** 18 tools for user and system management
- **IIIF Server:** 5 tools for IIIF protocol
- **Consent Server:** 8 tools for consent management

**Total:** 75 tools (33.6% reduction from original 113 tools through CRUD consolidation)

## Migration from Old Tools

If you were using the old single-server with separate CRUD tools, here's how to migrate:

| Old Tool | New Tool | Additional Parameter |
|----------|----------|---------------------|
| `get_resource_data` | `resource` | `action: "get"` |
| `create_resource` | `resource` | `action: "create"` |
| `delete_resource` | `resource` | `action: "delete"` |
| `copy_resource` | `resource` | `action: "copy"` |
| `get_collection` | `collection` | `action: "get"` |
| `create_collection` | `collection` | `action: "create"` |
| `update_collection` | `collection` | `action: "update"` |
| `delete_collection` | `collection` | `action: "delete"` |
| `get_user` | `user` | `action: "get"` |
| `create_user` | `user` | `action: "create"` |
| `update_user` | `user` | `action: "update"` |
| `delete_user` | `user` | `action: "delete"` |

See [MULTI_SERVER_GUIDE.md](MULTI_SERVER_GUIDE.md) for detailed information about each server.
