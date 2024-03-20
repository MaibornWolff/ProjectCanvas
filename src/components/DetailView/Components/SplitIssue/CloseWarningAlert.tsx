import { Button, Stack, Alert, Group } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

export function CloseWarningAlert({ cancelAlert, confirmAlert }: { cancelAlert: () => void, confirmAlert: () => void }) {
  return (
    <Stack>
      <Alert
        icon={<IconAlertTriangle size={32} />}
        title="Warning!"
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
          color="red"
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
