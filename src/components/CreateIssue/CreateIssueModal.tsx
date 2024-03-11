import { Modal, useMantineTheme } from "@mantine/core";

import { useColorScheme } from "../../common/color-scheme";
import { CreateIssueModalContent } from "./CreateIssueModalContent";

export function CreateIssueModal({
  opened,
  onCancel,
  onCreate,
}: {
  opened: boolean,
  onCancel: () => void,
  onCreate: () => void,
}) {
  const theme = useMantineTheme();
  const colorScheme = useColorScheme();

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Create Issue"
      size="70vw"
      overlayProps={{
        color: colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.55,
        blur: 5,
      }}
    >
      <CreateIssueModalContent onCreate={onCreate} onCancel={onCancel} />
    </Modal>
  );
}
