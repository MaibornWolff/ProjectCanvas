import { Textarea, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { Issue } from "types";
import { useState } from "react";
import { editIssue } from "../helpers/queryFunctions";

export function Description(props: { issueKey: string; description: string }) {
  const [defaultDescription, setDefaultDescription] = useState(
    props.description,
  );
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const mutationDescription = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, props.issueKey),
    onError: () => {
      showNotification({
        message: "An error occurred while modifing the Description 😢",
        color: "red",
      });
    },
    onSuccess: () => {
      showNotification({
        message: `Description of issue ${props.issueKey} has been modified!`,
        color: "green",
      });
    },
  });
  return (
    <span>
      {showDescriptionInput ? (
        <Textarea
          value={defaultDescription}
          onChange={(e) => setDefaultDescription(e.target.value)}
          onBlur={() => {
            setShowDescriptionInput(false);
            mutationDescription.mutate({
              description: defaultDescription,
            } as Issue);
          }}
          autosize
          minRows={4}
          mb="xl"
        />
      ) : (
        <Text onClick={() => setShowDescriptionInput(true)} mb="xl">
          {defaultDescription !== null && defaultDescription !== ""
            ? defaultDescription
            : "Add Description"}
        </Text>
      )}
    </span>
  );
}
