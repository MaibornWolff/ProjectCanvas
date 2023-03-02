import { NumberInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, IssueType } from "project-extender"

export function StoryPointsEstimateInput({
  form,
  issueTypes,
  issueTypesWithFieldsMap,
}: {
  form: UseFormReturnType<Issue>
  issueTypes?: IssueType[]
  issueTypesWithFieldsMap?: Map<string, string[]>
}) {
  const isDisabled =
    issueTypesWithFieldsMap &&
    issueTypesWithFieldsMap.size > 0 &&
    (!issueTypesWithFieldsMap
      .get(form.getInputProps("type").value)
      ?.includes("Story point estimate") ||
      form.getInputProps("type").value ===
        issueTypes?.find((issueType) => issueType.name === "Epic")?.id)

  return (
    <NumberInput
      min={0}
      label="Story Point Estimate"
      defaultValue={null}
      precision={3}
      disabled={isDisabled}
      {...form.getInputProps("storyPointsEstimate")}
    />
  )
}
