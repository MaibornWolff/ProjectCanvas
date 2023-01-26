/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of a field that can be used in advanced searches.
 */
export type FieldReferenceData = {
  /**
   * The field identifier.
   */
  value?: string
  /**
   * The display name contains the following:
   *
   * *  for system fields, the field name. For example, `Summary`.
   * *  for collapsed custom fields, the field name followed by a hyphen and then the field name and field type. For example, `Component - Component[Dropdown]`.
   * *  for other custom fields, the field name followed by a hyphen and then the custom field ID. For example, `Component - cf[10061]`.
   */
  displayName?: string
  /**
   * Whether the field can be used in a query's `ORDER BY` clause.
   */
  orderable?: "true" | "false"
  /**
   * Whether the content of this field can be searched.
   */
  searchable?: "true" | "false"
  /**
   * Whether this field has been deprecated.
   */
  deprecated?: "true" | "false"
  /**
   * The searcher key of the field, only passed when the field is deprecated.
   */
  deprecatedSearcherKey?: string
  /**
   * Whether the field provide auto-complete suggestions.
   */
  auto?: "true" | "false"
  /**
   * If the item is a custom field, the ID of the custom field.
   */
  cfid?: string
  /**
   * The valid search operators for the field.
   */
  operators?: Array<string>
  /**
   * The data types of items in the field.
   */
  types?: Array<string>
}
