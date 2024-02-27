import { Button, Stack, Alert, Group } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export function CloseWarningAlert({ cancelAlert, confirmAlert }: { cancelAlert: () => void, confirmAlert: () => void }) {
  return (
    <Stack>
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Attention!"
        color="red"
      >
        If you close this view, all unsaved changes will be lost!
      </Alert>
      <Group style={{ alignItems: "stretch" }}>
        <Button
          variant="outline"
          color="gray"
          style={{ flex: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            cancelAlert();
          }}
        >
          Cancel
        </Button>
        <Button
          style={{ flex: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            confirmAlert();
          }}
        >
          Confirm and close
        </Button>
      </Group>
    </Stack>
  );
}
