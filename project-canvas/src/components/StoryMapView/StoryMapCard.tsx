import { useNavigate } from "react-router-dom"
import { BaseCard } from "./Cards/Base/BaseCard"

export function StoryMapCard({
  storyMap,
}: {
  storyMap: { id: string; name: string }
}) {
  const navigate = useNavigate()
  return (
    <BaseCard
      sx={{
        height: "16em",
        aspectRatio: "9/10",
      }}
      onClick={() => navigate(storyMap.id)}
    >
      {storyMap.name}
    </BaseCard>
  )
}
