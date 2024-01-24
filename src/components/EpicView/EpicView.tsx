import {
  Group,
  Stack,
  Text,
  Title,
  ScrollArea,
  Box,
  Button,
  Center,
  Loader,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCanvasStore } from "../../lib/Store";
import { CreateIssueModal } from "../CreateIssue/CreateIssueModal";
import { EpicWrapper } from "./EpicWrapper";
import { getEpics } from "./helpers/queryFetchers";
import { useColorScheme } from "../../common/color-scheme";
import { RouteNames } from "../../route-names";

export function EpicView() {
  const colorScheme = useColorScheme();
  const navigate = useNavigate();
  const projectName = useCanvasStore((state) => state.selectedProject?.name);
  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false);
  const projectKey = useCanvasStore((state) => state.selectedProject?.key);

  const { isLoading: isLoadingEpics, data: epics } = useQuery({
    queryKey: ["epics", projectKey],
    queryFn: () => getEpics(projectKey),
    enabled: !!projectKey,
    initialData: [],
  });
  if (isLoadingEpics)
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        {projectKey ? (
          <Loader />
        ) : (
          <Stack align="center">
            <Title>No Project has been selected!</Title>
            <Text>
              Please go back to the Projects View section and select a project
            </Text>
            <Button onClick={() => navigate(RouteNames.PROJECTS_VIEW)}>
              Go back
            </Button>
          </Stack>
        )}
      </Center>
    );
  return (
    <Stack style={{ minHeight: "100%" }}>
      <Stack align="left" gap={0}>
        <Group>
          <Group gap="xs" c="dimmed">
            <Text
              onClick={() => navigate(RouteNames.PROJECTS_VIEW)}
              style={{
                ":hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              Projects
            </Text>
            <Text>/</Text>
            <Text>{projectName}</Text>
          </Group>
        </Group>
        <Title mb="sm">Epics</Title>
      </Stack>
      <ScrollArea.Autosize
        className="main-panel"
        w="100%"
        p="sm"
        style={{
          minWidth: "260px",
          maxHeight: "calc(100vh - 230px)",
        }}
      >
        <Box mr="xs">
          <EpicWrapper epics={epics} />
        </Box>
        <Box mr="xs">
          <Button
            mt="sm"
            mb="xl"
            variant="subtle"
            color="gray"
            radius="sm"
            display="flex"
            fullWidth
            onClick={() => setCreateIssueModalOpened(true)}
            style={(theme) => ({
              justifyContent: "left",
              ":hover": {
                background:
                  colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[4],
              },
            })}
          >
            + Create Epic
          </Button>
        </Box>
        <CreateIssueModal
          opened={createIssueModalOpened}
          setOpened={setCreateIssueModalOpened}
        />
      </ScrollArea.Autosize>
    </Stack>
  );
}
