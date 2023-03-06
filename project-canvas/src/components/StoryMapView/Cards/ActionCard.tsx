import { PaperProps, Text, TextInput } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { useState } from "react"
import { Action } from "../Types"
import { DraggableBaseCard } from "./Base/DraggableBaseCard"
import { DeleteButton } from "./DeleteButton"

export function ActionCard({
  id,
  index,
  action,
  updateAction,
  deleteAction,
  ...props
}: {
  id: string
  index: number
  action: Action
  updateAction: ({ id, title }: Action) => void
  deleteAction: (actionId: string) => void
} & PaperProps) {
  const [edit, toggleEdit] = useState(false)
  const [title, setTitle] = useState(action.title)
  const { hovered, ref } = useHover()

  return (
    <DraggableBaseCard
      id={id}
      index={index}
      m="sm"
      bg="primaryGreen.0"
      pos="relative"
      ref={ref}
      {...props}
    >
      {edit && title !== "" ? (
        <Text onClick={() => toggleEdit(!edit)}>{title}</Text>
      ) : (
        <TextInput
          onBlur={() => toggleEdit(!edit)}
          onChange={(event) => {
            setTitle(event.currentTarget.value)
            updateAction({ id, title: event.currentTarget.value } as Action)
          }}
          variant="unstyled"
          value={title}
          autoFocus
          styles={{ input: { textAlign: "center", fontSize: "16px" } }}
        />
      )}
      <DeleteButton mounted={hovered} onClick={() => deleteAction(action.id)} />
    </DraggableBaseCard>
  )
}
