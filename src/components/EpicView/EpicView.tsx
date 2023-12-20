import {Group, Stack, Text, Title, ScrollArea, Box, Button, Center, Loader} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useCanvasStore} from "../../lib/Store";
import {CreateIssueModal} from "../CreateIssue/CreateIssueModal";
import {Issue} from "../../../types";
import {EpicWrapper} from "./EpicWrapper";
import {getEpics} from "./helpers/queryFetchers";



export function EpicView() {
  const navigate = useNavigate()
  const projectName = useCanvasStore((state) => state.selectedProject?.name)
  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false)
  const projectKey = useCanvasStore((state) => state.selectedProject?.key)
  const [EpicWrappers, setEpicWrappers] = useState(
      new Map<string, { issues: Issue[]}>()
  )

  const updateEpicWrapper = (
      key: string,
      value: { issues: Issue[]}
  ) => {
      setEpicWrappers((map) => new Map(map.set(key, value)))
  }

  const {isLoading: isLoadingEpics} =
     useQuery({
          queryKey: ["epics", projectKey],
          queryFn: () => getEpics(projectKey),
          enabled: !!projectKey,
          onSuccess: (epics) => {
              updateEpicWrapper("EpicView", {
                  issues:
                      epics && epics instanceof Array ? epics : []
              })
          },
     })
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
                  <Button onClick={() => navigate("/projectsview")}>Go back</Button>
              </Stack>
          )}
      </Center>
  )
    return (
    <Stack style={{ minHeight: "100%"}}>
      <Stack align="left" gap={0}>
        <Group>
          <Group gap="xs" c="dimmed">
            <Text
              onClick={() => navigate("/projectsview")}
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
            maxHeight: "calc(100vh - 230px)"
          }}
      >
          {EpicWrappers.get("EpicView") &&(
        <Box mr="xs">
            <EpicWrapper epics={EpicWrappers.get("EpicView")!.issues}/>
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
