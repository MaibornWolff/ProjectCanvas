import { IconPlus } from "@tabler/icons"
import { BaseCard } from "../Cards/Base/BaseCard"
import { getRndInteger, STORY_MAP_PREFIX } from "../helpers/utils"
import { useStoryMapStore } from "../StoryMapStore"

export function AddStoryMapCard() {
  const addStoryMap = useStoryMapStore((state) => state.addStoryMap)
  return (
    <BaseCard
      style={{
        height: "16em",
        aspectRatio: "9/10",
        background: "transparent",
        border: "2px dashed lightgray",
        color: "gray",
      }}
      shadow={undefined}
      onClick={() =>
        addStoryMap({
          id: `${STORY_MAP_PREFIX}-${getRndInteger()}`,
          name: "New Story Map",
          cases: [],
          levels: [],
        })
      }
    >
      <IconPlus />
    </BaseCard>
  )
}
