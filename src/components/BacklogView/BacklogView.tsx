import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { QueriesResults, useQueries, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { Issue, Sprint } from "types";
import { UseQueryOptions } from "@tanstack/react-query/src/types";
import { useCanvasStore } from "../../lib/Store";
import { CreateIssueModal } from "../CreateIssue/CreateIssueModal";
import { CreateExportModal } from "../CreateExport/CreateExportModal";
import { CreateSprint } from "./CreateSprint/CreateSprint";
import { BacklogKey, IssuesState, searchMatchesIssue, sortIssuesByRank } from "./helpers/backlogHelpers";
import { onDragEnd } from "./helpers/draggingHelpers";
import { getBacklogIssues, getIssuesBySprint, getSprints } from "./helpers/queryFetchers";
import { resizeDivider } from "./helpers/resizeDivider";
import { DraggableIssuesWrapper } from "./IssuesWrapper/DraggableIssuesWrapper";
import { SprintsPanel } from "./IssuesWrapper/SprintsPanel";
import { ReloadButton } from "./ReloadButton";
import { useColorScheme } from "../../common/color-scheme";
import { RouteNames } from "../../route-names";

export function BacklogView() {
  const colorScheme = useColorScheme();
  const navigate = useNavigate();
  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false);
  const projectName = useCanvasStore((state) => state.selectedProject?.name);
  const projectKey = useCanvasStore((state) => state.selectedProject?.key);
  const boardIds = useCanvasStore((state) => state.selectedProjectBoardIds);
  const currentBoardId = boardIds[0];
  const [search, setSearch] = useState("");
  const [createExportModalOpened, setCreateExportModalOpened] = useState(false);

  const { data: sprints, isError: isErrorSprints } = useQuery({
    queryKey: ["sprints", currentBoardId],
    queryFn: () => getSprints(currentBoardId),
    enabled: !!currentBoardId,
    select: (fetchedSprints: Sprint[]) => Object.fromEntries(fetchedSprints.map((s) => [s.id, s])),
    initialData: [],
  });

  const issueQueries = useQueries<
  Array<UseQueryOptions<Issue[], unknown, [string, IssuesState]>>
  >({
    queries: [
      {
        queryKey: ["issues", projectKey, currentBoardId], // IMPROVE: Change this issue key to contain "backlog"
        queryFn: () => getBacklogIssues(projectKey, currentBoardId),
        enabled: !!projectKey,
        select: (backlogIssues: Issue[]): [string, IssuesState] => [
          BacklogKey,
          {
            issues: backlogIssues
              .filter(
                (issue: Issue) => issue.type !== "Epic" && issue.type !== "Subtask",
              )
              .sort(sortIssuesByRank),
            sprintId: undefined,
          },
        ],
        initialData: [],
      },
      ...Object.values(sprints).map(
        (sprint): UseQueryOptions<Issue[], unknown, [string, IssuesState]> => ({
          queryKey: [
            "issues",
            "sprints",
            projectKey,
            Object.keys(sprints),
            sprint.id,
          ], // IMPROVE: Change this issue key to not contain sprints
          queryFn: () => getIssuesBySprint(sprint.id),
          enabled: !!projectKey && !!sprints && !isErrorSprints,
          select: (issues: Issue[]) => [
            sprint.name,
            {
              issues: issues
                .filter(
                  (issue: Issue) => issue.type !== "Epic" && issue.type !== "Subtask",
                )
                .sort(sortIssuesByRank),
              sprintId: sprint.id,
            },
          ],
          initialData: [],
        }),
      ),
    ],
    combine: (
      results: QueriesResults<
      Array<UseQueryOptions<Issue[], unknown, [string, IssuesState]>>
      >,
    ) => results.map((result) => result),
  });

  const [issuesWrapper, setIssuesWrapper] = useState(
    new Map<string, IssuesState>(),
  );
  useEffect(() => {
    // Generally, using useEffect to sync state should be avoided. But since we need our state to be assignable AND
    // reactive AND derivable, we found no other solution than to use useEffect.
    setIssuesWrapper(
      new Map<string, IssuesState>(issueQueries.map((query) => query.data!)),
    );
  }, [issueQueries]);
  const updateIssuesWrapper = (key: string, newState: IssuesState) => setIssuesWrapper(new Map(issuesWrapper.set(key, newState)));
  const searchedIssuesWrapper = useMemo(
    () => new Map<string, Issue[]>(
      Array.from(issuesWrapper.keys()).map((key) => [
        key,
        issuesWrapper
          .get(key)!
          .issues.filter((i) => searchMatchesIssue(search, i)),
      ]),
    ),
    [issuesWrapper, search],
  );

  useEffect(resizeDivider, [issueQueries]);

  if (isErrorSprints || issueQueries.some((query) => query.isError)) {
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        <Text w="300">
          An error has occurred while loading. This is due to an internal error.
          Please report this behavior to the developers.
          {" "}
          <br />
          (This is a placeholder and will be replaced with better error
          messages)
        </Text>
      </Center>
    );
  }

  // This check might be broken. It does not trigger everytime we think it does. Might need to force a rerender.
  if (issueQueries.some((query) => query.isPending)) {
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
  }
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
          <Button
            ml="auto"
            size="xs"
            onClick={() => setCreateExportModalOpened(true)}
          >
            Export
          </Button>
          <CreateExportModal
            opened={createExportModalOpened}
            setOpened={setCreateExportModalOpened}
          />
          <ReloadButton mr="xs" />
        </Group>
        <Title mb="sm">Backlog</Title>
        <TextInput
          placeholder="Search by issue summary, key, epic, labels, creator or assignee.."
          leftSection={<IconSearch size={14} stroke={1.5} />}
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setSearch(event.currentTarget.value);
          }}
        />
      </Stack>

      <Flex style={{ flexGrow: 1 }}>
        <DragDropContext
          onDragEnd={(dropResult) => onDragEnd({
            ...dropResult,
            issuesWrapper,
            updateIssuesWrapper,
          })}
        >
          <ScrollArea.Autosize
            className="left-panel"
            w="50%"
            p="sm"
            style={{
              maxHeight: "calc(100vh - 230px)",
              minWidth: "260px",
            }}
          >
            {searchedIssuesWrapper.get(BacklogKey) && ( // IMPROVE: Maybe this check can be removed entirely, please evaluate
              <Box mr="xs">
                <DraggableIssuesWrapper
                  id="Backlog"
                  issues={searchedIssuesWrapper.get(BacklogKey)!}
                />
              </Box>
            )}
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
                + Create Issue
              </Button>
            </Box>
            <CreateIssueModal
              opened={createIssueModalOpened}
              onCancel={() => setCreateIssueModalOpened(false)}
              onCreate={() => setCreateIssueModalOpened(false)}
            />
          </ScrollArea.Autosize>
          <Divider
            mr="xs"
            size="xl"
            className="resize-handle"
            orientation="vertical"
            style={{
              cursor: "col-resize",
            }}
          />
          <ScrollArea.Autosize
            className="right-panel"
            w="50%"
            p="xs"
            style={{
              maxHeight: "calc(100vh - 230px)",
              minWidth: "260px",
            }}
          >
            <SprintsPanel
              sprints={sprints}
              issueWrapper={Object.fromEntries(
                Array.from(searchedIssuesWrapper.keys())
                  .filter((key) => key !== BacklogKey)
                  .map((key) => [
                    issuesWrapper.get(key)!.sprintId,
                    searchedIssuesWrapper.get(key)!,
                  ]),
              )}
            />
            <CreateSprint />
          </ScrollArea.Autosize>
        </DragDropContext>
      </Flex>
    </Stack>
  );
}
