import { Text, Textarea } from "@mantine/core";
import { Issue } from "types";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { editIssue } from "../helpers/queryFunctions";

export function IssueSummary({
  summary,
  issueKey,
  onMutate = () => {},
}: {
  summary: string;
  issueKey: string;
  onMutate?: () => void;
}) {
  const [defaultSummary, setDefaultSummary] = useState(summary);
  const [showSummaryInput, setShowSummaryInput] = useState(false);

  const mutationSummary = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, issueKey),
    onError: () => {
      showNotification({
        message: `An error occurred while modifying the summary 😢`,
        color: "red",
      });
    },
    onSuccess: () => {
      if (defaultSummary !== summary) {
        showNotification({
          message: `The summary of issue ${issueKey} has been modified!`,
          color: "green",
        });
        onMutate();
      }
    },
  });

  if (!showSummaryInput)
    return (
      <Text lineClamp={1} onClick={() => setShowSummaryInput(true)}>
        {defaultSummary}
      </Text>
    );

  return (
    <Textarea
      value={defaultSummary}
      onChange={(e) => setDefaultSummary(e.target.value)}
      onBlur={() => {
        if (defaultSummary === "")
          showNotification({
            message: `The summary of an issue cannot be empty`,
            color: "red",
          });
        else {
          setShowSummaryInput(false);
          mutationSummary.mutate({
            summary: defaultSummary,
          } as Issue);
        }
      }}
      autosize
      style={{
        textarea: {
          fontSize: "inherit",
          fontWeight: "inherit",
        },
      }}
    />
  );
}
