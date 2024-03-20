import { showNotification } from "@mantine/notifications";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { Resource } from "@canvas/types";
import { deleteAttachment, uploadAttachment } from "./queryFunctions";

export const addAttachmentMutation = (queryClient: QueryClient) => useMutation({
  mutationFn: ({
    issueIdOrKey,
    resource,
    form,
  }: {
    issueIdOrKey: string,
    resource: Resource,
    form: FormData,
  }) => uploadAttachment(issueIdOrKey, resource, form),
  onError: () => {
    showNotification({
      message: "Attachment couldn't be uploaded! 😢",
      color: "red",
    });
  },
  onSuccess: () => {
    showNotification({
      message: "New Attachment has been posted!",
      color: "green",
    });
    queryClient.invalidateQueries({ queryKey: ["issues"] });
    queryClient.invalidateQueries({ queryKey: ["epics"] });
  },
});

export const deleteAttachmentMutation = (queryClient: QueryClient) => useMutation({
  mutationFn: ({
    attachmentId,
    resource,
  }: {
    attachmentId: string,
    resource: Resource,
  }) => deleteAttachment(attachmentId, resource),
  onError: () => {
    showNotification({
      message: "The attachment couldn't be deleted! 😢",
      color: "red",
    });
  },
  onSuccess: () => {
    showNotification({
      message: "The attachment has been deleted!",
      color: "green",
    });
    queryClient.removeQueries({ queryKey: ["thumbnails"] });
    queryClient.invalidateQueries({ queryKey: ["issues"] });
    queryClient.invalidateQueries({ queryKey: ["epics"] });
  },
});
