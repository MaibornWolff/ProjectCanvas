import { Anchor, AppShell, Box, Button, Group, Image } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColorSchemeToggle } from "../common/ColorSchemeToggle";
import { CreateIssueModal } from "../CreateIssue/CreateIssueModal";

import { LogoutButton } from "./LogoutButton";
import { StoryMapMenu } from "./StoryMapMenu";
import { RouteNames } from "../../route-names";

import classes from "./LayoutHeader.module.css";

export function LayoutHeader() {
  const navigate = useNavigate();
  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false);

  return (
    <AppShell.Header p="sm" className={classes.root}>
      <Box
        style={(theme) => ({
          paddingLeft: theme.spacing.xs,
          paddingRight: theme.spacing.xs,
        })}
      >
        <Group gap="xl">
          <Image
            src="./project_canvas_logo_sm.svg"
            height={36}
            width={36}
            fit="contain"
          />
          <Anchor
            component="button"
            type="button"
            onClick={() => navigate(RouteNames.PROJECTS_VIEW)}
          >
            Projects
          </Anchor>
          <Anchor
            component="button"
            type="button"
            onClick={() => navigate(RouteNames.BACKLOG_VIEW)}
          >
            Backlog
          </Anchor>
          <Anchor
            component="button"
            type="button"
            onClick={() => navigate(RouteNames.EPIC_VIEW)}
          >
            Epics
          </Anchor>
          <StoryMapMenu />
          <Button onClick={() => setCreateIssueModalOpened(true)}>
            Create
          </Button>
          <CreateIssueModal
            opened={createIssueModalOpened}
            setOpened={setCreateIssueModalOpened}
          />
          <ColorSchemeToggle size="34px" ml="auto" />
          <LogoutButton />
        </Group>
      </Box>
    </AppShell.Header>
  );
}
