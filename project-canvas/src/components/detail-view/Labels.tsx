import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { Badge, BadgeVariant, MantineColor, Text } from "@mantine/core"
import { Row } from "./Row"

interface LabelsPropsRequired {
  labels: string[]
}

interface LabelsPropsOptional {
  color?: MantineColor | undefined
  variant?: BadgeVariant | undefined
}

export interface LabelsProps extends LabelsPropsRequired, LabelsPropsOptional {}

export function Labels({
  labels,
  color,
  variant,
}: LabelsProps): ReactJSXElement {
  return (
    <Row>
      {labels.map((label: string) => (
        <Badge key={label} color={color} variant={variant}>
          <Text>{label}</Text>
        </Badge>
      ))}
    </Row>
  )
}

const defaultProps: LabelsPropsOptional = {
  color: "indigo",
  variant: "light",
}

Labels.defaultProps = defaultProps
