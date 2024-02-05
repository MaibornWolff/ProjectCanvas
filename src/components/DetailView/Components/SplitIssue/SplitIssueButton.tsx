import { ActionIcon, Box, Button, Menu } from "@mantine/core";
import { IconCaretDown, IconPlus } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import classes from "../IssueStatusMenu.module.css";
import { Issue } from "../../../../../types";
import { getIssuesByProject } from "../../../BacklogView/helpers/queryFetchers";
import { useCanvasStore } from "../../../../lib/Store";
import { SelectDropdownSearch } from "./SelectDropdownSearch";

export function SplitIssueButton({
  splitViewModalOpened,
}:{
  splitViewModalOpened: Dispatch<SetStateAction<boolean>>,
}) {
  const boardId = useCanvasStore((state) => state.selectedProjectBoardIds)[0];
  const {
    selectedProject: project,
  } = useCanvasStore();

  const [opened, setOpened] = useState(false);

  const { data: issues } = useQuery<unknown, unknown, Issue[]>({
    queryKey: ["issues", project?.key],
    queryFn: () => project && getIssuesByProject(project.key, boardId),
    enabled: !!project?.key,
    initialData: [],
  });

  return (
    <Box className={classes.root} mod={{ opened }}>
      <Menu
        shadow="md"
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
        opened={opened}
        closeOnItemClick={false}
      >
        <Menu.Target>
          <Button rightSection={<IconCaretDown className={classes.icon} />}>
            Split Issue
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>
            <Button fullWidth>
              <ActionIcon>
                <IconPlus size={20} />
              </ActionIcon>
              create new Issue
            </Button>
          </Menu.Item>
          <Menu.Item>
            <SelectDropdownSearch issueNames={issues.map((issue) => issue.summary)} splitViewModalOpened={splitViewModalOpened} />
          </Menu.Item>

        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
