/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of an item associated with the changed record.
 */
export type AssociatedItemBean = {
  /**
   * The ID of the associated record.
   */
  readonly id?: string
  /**
   * The name of the associated record.
   */
  readonly name?: string
  /**
   * The type of the associated record.
   */
  readonly typeName?: string
  /**
   * The ID of the associated parent record.
   */
  readonly parentId?: string
  /**
   * The name of the associated parent record.
   */
  readonly parentName?: string
}
