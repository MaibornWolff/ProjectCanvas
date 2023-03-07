import { Center, Group, Stack, Text, Title } from "@mantine/core"
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
    <Center h="100%">
      <Stack align="center" spacing="xl">
        <Stack align="center">
          <Title>Story Map</Title>
          <Text>Please select a story map or add a new one.</Text>
        </Stack>
        <Group maw="70vw" position="center">
          {storyMaps.map((storyMap) => (
            <StoryMapCard key={storyMap.id} storyMap={storyMap} />
          ))}
          <AddStoryMapCard setStoryMaps={setStoryMaps} />
        </Group>
        <Stack align="center">
          <Text size="sm" c="dimmed">
            Story Map is currently a local feature (not synchronized with
            current provider).
          </Text>
          <Text size="sm" c="dimmed">
            Feature is still in development.
          </Text>
        </Stack>
      </Stack>
    </Center>
  )
}
