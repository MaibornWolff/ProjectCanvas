import { Center } from "@mantine/core"
import { useState } from "react"
import { AddStoryMapCard } from "./AddStoryMapCard"
import { StoryMapCard } from "./StoryMapCard"

export function StoryMapDashboard() {
  const [storyMaps, setStoryMaps] = useState<{ id: string; name: string }[]>([
    {
      id: "0",
      name: "first story map",
    },
    {
      id: "1",
      name: "second story map",
    },
  ])

  return (
    <Center>
      {storyMaps.map((storyMap) => (
        <StoryMapCard key={storyMap.id} storyMap={storyMap} />
      ))}
      <AddStoryMapCard setStoryMaps={setStoryMaps} />
    </Center>
  )
}
