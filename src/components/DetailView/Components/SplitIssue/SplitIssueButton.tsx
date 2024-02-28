import { Text, Box, Button, Popover } from "@mantine/core";
import { IconArrowsSplit2, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import classes from "./SplitIssueButton.module.css";
import { SelectDropdownSearch } from "./SelectDropdownSearch";
import { createNewIssueIdentifier } from "./split-view-constants";

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
      <Popover
        shadow="md"
        opened={menuOpened}
      >
        <Popover.Target>
          <Button
            c="div"
            disabled={selectedSplitIssues.length >= 3}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpened(!menuOpened);
            }}
            color="primaryRed"
          >
            <IconArrowsSplit2 className={classes.icon} />
          </Button>
        </Popover.Target>
        <Popover.Dropdown miw={300}>
          <Text mb="sm">Split Issue</Text>

          <Button
            mb="sm"
            fullWidth
            onClick={() => {
              onIssueSelected(createNewIssueIdentifier(selectedSplitIssues.length));
              setMenuOpened(false);
            }}
            color="primaryRed"
          >
            <IconPlus size={20} />
            Create new Issue
          </Button>

          <SelectDropdownSearch
            onIssueSelected={(issueKey) => {
              onIssueSelected(issueKey);
              setMenuOpened(false);
            }}
            selectedSplitIssues={selectedSplitIssues}
          />
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}
