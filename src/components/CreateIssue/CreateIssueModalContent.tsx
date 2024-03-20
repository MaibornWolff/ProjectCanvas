import { Button, Divider, Group, ScrollArea, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Issue } from "types";
import { useCanvasStore } from "../../lib/Store";
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

export function CreateIssueModalContent({
  onCancel,
  onCreate,
}: {
  onCancel: () => void,
  onCreate: () => void,
}) {
  const queryClient = useQueryClient();
  const { projects, selectedProject, issueTypesWithFieldsMap } = useCanvasStore();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => window.provider.getCurrentUser(),
  });

  const form = useForm<Issue>({
    initialValues: {
      projectKey: selectedProject?.key,
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
    queryKey: ["issueTypes", form.getInputProps("projectKey").value],
    queryFn: () => window.provider.getIssueTypesByProject(form.getInputProps("projectKey").value!),
    enabled: !!projects && !!form.getInputProps("projectKey").value,
  });

  const { data: assignableUsers } = useQuery({
    queryKey: ["assignableUsers", form.getInputProps("projectKey").value],
    queryFn: () => window.provider.getAssignableUsersByProject(form.getInputProps("projectKey").value!),
    enabled: !!projects && !!form.getInputProps("projectKey").value,
  });

  const mutation = useMutation({
    mutationFn: (issue: Issue) => window.provider.createIssue(issue),
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
  );
}
