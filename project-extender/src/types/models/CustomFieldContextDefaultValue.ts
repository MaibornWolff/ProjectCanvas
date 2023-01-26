/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CustomFieldContextDefaultValueCascadingOption } from "./CustomFieldContextDefaultValueCascadingOption"
import type { CustomFieldContextDefaultValueDate } from "./CustomFieldContextDefaultValueDate"
import type { CustomFieldContextDefaultValueDateTime } from "./CustomFieldContextDefaultValueDateTime"
import type { CustomFieldContextDefaultValueFloat } from "./CustomFieldContextDefaultValueFloat"
import type { CustomFieldContextDefaultValueForgeDateTimeField } from "./CustomFieldContextDefaultValueForgeDateTimeField"
import type { CustomFieldContextDefaultValueForgeGroupField } from "./CustomFieldContextDefaultValueForgeGroupField"
import type { CustomFieldContextDefaultValueForgeMultiGroupField } from "./CustomFieldContextDefaultValueForgeMultiGroupField"
import type { CustomFieldContextDefaultValueForgeMultiStringField } from "./CustomFieldContextDefaultValueForgeMultiStringField"
import type { CustomFieldContextDefaultValueForgeMultiUserField } from "./CustomFieldContextDefaultValueForgeMultiUserField"
import type { CustomFieldContextDefaultValueForgeNumberField } from "./CustomFieldContextDefaultValueForgeNumberField"
import type { CustomFieldContextDefaultValueForgeObjectField } from "./CustomFieldContextDefaultValueForgeObjectField"
import type { CustomFieldContextDefaultValueForgeStringField } from "./CustomFieldContextDefaultValueForgeStringField"
import type { CustomFieldContextDefaultValueForgeUserField } from "./CustomFieldContextDefaultValueForgeUserField"
import type { CustomFieldContextDefaultValueLabels } from "./CustomFieldContextDefaultValueLabels"
import type { CustomFieldContextDefaultValueMultipleGroupPicker } from "./CustomFieldContextDefaultValueMultipleGroupPicker"
import type { CustomFieldContextDefaultValueMultipleOption } from "./CustomFieldContextDefaultValueMultipleOption"
import type { CustomFieldContextDefaultValueMultipleVersionPicker } from "./CustomFieldContextDefaultValueMultipleVersionPicker"
import type { CustomFieldContextDefaultValueMultiUserPicker } from "./CustomFieldContextDefaultValueMultiUserPicker"
import type { CustomFieldContextDefaultValueProject } from "./CustomFieldContextDefaultValueProject"
import type { CustomFieldContextDefaultValueReadOnly } from "./CustomFieldContextDefaultValueReadOnly"
import type { CustomFieldContextDefaultValueSingleGroupPicker } from "./CustomFieldContextDefaultValueSingleGroupPicker"
import type { CustomFieldContextDefaultValueSingleOption } from "./CustomFieldContextDefaultValueSingleOption"
import type { CustomFieldContextDefaultValueSingleVersionPicker } from "./CustomFieldContextDefaultValueSingleVersionPicker"
import type { CustomFieldContextDefaultValueTextArea } from "./CustomFieldContextDefaultValueTextArea"
import type { CustomFieldContextDefaultValueTextField } from "./CustomFieldContextDefaultValueTextField"
import type { CustomFieldContextDefaultValueURL } from "./CustomFieldContextDefaultValueURL"
import type { CustomFieldContextSingleUserPickerDefaults } from "./CustomFieldContextSingleUserPickerDefaults"

export type CustomFieldContextDefaultValue =
  | CustomFieldContextDefaultValueCascadingOption
  | CustomFieldContextDefaultValueMultipleOption
  | CustomFieldContextDefaultValueSingleOption
  | CustomFieldContextSingleUserPickerDefaults
  | CustomFieldContextDefaultValueMultiUserPicker
  | CustomFieldContextDefaultValueSingleGroupPicker
  | CustomFieldContextDefaultValueMultipleGroupPicker
  | CustomFieldContextDefaultValueDate
  | CustomFieldContextDefaultValueDateTime
  | CustomFieldContextDefaultValueURL
  | CustomFieldContextDefaultValueProject
  | CustomFieldContextDefaultValueFloat
  | CustomFieldContextDefaultValueLabels
  | CustomFieldContextDefaultValueTextField
  | CustomFieldContextDefaultValueTextArea
  | CustomFieldContextDefaultValueReadOnly
  | CustomFieldContextDefaultValueSingleVersionPicker
  | CustomFieldContextDefaultValueMultipleVersionPicker
  | CustomFieldContextDefaultValueForgeStringField
  | CustomFieldContextDefaultValueForgeMultiStringField
  | CustomFieldContextDefaultValueForgeObjectField
  | CustomFieldContextDefaultValueForgeDateTimeField
  | CustomFieldContextDefaultValueForgeGroupField
  | CustomFieldContextDefaultValueForgeMultiGroupField
  | CustomFieldContextDefaultValueForgeNumberField
  | CustomFieldContextDefaultValueForgeUserField
  | CustomFieldContextDefaultValueForgeMultiUserField
