import { IconPlus } from "@tabler/icons"
import { BaseCard } from "../Cards/Base/BaseCard"
import { getRndInteger } from "../helpers/utils"
import { useStoryMapStore } from "../StoryMapStore"

export function AddStoryMapCard() {
  const addStoryMap = useStoryMapStore((state) => state.addStoryMap)
  return (
    <BaseCard
      sx={{
        height: "16em",
        aspectRatio: "9/10",
        background: "transparent",
        border: "2px dashed lightgray",
        color: "gray",
      }}
      shadow={undefined}
      onClick={() =>
        addStoryMap({
          id: `story-map-${getRndInteger()}`,
          name: "New Story Map",
          cases: [],
        })
      }
    >
      <IconPlus />
    </BaseCard>
  )
}
