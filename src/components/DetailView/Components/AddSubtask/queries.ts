import { showNotification } from "@mantine/notifications";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { createSubtask } from "./queryFunctions";

export const createSubtaskMutation = (
  issueKey: string,
  summary: string,
  projectId: string,
  queryClient: QueryClient,
  subtaskID: string,
  resetSummary: () => void,
) => useMutation({
  mutationFn: () => createSubtask(issueKey, summary, projectId, subtaskID),
  onSuccess(createdSubtask: { id: string; key: string }) {
    resetSummary();
    showNotification({
      message: `The issue  ${createdSubtask.key} has been created!`,
      color: "green",
    });
    queryClient.invalidateQueries({ queryKey: ["issues"] });
  },
});
