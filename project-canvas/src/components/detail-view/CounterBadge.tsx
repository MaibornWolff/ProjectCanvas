import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import {
  Text,
  Badge,
  MantineColor,
  MantineSize,
  BadgeVariant,
  HoverCard,
  UnstyledButton,
} from "@mantine/core"
import { SimpleText } from "./SimpleText"

interface CounterBadgePropsRequired {
  length: number
  labels: string[]
}

interface CounterBadgePropsOptional {
  color?: MantineColor | undefined
  size?: MantineSize | undefined
  variant?: BadgeVariant | undefined
}

export interface CounterBadgeProps
  extends CounterBadgePropsRequired,
    CounterBadgePropsOptional {}

export function CounterBadge({
  length,
  labels,
  color,
  size,
  variant,
}: CounterBadgeProps): ReactJSXElement {
  return (
    <HoverCard width={200} position="top" withArrow shadow="md">
      <HoverCard.Target>
        <UnstyledButton>
          <Badge color={color} size={size} variant={variant}>
            <Text>{`+${length}`}</Text>
          </Badge>
        </UnstyledButton>
      </HoverCard.Target>
      <HoverCard.Dropdown sx={{ pointerEvents: "none" }}>
        {labels.map((label: string) => (
          <SimpleText text={label} />
        ))}
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

const defaultProps: CounterBadgePropsOptional = {
  color: "gray",
  size: "sm",
  variant: "outline",
}

CounterBadge.defaultProps = defaultProps
