import { ActionIcon, Tooltip } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export function InfoButton({ text, mb, mt }: { text: string, mb : string, mt:string }) {
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
      <ActionIcon variant="subtle" mb={mb} mt={mt}>
        <IconInfoCircle />
      </ActionIcon>
    </Tooltip>
  );
}
