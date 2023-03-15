import { Box, NumberInput, Tooltip } from "@mantine/core"
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
    <Tooltip
      label="Story Point Estimate cannot be defined for this issue type"
      position="top-start"
      events={{
        hover: true && !!isDisabled,
        focus: false && !!isDisabled,
        touch: false && !!isDisabled,
      }}
    >
      <Box>
        <NumberInput
          min={0}
          label="Story Point Estimate"
          placeholder="Choose story point estimate"
          defaultValue={null as unknown as number}
          precision={3}
          disabled={isDisabled}
          {...form.getInputProps("storyPointsEstimate")}
        />
      </Box>
    </Tooltip>
  )
}
