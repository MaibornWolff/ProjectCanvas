import {
  Button,
  Divider,
  FileInput,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { IconFileUpload } from "@tabler/icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { Dispatch, SetStateAction } from "react"
import { useCanvasStore } from "../../lib/Store"
import {
  createNewIssue,
  getAssignableUsersByProject,
  getIssueTypes,
} from "./queryFunctions"

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
  const form = useForm<Issue>({
    initialValues: {
      projectId: selectedProject?.id || "0",
      type: "",
      summary: "",
      description: "",
      assignee: { id: "" },
      sprintId: "",
      status: "",
      storyPointsEstimate: 0,
      attachement: "",
      reporter: "",
    } as Issue,
  })
  const { data: issueTypes, isLoading } = useQuery({
    queryKey: ["issueTypes", form.getInputProps("projectId").value],
    queryFn: () => getIssueTypes(form.getInputProps("projectId").value!),
    enabled: !!form.getInputProps("projectId").value,
  })
  const { data: assignableUsers } = useQuery({
    queryKey: ["assignableUsers", form.getInputProps("projectId").value],
    queryFn: () =>
      getAssignableUsersByProject(form.getInputProps("projectId").value!),
    enabled: !!form.getInputProps("projectId").value,
  })
  const mutation = useMutation({
    mutationFn: (issue: Issue) => createNewIssue(issue),
    onError: () => {
      showNotification({
        message: `The issue couldn't be created! 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `The issue has been created`,
      })
    },
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
      <form
        onSubmit={form.onSubmit((issue, event) => {
          event.preventDefault()
          mutation.mutate(issue)
        })}
      >
        <Stack spacing="md">
          <Select
            label="Project"
            placeholder="Project"
            nothingFound="No Options"
            data={projects.map((project) => ({
              value: project.id,
              label: `${project.name} (${project.key})`,
            }))}
            searchable
            required
            {...form.getInputProps("projectId")}
            onChange={(value) => {
              form.getInputProps("projectId").onChange(value)
              form.setFieldValue("type", "")
              form.setFieldValue("status", "")
              form.setFieldValue("assignee.id", "")
            }}
          />
          <Select
            label="Issue Type"
            placeholder="Story"
            nothingFound="No Options"
            data={
              !isLoading && issueTypes && issueTypes instanceof Array
                ? issueTypes.map((issueType) => ({
                    value: issueType.id,
                    label: issueType.name,
                  }))
                : []
            }
            searchable
            required
            {...form.getInputProps("type")}
          />
          <Divider m={10} />
          <Select
            label="Status"
            placeholder="To Do"
            nothingFound={
              form.getInputProps("type").value === ""
                ? "Please Select an Issue Type First."
                : "No Options"
            }
            data={
              !isLoading && issueTypes && issueTypes instanceof Array
                ? issueTypes
                    .find(
                      (issueType) =>
                        issueType.id === form.getInputProps("type").value
                    )
                    ?.statuses?.map((status) => status.name) || []
                : []
            }
            {...form.getInputProps("status")}
          />
          <TextInput
            label="Summary"
            required
            {...form.getInputProps("summary")}
          />
          <Textarea
            label="Description"
            {...form.getInputProps("description")}
          />
          <Select
            label="Assignee"
            placeholder="Unassigned"
            nothingFound="No Options"
            data={
              !isLoading && assignableUsers && assignableUsers instanceof Array
                ? assignableUsers.map((assignableUser) => ({
                    value: assignableUser.accountId,
                    label: assignableUser.displayName,
                  }))
                : []
            }
            searchable
            {...form.getInputProps("assignee.id")}
          />
          <Select
            label="Sprint"
            placeholder=""
            nothingFound="No Options"
            data={[]}
            searchable
            {...form.getInputProps("sprintId")}
          />
          <NumberInput
            label="Story Point Estimate"
            {...form.getInputProps("storyPointsEstimate")}
          />
          <Select
            label="Reporter"
            placeholder="Unassigned"
            nothingFound="No Options"
            data={
              !isLoading && assignableUsers && assignableUsers instanceof Array
                ? assignableUsers.map((assignableUser) => ({
                    value: assignableUser.accountId,
                    label: assignableUser.displayName,
                  }))
                : []
            }
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
