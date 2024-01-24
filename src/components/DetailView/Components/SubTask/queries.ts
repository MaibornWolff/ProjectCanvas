import { showNotification } from "@mantine/notifications";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { deleteIssueSubtask } from "./queryFunctions";

export const deleteSubtaskMutation = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: deleteIssueSubtask,
    onError: () => {
      showNotification({
        message: "The subtask couldn't be deleted! 😢",
        color: "red",
      });
    },
    onSuccess: () => {
      showNotification({
        message: "Subtask  has been deleted!",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
