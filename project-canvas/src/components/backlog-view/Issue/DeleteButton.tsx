import { ActionIcon, Transition, Popover, Box } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { useEffect, useState } from "react"
import { DeleteIssueAlert } from "../../DetailView/Components/DeleteIssue/DeleteIssueAlert"

export function DeleteButton({
  mounted,
  issueKey,
}: {
  mounted: boolean
  issueKey: string
}) {
  const [issuePopoverOpened, setIssuePopoverOpened] = useState(false)

  useEffect(() => {
    if (!mounted) {
      setIssuePopoverOpened(false)
    }
  }, [mounted])

  return (
    <Box sx={{ position: "absolute", bottom: 5, right: 11 }}>
      <Transition
        mounted={mounted}
        transition="fade"
        duration={200}
        timingFunction="ease"
      >
        {(styles) => (
          <Popover
            width="40vh"
            trapFocus
            withArrow
            shadow="md"
            opened={issuePopoverOpened}
            onChange={setIssuePopoverOpened}
          >
            <Popover.Target>
              <ActionIcon
                color="red"
                size="sm"
                variant="transparent"
                style={styles}
                onClick={() => setIssuePopoverOpened(!issuePopoverOpened)}
              >
                <IconTrash />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown
              sx={(theme) => ({
                background:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.white,
              })}
            >
              <DeleteIssueAlert
                issueKey={issueKey}
                closeModal={() => setIssuePopoverOpened(false)}
              />
            </Popover.Dropdown>
          </Popover>
        )}
      </Transition>
    </Box>
  )
}
