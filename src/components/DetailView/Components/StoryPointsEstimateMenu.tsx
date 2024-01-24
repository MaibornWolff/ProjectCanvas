import { useState, useRef, useEffect } from "react";
import {
  Text,
  Group,
  NumberInput,
  Chip,
  Loader,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Issue } from "types";
import { getEditableIssueFields } from "../../CreateIssue/queryFunctions";
import { editIssue } from "../helpers/queryFunctions";

export function StoryPointsEstimateMenu({
  issueKey,
  storyPointsEstimate,
}: {
  issueKey: string;
  storyPointsEstimate: number;
}) {
  const queryClient = useQueryClient();
  const theme = useMantineTheme();
  const timeoutRef = useRef<number | null>(null);
  const [localStoryPtsEstimate, setLocalStoryPtsEstimate] = useState<
    number | undefined
  >(storyPointsEstimate);
  const [showEditableInput, setShowEditableInput] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setShowLoader(false);
  }, [storyPointsEstimate]);

  const { data: editableFields } = useQuery({
    queryKey: ["editableFields", issueKey],
    queryFn: () => getEditableIssueFields(issueKey),
    enabled: !!issueKey,
  });

  const mutation = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, issueKey),
    onError: () => {
      showNotification({
        message: `The story point estimate for issue ${issueKey} couldn't be modified! 😢`,
        color: "red",
      });
    },
    onSuccess: () => {
      showNotification({
        message: `The story point estimate for issue ${issueKey} has been modified!`,
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  function handleStoryPointsEstimateChange(val: number | undefined) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const currentValue = val;

    timeoutRef.current = window.setTimeout(() => {
      setShowEditableInput(false);
      mutation.mutate({ storyPointsEstimate: currentValue ?? null } as Issue);
    }, 2000);
  }

  function numberInputToOptNumber(val: number | string): number | undefined {
    if (val === "") return undefined;

    if (typeof val === "number") return val;

    throw new Error(
      `Unexpected number input value of type ${typeof val}: ${val}`
    );
  }

  return editableFields && editableFields.includes("Story point estimate") ? (
    <Group grow>
      <Text c="dimmed" fz="sm">
        Story Points Estimate
      </Text>
      {!showEditableInput &&
        storyPointsEstimate !== undefined &&
        editableFields &&
        editableFields.includes("Story point estimate") && (
          <Group>
            {localStoryPtsEstimate ? (
              <Chip onClick={() => setShowEditableInput(true)}>
                {localStoryPtsEstimate}
              </Chip>
            ) : (
              <Text
                c="dimmed"
                onClick={() => setShowEditableInput(true)}
                w="100%"
                style={{
                  ":hover": {
                    cursor: "pointer",
                    boxShadow: theme.shadows.xs,
                    borderRadius: theme.radius.xs,
                    transition: "background-color .8s ease-out",
                  },
                }}
              >
                None
              </Text>
            )}
            {showLoader && <Loader size="sm" />}
          </Group>
        )}
      {showEditableInput &&
        storyPointsEstimate !== undefined &&
        editableFields &&
        editableFields.includes("Story point estimate") && (
          <Group>
            <Box w={150}>
              <NumberInput
                min={0}
                value={localStoryPtsEstimate}
                onChange={(val) => {
                  setLocalStoryPtsEstimate(numberInputToOptNumber(val));
                  handleStoryPointsEstimateChange(numberInputToOptNumber(val));
                  setShowLoader(true);
                }}
                onBlur={() => setShowEditableInput(false)}
              />
            </Box>
            {showLoader && <Loader size="sm" />}
          </Group>
        )}
      {storyPointsEstimate === undefined &&
        editableFields &&
        !editableFields.includes("Story point estimate") && (
          <NumberInput width={100} min={0} defaultValue={0} disabled />
        )}
      {showEditableInput &&
        storyPointsEstimate === undefined &&
        editableFields &&
        editableFields.includes("Story point estimate") && (
          <Group justify="right">
            <Box w={70}>
              <NumberInput
                min={0}
                defaultValue={0}
                onChange={(val) => {
                  setLocalStoryPtsEstimate(numberInputToOptNumber(val));
                  handleStoryPointsEstimateChange(numberInputToOptNumber(val));
                  setShowLoader(true);
                }}
                onBlur={() => setShowEditableInput(false)}
              />
            </Box>
            {showLoader && <Loader size="sm" />}
          </Group>
        )}
    </Group>
  ) : null;
}
