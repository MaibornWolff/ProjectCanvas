import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { MantineColor, MantineNumberSize, Text } from "@mantine/core"

interface LinkTextPropsRequired {
  text: string | undefined
  td: boolean
}

interface LinkTextPropsOptional {
  fz?: MantineNumberSize | undefined
  color?: "dimmed" | MantineColor | undefined
  trunc?: boolean | undefined
  grow?: boolean | undefined
}

export interface LinkTextProps
  extends LinkTextPropsRequired,
    LinkTextPropsOptional {}

export function LinkText({
  text,
  fz,
  color,
  td,
  trunc,
  grow,
}: LinkTextProps): ReactJSXElement {
  return (
    <Text
      fz={fz}
      color={color}
      td={td ? "line-through" : "none"}
      sx={{
        ":hover": {
          textDecoration: "underline",
          cursor: "pointer",
        },
      }}
      truncate={trunc}
      style={grow ? { width: "max-content" } : {}}
    >
      {text}
    </Text>
  )
}

const defaultProps: LinkTextPropsOptional = {
  fz: "sm",
  color: "blue",
  trunc: false,
  grow: false,
}

LinkText.defaultProps = defaultProps
