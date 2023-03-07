import { IconPlus } from "@tabler/icons"
import { BaseCard } from "./Cards/Base/BaseCard"
import { useStoryMapStore } from "./StoryMapStore"

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
      onClick={() => addStoryMap({ id: "3", name: "new" })}
    >
      <IconPlus />
    </BaseCard>
  )
}
