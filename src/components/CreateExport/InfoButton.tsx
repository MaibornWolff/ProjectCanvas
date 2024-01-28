import { ActionIcon, Tooltip } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export function InfoButton({ text }: { text: string }) {
  return (
    <Tooltip
      withArrow
      multiline
      w={150}
      fz={14}
      fw={500}
      openDelay={200}
      closeDelay={200}
      ta="center"
      color="primaryBlue"
      variant="filled"
      label={text}
    >
      <ActionIcon variant="subtle" ml="auto">
        <IconInfoCircle />
      </ActionIcon>
    </Tooltip>
  );
}
