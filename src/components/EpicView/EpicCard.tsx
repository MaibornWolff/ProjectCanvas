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
    let storyPointsColor: string
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
            <DeleteButton mounted={hovered} issueKey={issueKey} />
            <Paper
                onClick={() => setOpened(true)}
            >
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
                onClick={() => setOpened(true)}
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
            <Modal
                opened={opened}
                onClose={() => {
                    setOpened(false)
                    queryClient.invalidateQueries({ queryKey: ["issues"] })
                }}
                size="90vw"
                overflow="outside"
                overlayOpacity={0.55}
                overlayBlur={3}
                withCloseButton={false}
            >
                <EpicDetailView
                    issueKey={issueKey}
                    summary={summary}
                    labels={labels}
                    assignee={assignee}
                    closeModal={() => setOpened(false)}
                    {...props}
                />
            </Modal>
        </>
    )
}
