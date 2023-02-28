import {
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  useMantineTheme,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { Dispatch, SetStateAction } from "react"
import { useCanvasStore } from "../../lib/Store"
import { AssigneeSelect } from "./Fields/AssigneeSelect"
import { AttachementFileInput } from "./Fields/AttachementFileInput"
import { DiscriptionInput } from "./Fields/DescriptionInput"
import { DueDatePicker } from "./Fields/DueDatePicker"
import { EpicSelect } from "./Fields/EpicSelect"
import { IssueTypeSelect } from "./Fields/IssueTypeSelect"
import { LabelsSelect } from "./Fields/LabelsSelect"
import { PrioritySelect } from "./Fields/PrioritySelect"
import { ProjectSelect } from "./Fields/ProjectSelect"
import { ReporterSelect } from "./Fields/ReporterSelect"
import { SprintSelect } from "./Fields/SprintSelect"
import { StartDatePicker } from "./Fields/StartDatePicker"
import { StatusSelect } from "./Fields/StatusSelect"
import { StoryPointsEstimateInput } from "./Fields/StoryPointsEstimateInput"
import { SummaryInput } from "./Fields/SummaryInput"
import {
  createNewIssue,
  getAssignableUsersByProject,
  getBoardIds,
  getCurrentUser,
  getEpicsByProject,
  getIssueTypes,
  getIssueTypesWithFieldsMap,
  getLabels,
  getPriorities,
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

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
  })

  const form = useForm<Issue>({
    initialValues: {
      projectId: selectedProject?.id,
      type: "",
      summary: "",
      description: "",
      assignee: { id: "" },
      status: "To Do",
      reporter: currentUser?.accountId,
      priority: { id: "" },
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
  const { data: labels } = useQuery({
    queryKey: ["labels"],
    queryFn: () => getLabels(),
  })
  const { data: priorities } = useQuery({
    queryKey: ["priorities"],
    queryFn: () => getPriorities(),
  })
  const { data: issueTypesWithFieldsMap } = useQuery({
    queryKey: ["issueTypesWithFieldsMap"],
    queryFn: () => getIssueTypesWithFieldsMap(),
  })
  const mutation = useMutation({
    mutationFn: (issue: Issue) => createNewIssue(issue),
    onError: () => {
      showNotification({
        message: `The issue couldn't be created! 😢`,
        color: "red",
      })
    },
    onSuccess: (issueKey) => {
      showNotification({
        message: `The issue ${issueKey} has been created!`,
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
          <ProjectSelect
            form={form}
            projects={projects}
            currentUser={currentUser}
          />
          <IssueTypeSelect
            form={form}
            issueTypes={issueTypes}
            isLoading={isLoading}
          />
          <Divider m={10} />
          <StatusSelect
            form={form}
            issueTypes={issueTypes}
            isLoading={isLoading}
          />
          <SummaryInput form={form} />
          <DiscriptionInput form={form} />
          <AssigneeSelect
            form={form}
            assignableUsers={assignableUsers}
            isLoading={isLoading}
          />
          <PrioritySelect
            form={form}
            priorities={priorities}
            issueTypesWithFieldsMap={issueTypesWithFieldsMap}
            isLoading={isLoading}
          />
          <SprintSelect
            form={form}
            sprints={sprints}
            issueTypes={issueTypes}
            issueTypesWithFieldsMap={issueTypesWithFieldsMap}
            isLoading={isLoading}
          />
          <EpicSelect
            form={form}
            epics={epics}
            issueTypes={issueTypes}
            issueTypesWithFieldsMap={issueTypesWithFieldsMap}
            isLoading={isLoading}
          />
          <StoryPointsEstimateInput
            form={form}
            issueTypes={issueTypes}
            issueTypesWithFieldsMap={issueTypesWithFieldsMap}
          />
          <ReporterSelect
            form={form}
            currentUser={currentUser}
            assignableUsers={assignableUsers}
            isLoading={isLoading}
          />
          <StartDatePicker
            form={form}
            issueTypesWithFieldsMap={issueTypesWithFieldsMap}
          />
          <DueDatePicker
            form={form}
            issueTypesWithFieldsMap={issueTypesWithFieldsMap}
          />
          <LabelsSelect form={form} labels={labels} />
          <AttachementFileInput form={form} />
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
