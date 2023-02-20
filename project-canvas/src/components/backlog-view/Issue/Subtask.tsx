import { Text, ThemeIcon, Group } from "@mantine/core"
import { IconBinaryTree2 } from "@tabler/icons"
import { IssueSummary } from "./IssueSummary"

export function Subtask(props: {
  id: string
  subtaskKey: string
  fields: {
    summary: string
  }
}) {
  return (
    <Group
      align="center"
      key={props.id}
      sx={(theme) => ({
        borderRadius: theme.radius.sm,
        transition: "background-color .8s ease-out",
        boxShadow: theme.shadows.xs,
        ":hover": {
          backgroundColor: "#ebecf0",
          transition: "background-color .1s ease-in",
        },
      })}
    >
      <ThemeIcon size="sm">
        <IconBinaryTree2 />
      </ThemeIcon>
      <Text size="sm" color="blue" span>
        {props.subtaskKey}
      </Text>
      <IssueSummary
        summary={props.fields.summary}
        issueKey={props.subtaskKey}
      />
    </Group>
  )
}
