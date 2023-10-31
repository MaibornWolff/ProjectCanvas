import { Center, Group, Stack, Text, Title } from "@mantine/core"
import { AddStoryMapCard } from "./StoryMap/AddStoryMapCard"
import { StoryMapCard } from "./StoryMap/StoryMapCard"
import { useStoryMapStore } from "./StoryMapStore"

export function StoryMapDashboard() {
  const storyMaps = useStoryMapStore((state) => state.storyMaps)

  return (
    <Center h="100%">
      <Stack align="center" spacing="xl">
        <Stack align="center">
          <Title>Story Map</Title>
          <Text>Please select a story map or add a new one.</Text>
        </Stack>
        <Group maw="70vw" position="center">
          {storyMaps.map((storyMap) => (
            <StoryMapCard key={storyMap.id} {...storyMap} />
          ))}
          <AddStoryMapCard />
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
