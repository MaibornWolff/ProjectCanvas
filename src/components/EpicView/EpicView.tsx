import {Group, Stack, Text, Title, Flex, ScrollArea, TextInput, Box, Button} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {useCanvasStore} from "../../lib/Store";
import {useState} from "react";
import {CreateIssueModal} from "../CreateIssue/CreateIssueModal";
import {DraggableIssuesWrapper} from "../BacklogView/IssuesWrapper/DraggableIssuesWrapper";
import {Issue, Sprint} from "../../../types";


export function EpicView() : JSX.Element {
  const navigate = useNavigate()
  const projectName = useCanvasStore((state) => state.selectedProject?.name)
  const [search, setSearch] = useState("")
  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false)
  const [searchedissuesWrappers, setSearchedissuesWrappers] = useState(
      new Map<string, { issues: Issue[]; sprint?: Sprint }>()
  )


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
        <CreateIssueModal
            opened={createIssueModalOpened}
            setOpened={setCreateIssueModalOpened}
        />
      </ScrollArea.Autosize>
    </Stack>
  )
}