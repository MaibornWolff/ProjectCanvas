import { ActionIcon, Transition } from "@mantine/core"
import { IconTrash } from "@tabler/icons"

export function DeleteButton({
  mounted,
  onClick,
}: {
  mounted: boolean
  onClick: () => void
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
