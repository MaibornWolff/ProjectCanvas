import { ActionIcon, Box, Button, Menu } from "@mantine/core";
import { IconCaretDown, IconPlus } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useState } from "react";
import classes from "../IssueStatusMenu.module.css";
import { Issue } from "../../../../../types";
import { SelectDropdownSearch } from "./SelectDropdownSearch";

export function SplitIssueButton({
  setCreateSplitViewOpened,
  setSelectedSplitIssues,
  issues,
  selectedSplitIssues,
}:{
  setCreateSplitViewOpened: Dispatch<SetStateAction<boolean>>,
  setSelectedSplitIssues: Dispatch<SetStateAction<string[]>>,
  issues: Issue[],
  selectedSplitIssues: string[],

}) {
  const [opened, setOpened] = useState(false);
  const addSelectedIssue = (newIssue: string) => {
    setSelectedSplitIssues((state) => [...state, newIssue]);
  };

  return (
    <Box className={classes.root} mod={{ opened }}>
      <Menu
        shadow="md"
        onOpen={() => setOpened(true)}
        onClose={() => {
          setOpened(false);
        }}
        opened={opened}
        closeOnItemClick={false}
      >
        <Menu.Target>
          <Button disabled={selectedSplitIssues.length === 3} rightSection={<IconCaretDown className={classes.icon} />}>
            Split Issue
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>
            <Button
              fullWidth
              onClick={() => {
                addSelectedIssue("Create new Issue");
                setCreateSplitViewOpened(true);
                setOpened(false);
              }}
            >
              <ActionIcon>
                <IconPlus size={20} />
              </ActionIcon>
              create new Issue
            </Button>
          </Menu.Item>
          <Menu.Item>
            <SelectDropdownSearch splitViewModalOpened={setCreateSplitViewOpened} issues={issues} setSelectedSplitIssues={setSelectedSplitIssues} selectedSplitIssues={selectedSplitIssues} />
          </Menu.Item>

        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
