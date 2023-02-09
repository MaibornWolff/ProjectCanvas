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
import { DatePicker } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { IconFileUpload } from "@tabler/icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { Dispatch, SetStateAction } from "react"
import { useCanvasStore } from "../../lib/Store"
import {
  createNewIssue,
  getAssignableUsersByProject,
  getEpicsByProject,
  getIssueTypes,
  getBoardIds,
  getSprints,
} from "./queryFunctions"

export function CreateIssueModal({
  opened,
  setOpened,
}: {
  opened: boolean
  setOpened: Dispatch<SetStateAction<boolean>>
}) {
  const queryClient = useQueryClient()
  const theme = useMantineTheme()

  const projects = useCanvasStore((state) => state.projects)
  const selectedProject = useCanvasStore((state) => state.selectedProject)

  const form = useForm<Issue>({
    initialValues: {
      projectId: selectedProject?.id,
      type: "",
      summary: "",
      description: "",
      assignee: { id: "" },
      status: "To Do",
      reporter: "",
    } as Issue,
  })
  const { data: issueTypes, isLoading } = useQuery({
    queryKey: ["issueTypes", form.getInputProps("projectId").value],
    queryFn: () => getIssueTypes(form.getInputProps("projectId").value!),
    enabled: !!projects && !!form.getInputProps("projectId").value,
  })
  const { data: assignableUsers } = useQuery({
    queryKey: ["assignableUsers", form.getInputProps("projectId").value],
    queryFn: () =>
      getAssignableUsersByProject(form.getInputProps("projectId").value!),
    enabled: !!projects && !!form.getInputProps("projectId").value,
  })
  const { data: boardIds } = useQuery({
    queryKey: ["boards", form.getInputProps("projectId").value],
    queryFn: () => getBoardIds(form.getInputProps("projectId").value!),
    enabled: !!projects && !!form.getInputProps("projectId").value,
  })
  const { data: sprints } = useQuery({
    queryKey: ["sprints"],
    // TODO: fetch when boards are fetched (iterate over all boards) or select a specific one
    queryFn: () => getSprints(boardIds![0]),
    enabled: !!projects && !!boardIds && !!boardIds[0],
  })
  const { data: epics } = useQuery({
    queryKey: ["epics", form.getInputProps("projectId").value],
    queryFn: () => getEpicsByProject(form.getInputProps("projectId").value!),
    enabled: !!projects && !!form.getInputProps("projectId").value,
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
        message: `The issue has been created!`,
        color: "green",
      })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      setOpened(false)
      form.reset()
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
              form.setFieldValue("assignee.id", null)
            }}
          />
          <Select
            label="Issue Type"
            placeholder="Story"
            nothingFound="No Options"
            data={
              !isLoading && issueTypes && issueTypes instanceof Array
                ? issueTypes
                    .filter((issueType) => issueType.name !== "Subtask")
                    .map((issueType) => ({
                      value: issueType.id,
                      label: issueType.name,
                    }))
                : []
            }
            searchable
            required
            {...form.getInputProps("type")}
            onChange={(value) => {
              form.getInputProps("type").onChange(value)
              form.setFieldValue("status", "To Do")
              form.setFieldValue("startDate", null)
              form.setFieldValue("dueDate", null)
            }}
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
            clearable
            searchable
            {...form.getInputProps("assignee.id")}
          />
          <Select
            label="Sprint"
            placeholder="Backlog"
            nothingFound="No Options"
            data={
              !isLoading && sprints && sprints instanceof Array
                ? sprints.map((sprint) => ({
                    value: sprint.id,
                    label: sprint.name,
                  }))
                : []
            }
            searchable
            clearable
            {...form.getInputProps("sprintId")}
          />
          {form.getInputProps("type").value !==
            issueTypes?.find((issueType) => issueType.name === "Epic")?.id && (
            <Select
              label="Epic"
              placeholder=""
              nothingFound="No Options"
              data={
                epics && epics instanceof Array
                  ? epics.map((epic) => ({
                      value: epic.issueKey,
                      label: epic.summary,
                    }))
                  : []
              }
              searchable
              clearable
              {...form.getInputProps("epic")}
            />
          )}

          <NumberInput
            min={0}
            label="Story Point Estimate"
            defaultValue={null}
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
            clearable
            required
            {...form.getInputProps("reporter")}
          />
          {form.getInputProps("type").value ===
            issueTypes?.find((issueType) => issueType.name === "Epic")?.id && (
            <DatePicker
              label="Start Date"
              placeholder=""
              clearable
              {...form.getInputProps("startDate")}
              onChange={(value) => {
                form.getInputProps("startDate").onChange(value)
                if (
                  value &&
                  form.getInputProps("dueDate").value &&
                  form.getInputProps("dueDate").value < value
                )
                  form.setFieldValue("dueDate", null)
              }}
            />
          )}
          {form.getInputProps("type").value ===
            issueTypes?.find((issueType) => issueType.name === "Epic")?.id && (
            <DatePicker
              label="Due Date"
              placeholder=""
              minDate={form.getInputProps("startDate").value}
              clearable
              {...form.getInputProps("dueDate")}
            />
          )}
          <FileInput
            label="Attachement"
            placeholder="Upload Files"
            icon={<IconFileUpload />}
            multiple
            disabled
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