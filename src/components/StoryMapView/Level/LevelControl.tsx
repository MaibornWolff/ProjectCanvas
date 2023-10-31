import { Accordion, ActionIcon, Group, TextInput } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { useState } from "react"
import { useStoryMapStore } from "../StoryMapStore"
import { SubActionLevel } from "../Types"

export function LevelControl({
  level,
  storyMapId,
}: {
  level: SubActionLevel
  storyMapId: string
}) {
  const [edit, toggleEdit] = useState(true)
  const updateLevel = useStoryMapStore((state) => state.updateLevel)
  const deleteLevel = useStoryMapStore((state) => state.deleteLevel)
  return (
    <Accordion.Control>
      <Group>
        <TextInput
          placeholder="Title"
          {...(edit ? { readOnly: false } : { readOnly: true })}
          onBlur={(event) => {
            updateLevel(storyMapId, {
              id: level.id,
              title: event.currentTarget.value,
            })
            toggleEdit(false)
          }}
          onClick={(event) => {
            event.stopPropagation()
            toggleEdit(true)
          }}
          variant="unstyled"
          styles={{ input: { padding: 0 } }}
          defaultValue={level.title}
          autoFocus
          size="lg"
        />
        <ActionIcon
          color="red"
          size="sm"
          onClick={() => {
            deleteLevel(storyMapId, level.id)
          }}
        >
          <IconTrash />
        </ActionIcon>
      </Group>
    </Accordion.Control>
  )
}
