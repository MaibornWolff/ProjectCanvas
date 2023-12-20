import {Issue} from "types";
import {
    Avatar,
    Badge,
    Box,
    Paper,
    Center,
    Grid,
    Group,
    Modal,
    Stack,
    Text, ThemeIcon,
    Tooltip,
    useMantineTheme
} from "@mantine/core";
import {useHover} from "@mantine/hooks";
import {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {IconBolt} from "@tabler/icons";
import {DeleteButton} from "../BacklogView/Issue/DeleteButton";
import {EpicDetailView} from "../EpicDetailView/EpicDetailView";
import {StatusType} from "../../../types/status";
import {StoryPointsBadge} from "../common/StoryPoints/StoryPointsBadge";

export function EpicCard ({
    issueKey,
    summary,
    status,
    storyPointsEstimate,
    epic,
    labels,
    assignee,
    type,
    projectId,
    ...props
}: Issue) {
    const [opened, setOpened] = useState(false)
    const queryClient = useQueryClient()
    const {hovered} = useHover()
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

    return (
        <>
            <DeleteButton mounted={hovered} issueKey={issueKey} />
            <Paper
                onClick={() => setOpened(true)}
            >
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
                onClick={() => setOpened(true)}
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
                        <ThemeIcon
                            size="sm"
                            variant="gradient"
                            gradient={{ from: "violet", to: "white", deg: 105 }}
                        >
                            <IconBolt/>
                        </ThemeIcon>
                    </Center>
                </Grid.Col>
                <Grid.Col span={74}>
                    <Stack gap={0}>
                        <Group gap={2}>
                            <Text
                                size="sm"
                                mr={5}
                                color="blue"
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
                            <StoryPointsBadge
                                statusType={status as StatusType}
                                storyPointsEstimate={storyPointsEstimate}
                            />}
                    </Box>
                </Grid.Col>
            </Grid>
            </Paper>
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
                <EpicDetailView
                    issueKey={issueKey}
                    summary={summary}
                    labels={labels}
                    status={status}
                    type={type}
                    projectId={projectId}
                    assignee={assignee}
                    closeModal={() => setOpened(false)}
                    {...props}
                />
            </Modal>
        </>
    )
}
