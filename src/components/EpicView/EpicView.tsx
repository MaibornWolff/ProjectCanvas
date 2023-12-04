import {Group, Stack, Text, Title, Flex, ScrollArea, TextInput, Box, Button} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {useCanvasStore} from "../../lib/Store";
import {useState} from "react";
import {CreateIssueModal} from "../CreateIssue/CreateIssueModal";
import {Issue, Priority, Sprint, User} from "../../../types";
import {EpicCard} from "./EpicCard";



export function EpicView() : JSX.Element {
  const navigate = useNavigate()
  const projectName = useCanvasStore((state) => state.selectedProject?.name)
  const [search, setSearch] = useState("")
  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false)
  const [searchedissuesWrappers, setSearchedissuesWrappers] = useState(
      new Map<string, { issues: Issue[]; sprint?: Sprint }>()
  )

  const epic: Issue = {
    issueKey: 'ISSUE-1',
    summary: 'Bug fix',
    creator: 'John Doe',
    status: 'To Do',
    type: 'Bug',
    description: 'This is a bug',
    storyPointsEstimate: 2,
    epic: 'Epic-1',
    labels: ['bug', 'URGENT'],
    assignee: undefined,
    rank: 'High',
    reporter: {
      id: '2',
      name: 'Jane Doe',
      displayName: 'Jane',
      emailAddress: 'jane.doe@example.com',
      avatarUrls: {
        '16x16': 'http://example.com/avatar16.png',
        '24x24': 'http://example.com/avatar24.png',
        '32x32': 'http://example.com/avatar32.png',
        '48x48': 'http://example.com/avatar48.png',
      },
    },
    sprint: undefined,
    projectId: 'Project-1',
    subtasks: [
      {
        id: 'Subtask-1',
        key: 'SUB-1',
        fields: {
          summary: 'Subtask summary',
        },
      },
    ],
    created: '2023-01-01T00:00:00',
    updated: '2023-01-01T00:00:00',
    comment: {
      comments: [
        {
          id: 'Comment-1',
          author: {
            id: '3',
            name: 'Bob Doe',
            displayName: 'Bob',
            emailAddress: 'bob.doe@example.com',
            avatarUrls: {
              '16x16': 'http://example.com/avatar16.png',
              '24x24': 'http://example.com/avatar24.png',
              '32x32': 'http://example.com/avatar32.png',
              '48x48': 'http://example.com/avatar48.png',
            },
          },
          body: 'Comment body',
          created: '2023-01-01T00:00:00',
          updated: '2023-01-01T00:00:00',
        },
      ],
    },
    startDate: new Date('2023-01-01T00:00:00'),
    dueDate: new Date('2023-01-01T00:00:00'),
    priority: {
      statusColor: '#FF0000',
      description: 'High priority',
      iconUrl: 'http://example.com/icon.png',
      name: 'High',
      id: '1',
      isDefault: false,
    },
    attachments: [],
  };


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentSearch = event.currentTarget.value
    setSearch(currentSearch)
    //TODO implement search
  }

    return (
    <Stack sx={{ minHeight: "100%"}}>
      <Stack align="left" spacing={0}>
        <Group>
          <Group spacing="xs" c="dimmed">
            <Text
              onClick={() => navigate("/projectsview")}
              sx={{
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
          maxHeight="calc(100vh - 230px)"
          w="100%"
          p="sm"
          sx={{
            minWidth: "260px",
          }}
      >
        TODO wrapper containing Epic Cards (havent seen an Epic Card yet they might need work)
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
              sx={(theme) => ({
                justifyContent: "left",
                ":hover": {
                  background:
                      theme.colorScheme === "dark"
                          ? theme.colors.dark[4]
                          : theme.colors.gray[4],
                },
              })}
          >
            + Create Epic
          </Button>
        </Box>

        <EpicCard
            issueKey={epic.issueKey}
            summary={epic.summary}
            creator={epic.creator}
            status={epic.status}
            type={epic.type}
            description={epic.description}
            storyPointsEstimate={10}
            epic={epic.epic}
            labels={epic.labels}
            rank={epic.rank}
            reporter={epic.reporter}
            projectId={epic.projectId}
            subtasks={epic.subtasks}
            created={epic.created}
            updated={epic.updated}
            comment={epic.comment}
            startDate={epic.startDate}
            dueDate={epic.dueDate}
            priority={epic.priority}
            attachments={epic.attachments}
            index={1}
        >
        </EpicCard>

        <CreateIssueModal
            opened={createIssueModalOpened}
            setOpened={setCreateIssueModalOpened}
        />

      </ScrollArea.Autosize>
    </Stack>
  )
}