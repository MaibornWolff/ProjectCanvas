import { Accordion, ActionIcon, Group, TextInput } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { useState } from "react"
import { Updater } from "use-immer"
import { SubActionLevel } from "../Types"

export function LevelControl({
  level,
  setLevels,
}: {
  level: SubActionLevel
  setLevels: Updater<SubActionLevel[]>
}) {
  const [edit, toggleEdit] = useState(true)

  return (
    <Accordion.Control>
      <Group>
        <TextInput
          placeholder="Title"
          {...(edit ? { readOnly: false } : { readOnly: true })}
          onBlur={(event) => {
            setLevels((draft) => {
              const lvl = draft.find((_level) => _level.id === level.id)
              if (!lvl || !event.currentTarget.value) return
              lvl.title = event.currentTarget.value
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
            setLevels((draft) => {
              const levelIndex = draft.findIndex(
                (_level) => _level.id === level.id
              )
              draft.splice(levelIndex, 1)
            })
          }}
        >
          <IconTrash />
        </ActionIcon>
      </Group>
    </Accordion.Control>
  )
}
