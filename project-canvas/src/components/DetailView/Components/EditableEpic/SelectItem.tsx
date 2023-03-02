import { Group, Badge, Text } from "@mantine/core"
import { forwardRef } from "react"
import { IssueIcon } from "../../../backlog-view/Issue/IssueIcon"

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string
  label: string
  description: string
}

export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <IssueIcon type="Epic" />
        <div>
          <Badge size="sm" color="violet">
            {label}
          </Badge>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
)
