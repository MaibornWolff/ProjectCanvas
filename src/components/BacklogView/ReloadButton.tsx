import { ActionIcon } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";

export function ReloadButton({ ...props }) {
  const queryClient = useQueryClient();
  return (
    <ActionIcon
      variant="default"
      onClick={() => queryClient.invalidateQueries({ queryKey: ["issues"] })}
      size={30}
      {...props}
    >
      <IconReload size={16} />
    </ActionIcon>
  );
}
