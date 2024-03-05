import { Button, Divider, Group, Modal, ScrollArea, Stack, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Issue } from "types";
import { useCanvasStore } from "../../lib/Store";
import { ColorSchemeToggle } from "../common/ColorSchemeToggle";
import { getResource, uploadAttachment } from "../DetailView/Components/Attachments/queryFunctions";
import {
  ProjectSelect,
  IssueTypeSelect,
  StatusSelect,
  SummaryInput,
  DescriptionInput,
  AssigneeSelect,
  PrioritySelect,
  SprintSelect,
  EpicSelect,
  StoryPointsEstimateInput,
  ReporterSelect,
  StartDatePicker,
  DueDatePicker,
  LabelsSelect,
  AttachmentFileInput,
} from "./Fields";

import {
  createIssue,
  getAssignableUsersByProject,
  getCurrentUser,
  getIssueTypes,
  getIssueTypesWithFieldsMap,
} from "./queryFunctions";
import { useColorScheme } from "../../common/color-scheme";

export function CreateIssueModal({
  opened,
  onCancel,
  onCreate,
}: {
  opened: boolean,
  onCancel: () => void,
  onCreate: () => void,
}) {
  const queryClient = useQueryClient();
  const theme = useMantineTheme();
  const colorScheme = useColorScheme();
  const { projects, selectedProject } = useCanvasStore();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
  });

  const form = useForm<Issue>({
    initialValues: {
      projectId: selectedProject?.id,
      type: "",
      sprint: { id: undefined as unknown as number },
      summary: "",
      description: "",
      assignee: { id: "" },
      status: "To Do",
      reporter: currentUser,
      priority: { id: "" },
      epic: { issueKey: undefined },
    } as Issue,
  });

  const { data: issueTypes, isLoading } = useQuery({
    queryKey: ["issueTypes", form.getInputProps("projectId").value],
    queryFn: () => getIssueTypes(form.getInputProps("projectId").value!),
    enabled: !!projects && !!form.getInputProps("projectId").value,
  });

  const { data: assignableUsers } = useQuery({
    queryKey: ["assignableUsers", form.getInputProps("projectId").value],
    queryFn: () => getAssignableUsersByProject(form.getInputProps("projectId").value!),
    enabled: !!projects && !!form.getInputProps("projectId").value,
  });

  const { data: issueTypesWithFieldsMap } = useQuery({
    queryKey: ["issueTypesWithFieldsMap"],
    queryFn: () => getIssueTypesWithFieldsMap(),
  });

  const mutation = useMutation({
    mutationFn: (issue: Issue) => createIssue(issue),
    onError: () => {
      showNotification({
        message: "The issue couldn't be created! 😢",
        color: "red",
      });
    },
    onSuccess: (issueKey) => {
      const files: File[] = form.getInputProps("attachment").value;
      const filesForm = new FormData();
      if (files) {
        files.forEach((f) => filesForm.append("file", f, f.name));
        getResource().then((r) => uploadAttachment(issueKey, r, filesForm));
      }
      showNotification({
        message: `The issue ${issueKey} has been created!`,
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["epics"] });
      onCreate();
      form.reset();
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Create Issue"
      size="70vw"
      overlayProps={{
        color:
          colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.55,
        blur: 5,
      }}
    >
      <ColorSchemeToggle
        size="34px"
        style={{
          position: "absolute",
          top: 19,
          right: 50,
        }}
      />
      <ScrollArea.Autosize style={{ maxHeight: "70vh" }}>
        <form
          onSubmit={form.onSubmit((issue, event) => {
            event?.preventDefault();
            mutation.mutate(issue);
          })}
        >
          <Stack gap="md" mr="sm">
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
            <DescriptionInput form={form} />
            <AssigneeSelect
              form={form}
              assignableUsers={assignableUsers}
              isLoading={isLoading}
            />
            <PrioritySelect
              form={form}
              issueTypesWithFieldsMap={issueTypesWithFieldsMap}
              isLoading={isLoading}
            />
            <SprintSelect
              form={form}
              issueTypes={issueTypes}
              issueTypesWithFieldsMap={issueTypesWithFieldsMap}
              enabled={!!projects}
              isLoading={isLoading}
            />
            <EpicSelect
              form={form}
              issueTypes={issueTypes}
              issueTypesWithFieldsMap={issueTypesWithFieldsMap}
              enabled={!!projects}
              isLoading={isLoading}
            />
            <StoryPointsEstimateInput
              form={form}
              issueTypes={issueTypes}
              issueTypesWithFieldsMap={issueTypesWithFieldsMap}
            />
            <ReporterSelect
              form={form}
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
            <LabelsSelect form={form} />
            <AttachmentFileInput form={form} />
            <Group justify="right">
              <Button
                variant="light"
                color="gray"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </Group>
          </Stack>
        </form>
      </ScrollArea.Autosize>
    </Modal>
  );
}
