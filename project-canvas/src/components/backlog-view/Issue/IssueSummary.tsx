import { Text, Textarea } from "@mantine/core"
import { Issue } from "project-extender"
import { useState } from "react"
import { showNotification } from "@mantine/notifications"
import { useMutation } from "@tanstack/react-query"
import { editIssue } from "../../CreateIssue/queryFunctions"

export function IssueSummary(props: { summary: string; issueKey: string }) {
  const [defaultsummary, setdefaultsummary] = useState(props.summary)
  const [showSummaryInput, setshowSummaryInput] = useState(false)

  const mutationSummary = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, props.issueKey),
    onError: () => {
      showNotification({
        message: `error occured while modifing the summary 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      if (defaultsummary !== props.summary)
        showNotification({
          message: `Summary of issue ${props.issueKey} has been modified!`,
          color: "green",
        })
    },
  })
  return (
    <Text>
      {showSummaryInput ? (
        <Textarea
          value={defaultsummary}
          onChange={(e) => setdefaultsummary(e.target.value)}
          onBlur={() => {
            if (defaultsummary === "")
              showNotification({
                message: `Summary of an issue cannot be empty`,
                color: "red",
              })
            else {
              setshowSummaryInput(false)
              mutationSummary.mutate({
                summary: defaultsummary,
              } as Issue)
            }
          }}
          autosize
          sx={{
            textarea: {
              fontSize: "inherit",
              fontWeight: "inherit",
            },
          }}
        />
      ) : (
        <Text onClick={() => setshowSummaryInput(true)}>{defaultsummary}</Text>
      )}
    </Text>
  )
}
