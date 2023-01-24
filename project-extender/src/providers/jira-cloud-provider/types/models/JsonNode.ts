/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type JsonNode = {
  elements?: any
  floatingPointNumber?: boolean
  valueNode?: boolean
  containerNode?: boolean
  missingNode?: boolean
  object?: boolean
  pojo?: boolean
  number?: boolean
  integralNumber?: boolean
  int?: boolean
  long?: boolean
  double?: boolean
  bigDecimal?: boolean
  bigInteger?: boolean
  textual?: boolean
  boolean?: boolean
  binary?: boolean
  numberValue?: number
  numberType?:
    | "INT"
    | "LONG"
    | "BIG_INTEGER"
    | "FLOAT"
    | "DOUBLE"
    | "BIG_DECIMAL"
  intValue?: number
  longValue?: number
  bigIntegerValue?: number
  doubleValue?: number
  decimalValue?: number
  booleanValue?: boolean
  binaryValue?: Array<string>
  valueAsInt?: number
  valueAsLong?: number
  valueAsDouble?: number
  valueAsBoolean?: boolean
  fieldNames?: any
  textValue?: string
  valueAsText?: string
  array?: boolean
  fields?: any
  null?: boolean
}
