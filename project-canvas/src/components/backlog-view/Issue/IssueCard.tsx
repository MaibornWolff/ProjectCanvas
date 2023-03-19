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
import { Issue } from "project-extender"
import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { DetailView } from "../../DetailView/DetailView"
import { IssueIcon } from "./IssueIcon"
import { DeleteButton } from "./DeleteButton"

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
  let storyPointsColor: string
  const [opened, setOpened] = useState(false)
  const queryClient = useQueryClient()
  const { ref, hovered } = useHover()
  const theme = useMantineTheme()

  const hoverStyles =
    theme.colorScheme === "dark"
      ? {
          backgroundColor: theme.colors.dark[8],
          transition: "background-color .1s ease-in",
        }
      : {
          backgroundColor: theme.colors.gray[1],
          transition: "background-color .1s ease-in",
        }

  switch (status) {
    case "To Do":
      storyPointsColor = "gray.6"
      break
    case "In Progress":
      storyPointsColor = "blue.8"
      break
    case "Done":
      storyPointsColor = "green.9"
      break
    default:
      storyPointsColor = "gray.6"
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
            sx={{ position: "relative" }}
          >
            <DeleteButton mounted={hovered} issueKey={issueKey} />
            <Grid
              columns={100}
              p={3}
              sx={{
                borderRadius: theme.radius.sm,
                margin: 0,
                boxShadow: theme.shadows.xs,
                transition: "background-color .8s ease-out",
                ":hover": hoverStyles,
              }}
            >
              <Grid.Col
                span={8}
                sx={{
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
                <Stack spacing={0}>
                  <Group spacing={2}>
                    <Text
                      size="sm"
                      mr={5}
                      color="blue"
                      td={status === "Done" ? "line-through" : "none"}
                      sx={{
                        ":hover": {
                          textDecoration: "underline",
                          cursor: "pointer",
                        },
                      }}
                    >
                      {issueKey}
                    </Text>
                    {epic && (
                      <Badge mr={5} color="violet">
                        {epic}
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
                  <Group align="center" spacing="sm">
                    <Text size="sm">{type}</Text>
                    <Text size="sm">•</Text>
                    <Text size="sm">{status}</Text>
                  </Group>
                </Stack>
              </Grid.Col>
              <Grid.Col
                span={8}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Tooltip
                  label={
                    assignee.displayName !== undefined
                      ? assignee.displayName
                      : "unassigned"
                  }
                >
                  {assignee.avatarUrls !== undefined ? (
                    <Avatar
                      src={assignee?.avatarUrls["24x24"]}
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
                <Box sx={{ alignSelf: "flex-start" }}>
                  <Badge
                    w="24px"
                    p="0px"
                    bg={
                      storyPointsEstimate !== undefined &&
                      storyPointsEstimate !== null
                        ? storyPointsColor
                        : "transparent"
                    }
                    variant="filled"
                  >
                    {storyPointsEstimate}
                  </Badge>
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
        size="85%"
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
