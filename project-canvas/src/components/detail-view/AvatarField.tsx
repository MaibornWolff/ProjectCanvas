import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import {
  Avatar,
  Text,
  SystemProp,
  SpacingValue,
  MantineNumberSize,
} from "@mantine/core"
import { Row } from "./Row"

interface AvatarFieldPropsRequired {}

interface AvatarFieldPropsOptional {
  url?: string | null | undefined
  size?: MantineNumberSize | undefined
  radius?: MantineNumberSize | undefined
  text?: string
  fz?: SystemProp<SpacingValue> | undefined
  fw?: number | undefined
}

export interface AvatarFieldProps
  extends AvatarFieldPropsRequired,
    AvatarFieldPropsOptional {}

export function AvatarField({
  url,
  size,
  radius,
  text,
  fz,
  fw,
}: AvatarFieldProps): ReactJSXElement {
  return (
    <Row>
      <Avatar src={url} size={size} radius={radius} />
      <Text fz={fz} fw={fw}>
        {text}
      </Text>
    </Row>
  )
}

const defaultProps: AvatarFieldPropsOptional = {
  url: undefined,
  size: 32,
  radius: "xl",
  text: undefined,
  fz: "sm",
  fw: 500,
}

AvatarField.defaultProps = defaultProps
