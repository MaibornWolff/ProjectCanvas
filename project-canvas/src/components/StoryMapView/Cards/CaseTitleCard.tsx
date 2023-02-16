import { Paper } from "@mantine/core"

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
      radius="md"
      p="md"
      shadow="md"
    >
      {title}
    </Paper>
  )
}
