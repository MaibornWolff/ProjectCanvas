import {
  Avatar, Container, Group, Text,
} from "@mantine/core";
import { forwardRef, ComponentPropsWithoutRef } from "react";

interface ItemProps extends ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  value: string;
}

export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({
    image, label, value, ...others
  }: ItemProps, ref) => (
    <Container ref={ref} {...others}>
      <Group wrap="nowrap">
        <Avatar src={image} size="sm" radius="xl" ml={4} mr={4} />
        <Text size="sm">{label}</Text>
      </Group>
    </Container>
  ),
);
