import {
  Button,
  Divider,
  FileInput,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconFileUpload } from "@tabler/icons"
import { useQuery } from "@tanstack/react-query"
import { Dispatch, SetStateAction } from "react"
import { useCanvasStore } from "../../lib/Store"
import { getIssueTypes } from "../projects-view/queryFetchers"
import { RichText } from "./RichText"

export function CreateIssueModal({
  opened,
  setOpened,
}: {
  opened: boolean
  setOpened: Dispatch<SetStateAction<boolean>>
}) {
  const projects = useCanvasStore((state) => state.projects)
  const selectedProject = useCanvasStore((state) => state.selectedProject)

  const theme = useMantineTheme()
  const form = useForm<{
    project: string
    issueType: string
    summary: string
    assignee: string
    sprint: string
    status: string
    storyPointsEstimate: number
    attachement: string
    reporter: string
  }>({
    initialValues: {
      project: selectedProject?.name || "",
      issueType: "",
      summary: "",
      assignee: "",
      sprint: "",
      status: "",
      storyPointsEstimate: 0,
      attachement: "",
      reporter: "",
    },
  })
  const { data: issueTypes, isLoading } = useQuery({
    queryKey: ["issueTypes", form.getInputProps("project").value],
    queryFn: () => getIssueTypes(form.getInputProps("project").value!),
    enabled: !!form.getInputProps("project").value,
  })
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Create Issue"
      size="70%"
      overflow="inside"
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
    >
      <form onSubmit={form.onSubmit(() => {})}>
        <Stack spacing="md">
          <Select
            label="Project"
            placeholder="Project"
            nothingFound="No options"
            data={projects.map((project) => ({
              value: project.id,
              label: `${project.name} (${project.key})`,
            }))}
            searchable
            required
            {...form.getInputProps("project")}
            onChange={(value) => {
              form.getInputProps("project").onChange(value)
              form.setFieldValue("issueType", "")
              form.setFieldValue("status", "")
            }}
          />
          <Select
            label="Issue Type"
            placeholder="Story"
            nothingFound="No options"
            data={
              !isLoading && issueTypes
                ? issueTypes?.map((issueType) => issueType.name)
                : []
            }
            searchable
            required
            {...form.getInputProps("issueType")}
          />
          <Divider m={10} />
          <Select
            label="Status"
            placeholder="To do"
            nothingFound="No options"
            data={
              !isLoading && issueTypes
                ? issueTypes
                    .find(
                      (issueType) =>
                        issueType.name === form.getInputProps("issueType").value
                    )
                    ?.statuses?.map((status) => status.name) || []
                : []
            }
            {...form.getInputProps("status")}
          />
          <TextInput
            label="Summary"
            withAsterisk
            {...form.getInputProps("summary")}
          />
          <RichText />
          <Select
            label="Assignee"
            placeholder="Unassigned"
            nothingFound="No options"
            data={["Person 1", "Person 2", "Person 3", "Person 4"]}
            searchable
            {...form.getInputProps("assignee")}
          />
          <Select
            label="Sprint"
            placeholder="Sprint 1"
            nothingFound="No options"
            data={["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4"]}
            searchable
            {...form.getInputProps("sprint")}
          />
          <NumberInput
            label="Story Point Estimate"
            {...form.getInputProps("storyPointsEstimate")}
          />
          <Select
            label="Reporter"
            placeholder="Person 1 "
            nothingFound="No options"
            data={["Person 1", "Person 2", "Person 3", "Person 4"]}
            searchable
            required
            {...form.getInputProps("reporter")}
          />
          <FileInput
            label="Attachement"
            placeholder="Upload Files"
            icon={<IconFileUpload />}
            multiple
            {...form.getInputProps("attachement")}
          />
          <Group position="right">
            <Button
              variant="light"
              color="gray"
              onClick={() => setOpened(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
