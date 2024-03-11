import { Button, Divider, Group, Paper, ScrollArea, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Issue } from "types";
import { useCanvasStore } from "@canvas/lib/Store";
import { getResource, uploadAttachment } from "../Attachments/queryFunctions";
import {
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
} from "../../../CreateIssue/Fields";

export function SplitIssueCreate({
  onCreate,
  onCancel,
}: {
  onCreate: (issueKey: string) => void,
  onCancel: () => void,
}) {
  const queryClient = useQueryClient();

  const {
    projects,
    selectedProject,
    issueTypes,
    issueTypesWithFieldsMap,
  } = useCanvasStore();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => window.provider.getCurrentUser(),
  });

  const form = useForm<Issue>({
    initialValues: {
      projectId: selectedProject!.id,
      type: "",
      sprint: { id: undefined as unknown as number },
      summary: "",
      description: "",
      assignee: undefined,
      status: "To Do",
      reporter: currentUser,
      priority: { id: "" },
      epic: { issueKey: undefined },
    } as Issue,
  });

  const { data: assignableUsers, isLoading } = useQuery({
    queryKey: ["assignableUsers", selectedProject!.key],
    queryFn: () => window.provider.getAssignableUsersByProject(selectedProject!.key),
    enabled: !!projects,
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
      onCreate(issueKey);
      form.reset();
    },
  });

  return (
    <Paper p="xs">
      <ScrollArea.Autosize
        mr="xs"
        style={{ maxHeight: "80vh" }}
        offsetScrollbars
      >
        <form
          onSubmit={form.onSubmit((issue, event) => {
            event?.preventDefault();
            mutation.mutate(issue);
          })}
        >
          <Stack gap="md">
            <IssueTypeSelect
              form={form}
              issueTypes={issueTypes}
              isLoading={false}
            />
            <Divider m={10} />
            <StatusSelect
              form={form}
              issueTypes={issueTypes}
              isLoading={false}
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
              isLoading={false}
            />
            <SprintSelect
              form={form}
              issueTypes={issueTypes}
              issueTypesWithFieldsMap={issueTypesWithFieldsMap}
              enabled={!!projects}
              isLoading={false}
            />
            <EpicSelect
              form={form}
              issueTypes={issueTypes}
              issueTypesWithFieldsMap={issueTypesWithFieldsMap}
              enabled={!!projects}
              isLoading={false}
            />
            <StoryPointsEstimateInput
              form={form}
              issueTypes={issueTypes}
              issueTypesWithFieldsMap={issueTypesWithFieldsMap}
            />
            <ReporterSelect
              form={form}
              assignableUsers={assignableUsers}
              isLoading={false}
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
              <Button variant="light" color="gray" onClick={onCancel}>Cancel</Button>
              <Button type="submit">Create</Button>
            </Group>
          </Stack>
        </form>
      </ScrollArea.Autosize>
    </Paper>
  );
}
