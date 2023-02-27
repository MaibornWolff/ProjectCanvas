import { Button } from "@mantine/core"
import { IconPlus } from "@tabler/icons"
import { Updater } from "use-immer"
import { getAllActions, getRndInteger } from "./helpers/utils"
import { Case, SubActionLevel } from "./types"

export function AddLevel({
  setLevels,
  setCases,
}: {
  setLevels: Updater<SubActionLevel[]>
  setCases: Updater<Case[]>
}) {
  return (
    <Button
      leftIcon={<IconPlus />}
      onClick={() => {
        const levelId = `level-${getRndInteger()}`
        setLevels((draft) => {
          draft.push({ id: levelId, title: "New Level" })
        })
        setCases((draft) => {
          getAllActions(draft)
            .map((action) => action.subActionGroups)
            .forEach((subActionGroup) =>
              subActionGroup.push({
                id: `sg-${getRndInteger()}`,
                levelId,
                subActions: [],
              })
            )
        })
      }}
      variant="outline"
      color="dark"
      my="lg"
      fullWidth
      size="xl"
    >
      Add Level
    </Button>
  )
}
