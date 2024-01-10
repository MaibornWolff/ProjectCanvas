import {Dispatch, SetStateAction} from "react";
import {
    Modal,
    Text
} from "@mantine/core"

export function CreateExportModal({
  opened,
  setOpened
}: {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}

        >
            <Text>Basic Modal</Text>
        </Modal>
    )
}