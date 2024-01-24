import { showNotification } from "@mantine/notifications";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { deleteIssue } from "./queryFunctions";

export const deleteIssueMutation = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: deleteIssue,
    onError: () => {
      showNotification({
        message: "The Issue couldn't be deleted! 😢",
        color: "red",
      });
    },
    onSuccess: () => {
      showNotification({
        message: "The issue has been deleted!",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
