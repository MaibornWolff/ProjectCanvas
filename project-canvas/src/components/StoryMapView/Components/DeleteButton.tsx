import { ActionIcon, Transition } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { MouseEventHandler } from "react"

export function DeleteButton({
  mounted,
  onClick,
}: {
  mounted: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <Transition
      mounted={mounted}
      transition="fade"
      duration={200}
      timingFunction="ease"
    >
      {(styles) => (
        <ActionIcon
          pos="absolute"
          top={8}
          right={8}
          color="red"
          size="sm"
          variant="transparent"
          onClick={onClick}
          style={styles}
        >
          <IconTrash />
        </ActionIcon>
      )}
    </Transition>
  )
}
