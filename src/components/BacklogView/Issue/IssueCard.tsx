import { Avatar, Center, Box, Group, Modal, Paper, Stack, Text, Tooltip, useMantineTheme, Grid } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { Issue, StatusType } from "@canvas/types";
import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { mergeRefs, useHover } from "@mantine/hooks";
import { useColorScheme } from "@canvas/common/color-scheme";
import { useCanvasStore } from "@canvas/lib/Store";
import { DetailView } from "../../DetailView/DetailView";
import { IssueIcon } from "./IssueIcon";
import { StoryPointsBadge } from "../../common/StoryPoints/StoryPointsBadge";
import { IssueLabelBadge } from "../../common/IssueLabelBadge";
import { IssueEpicBadge } from "../../common/IssueEpicBadge";
import { DeleteButton } from "./DeleteButton";

export function IssueCard({
  issueKey,
  summary,
  status,
  type,
  storyPointsEstimate,
  epic,
  labels,
  assignee,
  sprint,
  index,
}: Issue & { index: number }) {
  const [opened, setOpened] = useState(false);
  const queryClient = useQueryClient();
  const theme = useMantineTheme();
  const colorScheme = useColorScheme();
  const { issueStatusCategoryByStatusName: statusNameToCategory } = useCanvasStore();
  const { hovered, ref } = useHover();

  const hoverStyles = colorScheme === "dark"
    ? {
      backgroundColor: theme.colors.dark[8],
      transition: "background-color .1s ease-in",
    }
    : {
      backgroundColor: theme.colors.gray[1],
      transition: "background-color .1s ease-in",
    };

  return (
    <>
      <Draggable key={issueKey} draggableId={issueKey} index={index}>
        {(provided) => (
          <Paper
            ref={mergeRefs(provided.innerRef, ref)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setOpened(true)}
          >
            <Grid
              columns={100}
              p={10}
              style={{
                borderRadius: theme.radius.sm,
                margin: 0,
                boxShadow: theme.shadows.xs,
                transition: "background-color .8s ease-out",
                ":hover": hoverStyles,
                position: "relative",
              }}
            >
              <Grid.Col
                span={8}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Center>
                  <IssueIcon type={type} />
                </Center>
              </Grid.Col>
              <Grid.Col span={74}>
                <Stack gap={0}>
                  <Group gap={2}>
                    <Text
                      size="sm"
                      mr={5}
                      c="blue"
                      td={
                        statusNameToCategory[status] === StatusType.DONE
                          ? "line-through"
                          : "none"
                      }
                      style={{
                        ":hover": {
                          textDecoration: "underline",
                          cursor: "pointer",
                        },
                      }}
                    >
                      {issueKey}
                    </Text>
                    {epic.issueKey && (
                      <IssueEpicBadge issueKey={issueKey} epic={epic} />
                    )}
                    {labels
                      && labels.map((label) => (
                        <IssueLabelBadge
                          key={`${issueKey}-${label}`}
                          label={label}
                        />
                      ))}
                  </Group>
                  <Text size="lg">{summary}</Text>
                  <Group align="center" gap="sm">
                    <Text size="sm">{type}</Text>
                    <Text size="sm">•</Text>
                    <Text size="sm">{status}</Text>
                  </Group>
                </Stack>
              </Grid.Col>
              <Grid.Col
                span={8}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Tooltip
                  label={
                    assignee?.displayName !== undefined
                      ? assignee.displayName
                      : "unassigned"
                  }
                >
                  {assignee?.avatarUrls !== undefined ? (
                    <Avatar
                      src={assignee.avatarUrls["24x24"]}
                      size="sm"
                      radius="xl"
                      ml={4}
                      mr={4}
                    />
                  ) : (
                    <Avatar
                      radius="xl"
                      variant="outline"
                      size="sm"
                      ml={4}
                      mr={4}
                    />
                  )}
                </Tooltip>
              </Grid.Col>
              <Grid.Col span={3}>
                <Box style={{ alignSelf: "flex-start" }}>
                  {storyPointsEstimate && (
                    <StoryPointsBadge
                      statusType={statusNameToCategory[status]}
                      storyPointsEstimate={storyPointsEstimate}
                    />
                  )}
                </Box>
              </Grid.Col>
              <DeleteButton mounted={hovered} issueKey={issueKey} />
            </Grid>
          </Paper>
        )}
      </Draggable>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          queryClient.invalidateQueries({ queryKey: ["issues"] });
        }}
        size="90vw"
        overlayProps={{
          opacity: 0.55,
          blur: 3,
        }}
        withCloseButton={false}
      >
        <DetailView
          issueKey={issueKey}
          sprint={sprint}
          closeModal={() => {
            setOpened(false);
            queryClient.invalidateQueries({ queryKey: ["issues"] });
          }}
        />
      </Modal>
    </>
  );
}
