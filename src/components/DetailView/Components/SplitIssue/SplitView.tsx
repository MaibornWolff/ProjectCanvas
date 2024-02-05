import { Dispatch, SetStateAction } from "react";
import { Modal } from "@mantine/core";

export function SplitView({
  opened,
  setOpened,
}: {
  opened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>,
}) {
  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
      }}
    />
  );
}
