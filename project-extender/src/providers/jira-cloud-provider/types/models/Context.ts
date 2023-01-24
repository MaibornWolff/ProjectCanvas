/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Scope } from "./Scope"

/**
 * A context.
 */
export type Context = {
  /**
   * The ID of the context.
   */
  readonly id?: number
  /**
   * The name of the context.
   */
  readonly name?: string
  /**
   * The scope of the context.
   */
  scope?: Scope
}
