import { useHover } from "@mantine/hooks"
import { useNavigate } from "react-router-dom"
import { BaseCard } from "./Cards/Base/BaseCard"
import { DeleteButton } from "./Components/DeleteButton"
import { useStoryMapStore } from "./StoryMapStore"
import { StoryMap } from "./Types"

export function StoryMapCard({ storyMap }: { storyMap: StoryMap }) {
  const navigate = useNavigate()
  const deleteStoryMap = useStoryMapStore((state) => state.deleteStoryMap)
  const { ref, hovered } = useHover()
  return (
    <BaseCard
      sx={{
        height: "16em",
        aspectRatio: "9/10",
        position: "relative",
      }}
      ref={ref}
      onClick={() => navigate(storyMap.id)}
    >
      {storyMap.name}
      <DeleteButton
        onClick={(event) => {
          event.stopPropagation()
          deleteStoryMap(storyMap.id)
        }}
        mounted={hovered}
      />
    </BaseCard>
  )
}
