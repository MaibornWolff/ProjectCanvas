import { Box, Button, Menu } from "@mantine/core";
import { IconCaretDown, IconPlus } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useState } from "react";
import classes from "../IssueStatusMenu.module.css";
import { Issue } from "../../../../../types";
import { SelectDropdownSearch } from "./SelectDropdownSearch";
import { CreateNewIssueKey } from "./split-view-constants";

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
          <Menu.Item component="div">
            <Button
              fullWidth
              onClick={() => {
                addSelectedIssue(CreateNewIssueKey);
                setCreateSplitViewOpened(true);
                setOpened(false);
              }}
            >
              <IconPlus size={20} />
              Create new Issue
            </Button>
          </Menu.Item>
          <Menu.Item component="div">
            <SelectDropdownSearch
              splitViewModalOpened={setCreateSplitViewOpened}
              issues={issues}
              setSelectedSplitIssues={setSelectedSplitIssues}
              selectedSplitIssues={selectedSplitIssues}
            />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
