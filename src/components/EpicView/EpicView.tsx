import {Group, Stack, Text, Title, Flex, ScrollArea, TextInput} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {useCanvasStore} from "../../lib/Store";
import {IconSearch} from "@tabler/icons";
import {useState} from "react";


export function EpicView() : JSX.Element {
  const navigate = useNavigate()
  const projectName = useCanvasStore((state) => state.selectedProject?.name)
  const [search, setSearch] = useState("")

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

      <Flex sx={{ flexGrow: 1 }}>
        <ScrollArea.Autosize
          className="main-panel"
          maxHeight="calc(100vh - 230px)"
          w="100%"
          p="sm"
          sx={{
            minWidth: "260px",
          }}
        >
          //TODO some component containing Epics
        </ScrollArea.Autosize>
      </Flex>
    </Stack>
  )
}