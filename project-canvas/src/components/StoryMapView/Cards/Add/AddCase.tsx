import { Paper } from "@mantine/core"
import { IconPlus } from "@tabler/icons"

export function AddCase({ onClick }: { onClick: () => void }) {
  return (
    <Paper
      sx={{
        height: "6.5em",
        aspectRatio: "16/8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "2px dashed lightgray",
        color: "gray",
        cursor: "pointer",
      }}
      radius="sm"
      p="md"
      onClick={onClick}
    >
      <IconPlus />
    </Paper>
  )
}
