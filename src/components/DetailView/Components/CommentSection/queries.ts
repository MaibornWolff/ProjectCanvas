import { showNotification } from "@mantine/notifications"
import { QueryClient, useMutation } from "@tanstack/react-query"
import {
  addCommentToIssue,
  editIssueComment,
  deleteIssueComment,
} from "./queryFunctions"

export const addCommentMutation = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({
      issueKey,
      commentText,
    }: {
      issueKey: string
      commentText: string
    }) => addCommentToIssue(issueKey, commentText),
    onError: () => {
      showNotification({
        message: `The issue couldn't be modified! 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `A new comment has been posted!`,
        color: "green",
      })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })

export const editCommentMutation = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({
      issueKey,
      commentId,
      commentText,
    }: {
      issueKey: string
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

export const deleteCommentMutation = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({
      issueKey,
      commentId,
    }: {
      issueKey: string
      commentId: string
    }) => deleteIssueComment(issueKey, commentId),
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
