import { Box, Button, Center, Divider, Flex, Group, ScrollArea, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
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
import { ProjectDependingView } from "../common/ProjectDependingView/ProjectDependingView";

export function BacklogView() {
  const colorScheme = useColorScheme();

  resizeDivider();

  const { selectedProject, selectedProjectBoardIds: boardIds } = useCanvasStore();
  const projectKey = selectedProject?.key;
  const currentBoardId = boardIds[0];

  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false);
  const [createExportModalOpened, setCreateExportModalOpened] = useState(false);

  const [search, setSearch] = useState("");

  const { data: sprints, isError: isErrorSprints, isFetching: isFetchingSprints } = useQuery({
    queryKey: ["sprints", currentBoardId],
    queryFn: () => getSprints(currentBoardId),
    enabled: !!currentBoardId,
    select: (fetchedSprints: Sprint[]) => Object.fromEntries(fetchedSprints.map((s) => [s.id, s])),
    initialData: [],
  });

  const issueQueries = useQueries<Array<UseQueryOptions<Issue[], unknown, [string, IssuesState]>>>({
    queries: [
      {
        queryKey: ["issues", projectKey, currentBoardId], // IMPROVE: Change this issue key to contain "backlog"
        queryFn: () => getBacklogIssues(projectKey, currentBoardId),
        enabled: !!projectKey,
        select: (backlogIssues: Issue[]): [string, IssuesState] => [
          BacklogKey,
          {
            issues: backlogIssues
              .filter((issue: Issue) => issue.type !== "Epic" && issue.type !== "Subtask")
              .sort(sortIssuesByRank),
            sprintId: undefined,
          },
        ],
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
                .filter((issue: Issue) => issue.type !== "Epic" && issue.type !== "Subtask")
                .sort(sortIssuesByRank),
              sprintId: sprint.id,
            },
          ],
        }),
      ),
    ],
    combine: (results) => results.map((result) => result),
  });

  const [issuesWrapper, setIssuesWrapper] = useState(
    new Map<string, IssuesState>(),
  );
  useEffect(() => {
    // Generally, using useEffect to sync state should be avoided. But since we need our state to be assignable AND
    // reactive AND derivable, we found no other solution than to use useEffect.
    if (issueQueries.some((query) => query.isPending)) {
      setIssuesWrapper(new Map<string, IssuesState>([
        [BacklogKey, { issues: [], sprintId: undefined }] as [string, IssuesState],
        ...(Object.values(sprints).map((sprint) => [sprint.name, { issues: [], sprintId: sprint.id }]) as [string, IssuesState][]),
      ]));
    } else {
      setIssuesWrapper(
        new Map<string, IssuesState>(issueQueries.map((query) => query.data!)),
      );
    }
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

  if (isErrorSprints || issueQueries.some((query) => query.isError)) {
    return (
      <Center style={{ width: "100%", height: "100%" }}>
        <Text w="500">An internal error has occurred while loading. Please submit a report to the developers.</Text>
      </Center>
    );
  }

  return (
    <ProjectDependingView
      title="Backlog"
      rightHeader={(
        <Group>
          <Button
            ml="auto"
            size="xs"
            onClick={() => setCreateExportModalOpened(true)}
          >
            Export
          </Button>
          <ReloadButton mr="xs" />
        </Group>
      )}
      searchBar={(
        <TextInput
          placeholder="Search by issue summary, key, epic, labels, creator or assignee.."
          leftSection={<IconSearch size={14} stroke={1.5} />}
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setSearch(event.currentTarget.value);
          }}
        />
      )}
      isLoadingContent={isFetchingSprints || issueQueries.some((query) => query.isFetching)}
    >
      <CreateExportModal
        opened={createExportModalOpened}
        setOpened={setCreateExportModalOpened}
      />

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
              maxHeight: "100vh",
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
              setOpened={setCreateIssueModalOpened}
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
    </ProjectDependingView>
  );
}
