/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Details of an issue priority.
 */
export type CreatePriorityDetails = {
  /**
   * The name of the priority. Must be unique.
   */
  name: string
  /**
   * The description of the priority.
   */
  description?: string
  /**
   * The URL of an icon for the priority. Accepted protocols are HTTP and HTTPS. Built in icons can also be used.
   */
  iconUrl?:
    | "/images/icons/priorities/blocker.png"
    | "/images/icons/priorities/critical.png"
    | "/images/icons/priorities/high.png"
    | "/images/icons/priorities/highest.png"
    | "/images/icons/priorities/low.png"
    | "/images/icons/priorities/lowest.png"
    | "/images/icons/priorities/major.png"
    | "/images/icons/priorities/medium.png"
    | "/images/icons/priorities/minor.png"
    | "/images/icons/priorities/trivial.png"
  /**
   * The status color of the priority in 3-digit or 6-digit hexadecimal format.
   */
  statusColor: string
}
