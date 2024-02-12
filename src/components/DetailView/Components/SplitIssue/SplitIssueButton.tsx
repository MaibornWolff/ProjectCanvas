import { Box, Button, Menu } from "@mantine/core";
import { IconCaretDown, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import classes from "../IssueStatusMenu.module.css";
import { SelectDropdownSearch } from "./SelectDropdownSearch";
import { CreateNewIssueKey } from "./split-view-constants";

export function SplitIssueButton({
  onIssueSelected,
  selectedSplitIssues,
}:{
  onIssueSelected: (issueKey: string) => void,
  selectedSplitIssues: string[],
}) {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <Box className={classes.root} mod={{ opened: menuOpened }}>
      <Menu
        shadow="md"
        onOpen={() => setMenuOpened(true)}
        onClose={() => {
          setMenuOpened(false);
        }}
        opened={menuOpened}
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
                onIssueSelected(CreateNewIssueKey);
                setMenuOpened(false);
              }}
            >
              <IconPlus size={20} />
              Create new Issue
            </Button>
          </Menu.Item>
          <Menu.Item component="div">
            <SelectDropdownSearch
              onIssueSelected={onIssueSelected}
              selectedSplitIssues={selectedSplitIssues}
            />
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
