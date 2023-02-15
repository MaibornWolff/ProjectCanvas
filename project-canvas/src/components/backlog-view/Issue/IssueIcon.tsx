import { ThemeIcon } from "@mantine/core"
import {
  IconBookmark,
  IconCheck,
  IconBug,
  IconQuestionMark,
  IconBolt,
} from "@tabler/icons"

export function IssueIcon({ type }: { type: string }) {
  let icon: JSX.Element
  let iconGradient1: string
  let iconGradient2: string
  switch (type) {
    case "Story":
      icon = <IconBookmark />
      iconGradient1 = "teal"
      iconGradient2 = "lime"
      break
    case "Task":
      icon = <IconCheck />
      iconGradient1 = "teal"
      iconGradient2 = "blue"
      break
    case "Bug":
      icon = <IconBug />
      iconGradient1 = "orange"
      iconGradient2 = "red"
      break
    case "Epic":
      icon = <IconBolt />
      iconGradient1 = "violet"
      iconGradient2 = "white"
      break
    default:
      icon = <IconQuestionMark />
      iconGradient1 = "white"
      iconGradient2 = "white"
  }
  return (
    <ThemeIcon
      size="sm"
      variant="gradient"
      gradient={{ from: iconGradient1, to: iconGradient2, deg: 105 }}
    >
      {icon}
    </ThemeIcon>
  )
}
