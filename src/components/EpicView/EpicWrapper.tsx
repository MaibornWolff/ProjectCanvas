import { Stack } from "@mantine/core"
import { Issue } from "../../../types"
import { EpicCard } from "./EpicCard"

export function EpicWrapper({ epics }: { epics: Issue[] }) {
  return (
    <Stack gap="sm">
      {epics.map((epic: Issue) => (
        <EpicCard {...epic} key={epic.issueKey} />
      ))}
    </Stack>
  )
}
