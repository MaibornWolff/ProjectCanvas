import { Text, Textarea } from "@mantine/core";
import { Issue } from "types";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

export function IssueSummary({
  summary,
  issueKey,
  onMutate = () => {},
}: {
  summary: string,
  issueKey: string,
  onMutate?: () => void,
}) {
  const [currentSummary, setCurrentSummary] = useState(summary);
  const [showSummaryInput, setShowSummaryInput] = useState(false);

  const mutationSummary = useMutation({
    mutationFn: (issue: Issue) => window.provider.editIssue(issue, issueKey),
    onError: () => {
      showNotification({
        message: "An error occurred while modifying the summary 😢",
        color: "red",
      });
    },
    onSuccess: () => {
      if (currentSummary !== summary) {
        showNotification({
          message: `The summary of issue ${issueKey} has been modified!`,
          color: "green",
        });
        onMutate();
      }
    },
  });

  if (!showSummaryInput) {
    return (
      <Text lineClamp={1} onClick={() => setShowSummaryInput(true)}>
        {currentSummary}
      </Text>
    );
  }

  return (
    <Textarea
      value={currentSummary}
      onChange={(e) => setCurrentSummary(e.target.value)}
      onBlur={() => {
        if (currentSummary === "") {
          showNotification({
            message: "The summary of an issue cannot be empty",
            color: "red",
          });
        } else {
          setShowSummaryInput(false);
          mutationSummary.mutate({ summary: currentSummary } as Issue);
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
