import { useState, useEffect, ChangeEvent } from "react"
import {
  Text,
  Group,
  Stack,
  Paper,
  Avatar,
  Anchor,
  Loader,
  Button,
  Textarea,
  Box,
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Issue } from "project-extender"
import {
  addCommentToIssue,
  deleteIssueComment,
  editIssueComment,
} from "../../CreateIssue/queryFunctions"

export function CommentSection({
  issueKey,
  comment,
}: {
  issueKey: string
  comment: Issue["comment"]
}) {
  const queryClient = useQueryClient()
  const [addCommentInputText, setAddCommentInputText] = useState("")
  const [editCommentInputText, setEditCommentInputText] = useState<
    Record<string, string>
  >({})
  const [showEditableInputAdd, setShowEditableInputAdd] = useState(false)
  const [editableComments, setEditableComments] = useState<
    Record<string, boolean>
  >({})
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    setShowLoader(false)
  }, [comment])

  const addCommentMutation = useMutation({
    mutationFn: (commentText: string) =>
      addCommentToIssue(issueKey, commentText),
    onError: () => {
      showNotification({
        message: `The issue couldn't be modified! 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `A new comment has been posted under issue ${issueKey}!`,
        color: "green",
      })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      setAddCommentInputText("")
    },
  })

  const editCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      commentText,
    }: {
      commentId: string
      commentText: string
    }) => editIssueComment(issueKey, commentId, commentText),
    onError: () => {
      showNotification({
        message: `The comment couldn't be edited! 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `Comment edited successfully!`,
        color: "green",
      })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteIssueComment(issueKey, commentId),
    onError: () => {
      showNotification({
        message: `The comment couldn't be deleted! 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `The comment has been deleted!`,
        color: "green",
      })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })

  const handleAddCommentInputChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAddCommentInputText(event.target.value)
  }

  const handleEditCommentInputChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
    commentId: string
  ) => {
    setEditCommentInputText({
      ...editCommentInputText,
      [commentId]: event.target.value,
    })
  }

  return (
    <Stack>
      <Group>
        <Text color="dimmed">Comments</Text>
        {showLoader && <Loader size="xs" />}
      </Group>
      {!showEditableInputAdd ? (
        <Button
          variant="subtle"
          color="gray"
          compact
          radius="xs"
          display="flex"
          onClick={() => {
            setShowEditableInputAdd(true)
          }}
          sx={{
            justifyContent: "left",
            ":hover": { backgroundColor: "#E8E2E2" },
          }}
        >
          + Add a comment
        </Button>
      ) : (
        <Stack>
          <Textarea
            placeholder="Type here..."
            autosize
            onChange={handleAddCommentInputChange}
          />
          <Group>
            <Button
              onClick={() => {
                addCommentMutation.mutate(addCommentInputText)
                setShowLoader(true)
                setShowEditableInputAdd(false)
              }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setAddCommentInputText("")
                setShowEditableInputAdd(false)
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
            <Box>
              <Avatar
                src={commentBody.author.avatarUrls["24x24"]}
                size="sm"
                sx={{ flex: 1 }}
              />
            </Box>
            <Stack spacing={0} sx={{ flex: 15 }}>
              <Group>
                <Text fw={500} color="dimmed" fz="sm">
                  {commentBody.author.displayName}
                </Text>
                <Text color="dimmed" fz="xs">
                  {new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(commentBody.created))}
                </Text>
              </Group>
              {editableComments[commentBody.id] === undefined ||
              editableComments[commentBody.id] === false ? (
                <Box>
                  <Text fz="xs"> {commentBody.body}</Text>
                  <Group position="left">
                    <Anchor
                      td="underline"
                      color="dimmed"
                      fz="xs"
                      onClick={() => {
                        setEditCommentInputText({
                          ...editCommentInputText,
                          [commentBody.id]: commentBody.body,
                        })
                        setEditableComments({
                          ...editableComments,
                          [commentBody.id]: true,
                        })
                      }}
                    >
                      Edit
                    </Anchor>
                    <Anchor
                      td="underline"
                      color="dimmed"
                      fz="xs"
                      onClick={() => {
                        deleteCommentMutation.mutate(commentBody.id)
                        setShowLoader(true)
                      }}
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
                    onChange={(event) =>
                      handleEditCommentInputChange(event, commentBody.id)
                    }
                  />
                  <Group>
                    <Button
                      size="xs"
                      onClick={() => {
                        editCommentMutation.mutate({
                          commentId: commentBody.id,
                          commentText: editCommentInputText[commentBody.id],
                        })
                        if (editCommentMutation.isSuccess) {
                          setEditCommentInputText({
                            ...editCommentInputText,
                            [commentBody.id]: "",
                          })
                        }
                        setShowLoader(true)
                        setEditableComments({
                          ...editableComments,
                          [commentBody.id]: false,
                        })
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => {
                        setEditCommentInputText({
                          ...editCommentInputText,
                          [commentBody.id]: "",
                        })
                        setEditableComments({
                          ...editableComments,
                          [commentBody.id]: false,
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </Group>
                </Stack>
              )}
            </Stack>
          </Group>
        </Paper>
      ))}
    </Stack>
  )
}
