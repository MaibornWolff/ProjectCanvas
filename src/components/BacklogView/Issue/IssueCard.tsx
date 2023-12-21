import {
  Avatar,
  Badge,
  Center,
  Box,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
  Grid,
} from "@mantine/core"
import { useHover, useMergedRef } from "@mantine/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { Issue } from "types"
import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { DetailView } from "../../DetailView/DetailView"
import { IssueIcon } from "./IssueIcon"
import { DeleteButton } from "./DeleteButton"
import { StatusType } from "../../../../types/status";
import { StoryPointsBadge } from "../../common/StoryPoints/StoryPointsBadge";
import { useColorScheme } from "../../../common/color-scheme";

export function IssueCard({
  issueKey,
  summary,
  status,
  type,
  storyPointsEstimate,
  epic,
  labels,
  assignee,
  index,
  projectId,
  ...props
}: Issue & { index: number }) {
  const [opened, setOpened] = useState(false)
  const queryClient = useQueryClient()
  const { ref, hovered } = useHover()
  const theme = useMantineTheme()
  const colorScheme = useColorScheme()

  const hoverStyles =
    colorScheme === "dark"
      ? {
          backgroundColor: theme.colors.dark[8],
          transition: "background-color .1s ease-in",
        }
      : {
          backgroundColor: theme.colors.gray[1],
          transition: "background-color .1s ease-in",
        }

  return (
    <>
      <Draggable key={issueKey} draggableId={issueKey} index={index}>
        {(provided) => (
          <Paper
            ref={useMergedRef(provided.innerRef, ref)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setOpened(true)}
            style={{ position: "relative" }}
          >
            <DeleteButton mounted={hovered} issueKey={issueKey} />
            <Grid
              columns={100}
              p={3}
              style={{
                borderRadius: theme.radius.sm,
                margin: 0,
                boxShadow: theme.shadows.xs,
                transition: "background-color .8s ease-out",
                ":hover": hoverStyles,
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
                      td={status === StatusType.DONE ? "line-through" : "none"}
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
                      <Badge mr={5} color="violet">
                        {epic.summary}
                      </Badge>
                    )}
                    {labels?.length !== 0 &&
                      labels.map((label) => (
                        <Badge
                          mr={2}
                          key={`${issueKey}-${label}`}
                          color="yellow"
                        >
                          {label}
                        </Badge>
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
                  {storyPointsEstimate &&
                    <StoryPointsBadge statusType={status as StatusType} storyPointsEstimate={storyPointsEstimate} />}
                </Box>
              </Grid.Col>
            </Grid>
          </Paper>
        )}
      </Draggable>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false)
          queryClient.invalidateQueries({ queryKey: ["issues"] })
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
          summary={summary}
          status={status}
          type={type}
          storyPointsEstimate={storyPointsEstimate}
          epic={epic}
          labels={labels}
          assignee={assignee}
          projectId={projectId}
          closeModal={() => setOpened(false)}
          {...props}
        />
      </Modal>
    </>
  )
}
