import { Text, Textarea } from "@mantine/core"
import { Issue } from "project-extender"
import { useState } from "react"
import { showNotification } from "@mantine/notifications"
import { useMutation } from "@tanstack/react-query"
import { editIssue } from "../../CreateIssue/queryFunctions"

export function IssueSummary(props: { summary: string; issueKey: string }) {
  const [defaultSummary, setdefaultSummary] = useState(props.summary)
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
      if (defaultSummary !== props.summary)
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
          value={defaultSummary}
          onChange={(e) => setdefaultSummary(e.target.value)}
          onBlur={() => {
            if (defaultSummary === "")
              showNotification({
                message: `Summary of an issue cannot be empty`,
                color: "red",
              })
            else {
              setshowSummaryInput(false)
              mutationSummary.mutate({
                summary: defaultSummary,
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
        <Text lineClamp={1} onClick={() => setshowSummaryInput(true)}>
          {defaultSummary}
        </Text>
      )}
    </Text>
  )
}
