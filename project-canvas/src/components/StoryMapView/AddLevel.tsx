import { Button } from "@mantine/core"
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
    >
      Add Level
    </Button>
  )
}
