import { Button } from "@mantine/core"
import { IconPlus } from "@tabler/icons"
import { getRndInteger, LEVEL_PREFIX } from "../helpers/utils"
import { useStoryMapStore } from "../StoryMapStore"

export function AddLevel({ storyMapId }: { storyMapId: string }) {
  const addLevel = useStoryMapStore((state) => state.addLevel)
  const addSubActionGroups = useStoryMapStore(
    (state) => state.addSubActionGroups
  )
  return (
    <Button
      leftIcon={<IconPlus />}
      onClick={() => {
        const levelId = `${LEVEL_PREFIX}-${getRndInteger()}`
        addLevel(storyMapId, { id: levelId, title: "New Level" })
        addSubActionGroups(storyMapId, levelId)
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
