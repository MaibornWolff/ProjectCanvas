import { Group, Badge } from "@mantine/core";
import { forwardRef, ComponentPropsWithoutRef } from "react";
import { IssueIcon } from "../../../BacklogView/Issue/IssueIcon";

interface ItemProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
}

export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group wrap="nowrap">
        <IssueIcon type="Epic" />
        <div>
          <Badge size="sm" color="violet">
            {label}
          </Badge>
        </div>
      </Group>
    </div>
  )
);
