import { ThemeIcon } from "@mantine/core"
import {
  IconBookmark,
  IconCheck,
  IconBug,
  IconBolt,
  IconEdit,
} from "@tabler/icons"

export function IssueIcon({ type }: { type: string }) {
  const stringToColor = (value: string) => {
    let hash = 0
    for (let i = 0; i < value.length; i += 1) {
      // eslint-disable-next-line no-bitwise
      hash = value.charCodeAt(i) + ((hash << 1) - hash)
    }
    return `hsl(${hash % 360}, 85%, 35%)`
  }

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
      icon = <IconEdit />
      iconGradient1 = stringToColor(type)
      iconGradient2 = stringToColor(type.split("").reverse().join(""))
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
