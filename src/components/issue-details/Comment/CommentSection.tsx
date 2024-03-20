import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Text, Group, Stack, Paper, Avatar, Anchor, Loader, Button, Textarea, Box } from "@mantine/core";
import { Issue } from "@canvas/types";
import { IconPlus } from "@tabler/icons-react";
import { addCommentMutation, deleteCommentMutation, editCommentMutation } from "./queries";

export function CommentSection({
  issueKey,
  comment,
}: {
  issueKey: string,
  comment: Issue["comment"],
}) {
  const [addCommentInputText, setAddCommentInputText] = useState("");
  const [editCommentInputText, setEditCommentInputText] = useState<Record<string, string>>({});
  const [showEditableInputAdd, setShowEditableInputAdd] = useState(false);
  const [editableComments, setEditableComments] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();
  const addCommentMutationLocal = addCommentMutation(queryClient);
  const editCommentMutationLocal = editCommentMutation(queryClient);
  const deleteCommentMutationLocal = deleteCommentMutation(queryClient);

  const showLoader = addCommentMutationLocal.isPending
    || editCommentMutationLocal.isPending
    || deleteCommentMutationLocal.isPending;

  const setCommentEditText = (commentId: string, commentText: string) => {
    setEditCommentInputText({
      ...editCommentInputText,
      [commentId]: commentText,
    });
  };

  const setCommentEdit = (commentId: string, enabled: boolean) => setEditableComments({
    ...editableComments,
    [commentId]: enabled,
  });

  const resetCommentEdit = (commentId: string) => {
    setCommentEditText(commentId, "");
    setCommentEdit(commentId, false);
  };

  return (
    <Stack>
      <Group>
        <Text c="dimmed">Comments</Text>
        {showLoader && <Loader size="xs" />}
      </Group>
      {!showEditableInputAdd ? (
        <Button
          variant="subtle"
          color="gray"
          size="compact-sm"
          radius="xs"
          display="flex"
          onClick={() => setShowEditableInputAdd(true)}
          style={{ justifyContent: "left" }}
          leftSection={<IconPlus />}
        >
          Add a comment
        </Button>
      ) : (
        <Stack>
          <Textarea
            placeholder="Type here..."
            autosize
            onChange={(event) => setAddCommentInputText(event.target.value)}
          />
          <Group>
            <Button
              onClick={() => {
                addCommentMutationLocal.mutate({
                  issueKey,
                  commentText: addCommentInputText,
                });
                setShowEditableInputAdd(false);
              }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setAddCommentInputText("");
                setShowEditableInputAdd(false);
              }}
            >
              Cancel
            </Button>
          </Group>
        </Stack>
      )}
      {comment.comments.map((commentBody) => (
        <Paper key={commentBody.id}>
          <Group>
            <Box ml="sm">
              <Avatar src={commentBody.author.avatarUrls["24x24"]} size="sm" style={{ flex: 1 }} />
            </Box>
            <Stack gap={0} style={{ flex: 15 }}>
              <Group>
                <Text fw={500} c="dimmed" fz="sm">
                  {commentBody.author.displayName}
                </Text>
                <Text c="dimmed" fz="xs">
                  {new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(commentBody.created))}
                </Text>
              </Group>
              {!editableComments[commentBody.id] ? (
                <Box>
                  <Text fz="xs">{commentBody.body}</Text>
                  <Group justify="left">
                    <Anchor
                      td="underline"
                      c="dimmed"
                      fz="xs"
                      onClick={() => {
                        setCommentEditText(commentBody.id, commentBody.body);
                        setCommentEdit(commentBody.id, true);
                      }}
                    >
                      Edit
                    </Anchor>
                    <Anchor
                      td="underline"
                      c="dimmed"
                      fz="xs"
                      onClick={() => deleteCommentMutationLocal.mutate({ issueKey, commentId: commentBody.id })}
                    >
                      Delete
                    </Anchor>
                  </Group>
                </Box>
              ) : (
                <Stack>
                  <Textarea
                    placeholder="Type here..."
                    value={editCommentInputText[commentBody.id]}
                    autosize
                    onChange={(event) => setCommentEditText(commentBody.id, event.target.value)}
                  />
                  <Group>
                    <Button
                      size="xs"
                      onClick={() => {
                        editCommentMutationLocal.mutate({
                          issueKey,
                          commentId: commentBody.id,
                          commentText: editCommentInputText[commentBody.id],
                        });
                        setCommentEdit(commentBody.id, false);
                      }}
                    >
                      Save
                    </Button>
                    <Button size="xs" onClick={() => resetCommentEdit(commentBody.id)}>Cancel</Button>
                  </Group>
                </Stack>
              )}
            </Stack>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}
