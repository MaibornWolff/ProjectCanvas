import { useState } from "react"
import {
  Button,
  Divider,
  FileInput,
  Group,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  Stack,
  TextInput,
} from "@mantine/core"
import { IconFileUpload } from "@tabler/icons"
import { CustomDatePicker } from "./CustomDatePicker"
import { RichText } from "./RichText"
import { useCanvasStore } from "../../lib/Store"

export function CreateIssue() {
  const projects = useCanvasStore((state) => state.projects)
  const issueTypes = useCanvasStore((state) => state.issueTypes)
  const mappedIssueTypes = issueTypes.reduce((map, issueType) => {
    const key = issueType.scopeProjectId || -1
    const names = map.get(key) || []
    names.push(issueType.name)
    return map.set(key, names)
  }, new Map())

  const [selectedProjectInfo, setSelectedProjectInfo] = useState<{
    name: string | null
    id: number | undefined
  }>({
    name: "",
    id: -1,
  })

  return (
    <Stack sx={{ overflow: "hidden" }}>
      <ScrollArea>
        <Paper sx={{ height: "500px" }}>
          <CustomDatePicker />
          <Select
            label="Project"
            placeholder="Project "
            searchable
            nothingFound="No options"
            value={selectedProjectInfo.name}
            data={projects.map((project) => `${project.name} (${project.key})`)}
            onChange={(value) => {
              const selectedProject = projects.find(
                (project) => `${project.name} (${project.key})` === value
              )
              setSelectedProjectInfo({ name: value, id: selectedProject?.id })
            }}
            w="50%"
            required
          />
          <Select
            label="Issue Type"
            placeholder="Story"
            nothingFound="No options"
            data={
              Array.from(mappedIssueTypes.keys()).includes(
                selectedProjectInfo.id
              )
                ? mappedIssueTypes.get(selectedProjectInfo.id)
                : mappedIssueTypes.get(-1)
            }
            w="50%"
            searchable
            required
          />
          <Divider m={10} />
          <Select
            label="Status"
            placeholder="To do"
            nothingFound="No options"
            data={["To do", "In Progress", "Review", "Done"]}
            w="50%"
            c="gray"
          />
          <TextInput label="Summary" withAsterisk />
          <RichText />
          <Select
            label="Assignee"
            placeholder="Unassigned"
            searchable
            nothingFound="No options"
            data={["Person 1", "Person 2", "Person 3", "Person 4"]}
            w="50%"
          />
          <Select
            label="Sprint"
            placeholder="Sprint 1 "
            searchable
            nothingFound="No options"
            data={["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4"]}
            w="50%"
          />
          <NumberInput label="Story Point Estimate" w="50%" />
          <Select
            label="Reporter"
            placeholder="Person 1 "
            searchable
            nothingFound="No options"
            data={["Person 1", "Person 2", "Person 3", "Person 4"]}
            w="50%"
            required
          />
          <FileInput
            label="Attachement"
            placeholder="Upload Files"
            icon={<IconFileUpload />}
            multiple
          />
        </Paper>
      </ScrollArea>

      <Group display="flex" sx={{ justifyContent: "flex-end" }}>
        <Button variant="light" w="10%" color="gray.8">
          cancel
        </Button>
        <Button type="submit" w="10%">
          Create
        </Button>
      </Group>
    </Stack>
  )
}
