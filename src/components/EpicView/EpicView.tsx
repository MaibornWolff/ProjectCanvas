import { Stack, Text, Title, ScrollArea, Box, Button, Center, TextInput } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconSearch } from "@tabler/icons-react";
import { useCanvasStore } from "../../lib/Store";
import { CreateIssueModal } from "../CreateIssue/CreateIssueModal";
import { EpicWrapper } from "./EpicWrapper";
import { getEpics } from "./helpers/queryFetchers";
import { useColorScheme } from "../../common/color-scheme";
import { RouteNames } from "../../route-names";
import { filterSearch } from "./helpers/epicViewHelpers";
import { ProjectDependingView } from "../common/ProjectDependingView/ProjectDependingView";

export function EpicView() {
  const colorScheme = useColorScheme();
  const navigate = useNavigate();

  const { selectedProject } = useCanvasStore();
  const projectKey = selectedProject?.key;

  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false);
  const [search, setSearch] = useState("");

  const { isFetching, data: epics } = useQuery({
    queryKey: ["epics", projectKey],
    queryFn: () => getEpics(projectKey),
    enabled: !!projectKey,
    initialData: [],
  });

  if (!selectedProject) {
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        <Stack align="center">
          <Title>No Project has been selected!</Title>
          <Text>Please go back to the project selection and select a project</Text>
          <Button onClick={() => navigate(RouteNames.PROJECTS_VIEW)}>
            To the project selection
          </Button>
        </Stack>
      </Center>
    );
  }

  const searchedEpics = filterSearch(search, epics);

  return (
    <ProjectDependingView
      title="Epics"
      searchBar={(
        <TextInput
          placeholder="Search by summary, id, creator, labels, status or assignee..."
          leftSection={<IconSearch size={14} stroke={1.5} />}
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setSearch(event.currentTarget.value);
          }}
        />
      )}
      isLoadingContent={isFetching}
    >
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
          <EpicWrapper epics={searchedEpics} />
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
    </ProjectDependingView>
  );
}
