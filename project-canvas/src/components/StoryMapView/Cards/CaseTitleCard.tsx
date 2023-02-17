import { Paper, Title } from "@mantine/core"

export function CaseTitleCard({ title }: { title: string }) {
  return (
    <Paper
      sx={(theme) => ({
        height: "5em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.primaryBlue[0],
        width: "100%",
      })}
      radius="sm"
      p="md"
      shadow="md"
    >
      <Title size="1.6em">{title}</Title>
    </Paper>
  )
}
