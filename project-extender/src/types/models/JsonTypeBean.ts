/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The schema of a field.
 */
export type JsonTypeBean = {
  /**
   * The data type of the field.
   */
  readonly type: string
  /**
   * When the data type is an array, the name of the field items within the array.
   */
  readonly items?: string
  /**
   * If the field is a system field, the name of the field.
   */
  readonly system?: string
  /**
   * If the field is a custom field, the URI of the field.
   */
  readonly custom?: string
  /**
   * If the field is a custom field, the custom ID of the field.
   */
  readonly customId?: number
  /**
   * If the field is a custom field, the configuration of the field.
   */
  readonly configuration?: Record<string, any>
}
