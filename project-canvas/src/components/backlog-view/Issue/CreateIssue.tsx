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
import { useCanvasStore } from "../../../lib/Store"

export function CreateIssue() {
  const projects = useCanvasStore((state) => state.stateProjects)
  const [selectedProjectKey, setSelectedProjectKey] = useState<string | null>(
    ""
  )

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
            value={selectedProjectKey}
            data={projects.map((project) => `${project.name} (${project.key})`)}
            onChange={setSelectedProjectKey}
            w="50%"
            required
          />
          <Select
            label="Issue Type"
            placeholder="Story "
            searchable
            nothingFound="No options"
            data={["Story", "Task", "Bug", "Epic"]}
            w="50%"
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
