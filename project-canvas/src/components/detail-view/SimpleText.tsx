import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { MantineNumberSize, Text } from "@mantine/core"

interface SimpleTextPropsRequired {
  text: string | undefined
}

interface SimpleTextPropsOptional {
  fz?: MantineNumberSize | undefined
  fw?: number | undefined
  trunc?: boolean | undefined
}

export interface SimpleTextProps
  extends SimpleTextPropsRequired,
    SimpleTextPropsOptional {}

export function SimpleText({
  text,
  fz,
  fw,
  trunc,
}: SimpleTextProps): ReactJSXElement {
  return (
    <Text fz={fz} fw={fw} truncate={trunc}>
      {text}
    </Text>
  )
}

const defaultProps: SimpleTextPropsOptional = {
  fz: "sm",
  fw: 500,
  trunc: true,
}

SimpleText.defaultProps = defaultProps
