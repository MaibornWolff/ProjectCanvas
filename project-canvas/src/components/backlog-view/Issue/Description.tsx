import { Textarea, Text } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useMutation } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { useState } from "react"
import { editIssue } from "../../CreateIssue/queryFunctions"

export function Description(props: { issueKey: string; description: string }) {
  const [defaultdescription, setdefaultdescription] = useState(
    props.description
  )
  const [showDescriptionInput, setshowDescriptionInput] = useState(false)
  const mutationDescription = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, props.issueKey),
    onError: () => {
      showNotification({
        message: `error occured while modifing the Description 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `Description of issue ${props.issueKey} has been modified!`,
        color: "green",
      })
    },
  })
  return (
    <span>
      {showDescriptionInput ? (
        <Textarea
          value={defaultdescription}
          onChange={(e) => setdefaultdescription(e.target.value)}
          onBlur={() => {
            setshowDescriptionInput(false)
            mutationDescription.mutate({
              description: defaultdescription,
            } as Issue)
          }}
          autosize
          minRows={4}
          mb="xl"
        />
      ) : (
        <Text onClick={() => setshowDescriptionInput(true)} mb="xl">
          {defaultdescription !== null && defaultdescription !== ""
            ? defaultdescription
            : "Add Description"}
        </Text>
      )}
    </span>
  )
}
