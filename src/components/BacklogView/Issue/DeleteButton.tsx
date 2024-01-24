import { ActionIcon, Transition, Popover, Box } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useHover } from "@mantine/hooks";
import { DeleteIssueAlert } from "../../DetailView/Components/DeleteIssue/DeleteIssueAlert";
import { useColorScheme } from "../../../common/color-scheme";

export function DeleteButton({
  mounted,
  issueKey,
}: {
  mounted: boolean;
  issueKey: string;
}) {
  const colorScheme = useColorScheme();
  const [issuePopoverOpened, setIssuePopoverOpened] = useState(false);
  const { ref, hovered } = useHover();

  useEffect(() => {
    if (!mounted && !hovered) {
      setIssuePopoverOpened(false);
    }
  }, [mounted, hovered]);

  return (
    <Box style={{ position: "absolute", bottom: 0, right: 11 }}>
      <Transition
        mounted={mounted || hovered}
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
            withinPortal={false}
            onChange={setIssuePopoverOpened}
          >
            <Popover.Target>
              <ActionIcon
                color="red"
                size="sm"
                variant="transparent"
                style={styles}
                onClick={(e) => {
                  e.stopPropagation();
                  setIssuePopoverOpened(!issuePopoverOpened);
                }}
              >
                <IconTrash />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown
              style={(theme) => ({
                background:
                  colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
              })}
            >
              <Box
                ref={ref}
                h="20px"
                w="inherit"
                left="0px"
                top="-10px"
                pos="absolute"
                onClick={(e) => e.stopPropagation()}
              />
              <DeleteIssueAlert
                issueKey={issueKey}
                cancelAlert={() => setIssuePopoverOpened(false)}
                confirmAlert={() => setIssuePopoverOpened(false)}
              />
            </Popover.Dropdown>
          </Popover>
        )}
      </Transition>
    </Box>
  );
}
