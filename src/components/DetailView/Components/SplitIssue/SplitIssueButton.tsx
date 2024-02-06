import { ActionIcon, Box, Button, Menu } from "@mantine/core";
import { IconCaretDown, IconPlus } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useState } from "react";
import classes from "../IssueStatusMenu.module.css";
import { Issue } from "../../../../../types";
import { SelectDropdownSearch } from "./SelectDropdownSearch";

export function SplitIssueButton({
  splitViewModalOpened,
  setSelectedSplitIssues,
  issues,
}:{
  splitViewModalOpened: Dispatch<SetStateAction<boolean>>,
  setSelectedSplitIssues: Dispatch<SetStateAction<string[]>>,
  issues: Issue[],

}) {
  const [opened, setOpened] = useState(false);

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
            <SelectDropdownSearch splitViewModalOpened={splitViewModalOpened} issues={issues} setSelectedSplitIssues={setSelectedSplitIssues} />
          </Menu.Item>

        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
