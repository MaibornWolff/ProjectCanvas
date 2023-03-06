import { PaperProps, Text, TextInput } from "@mantine/core"
import { useHover, useToggle } from "@mantine/hooks"
import { useState } from "react"
import { SubAction } from "../Types"
import { DraggableBaseCard } from "./Base/DraggableBaseCard"
import { DeleteButton } from "./DeleteButton"

export function SubActionCard({
  id,
  index,
  subAction,
  updateSubAction,
  deleteSubAction,
  ...props
}: {
  id: string
  index: number
  subAction: SubAction
  updateSubAction: ({ id, title }: SubAction) => void
  deleteSubAction: (subActionId: string) => void
} & PaperProps) {
  const [edit, toggleEdit] = useToggle()
  const [title, setTitle] = useState(subAction.title)
  const { hovered, ref } = useHover()

  return (
    <DraggableBaseCard
      id={id}
      index={index}
      m="sm"
      bg="white"
      pos="relative"
      ref={ref}
      {...props}
    >
      {edit && title !== "" ? (
        <Text onClick={() => toggleEdit()}>{title}</Text>
      ) : (
        <TextInput
          onBlur={() => toggleEdit()}
          placeholder="Title"
          onChange={(event) => {
            setTitle(event.currentTarget.value)
            updateSubAction({ id, title: event.currentTarget.value })
          }}
          variant="unstyled"
          value={title}
          autoFocus
          styles={{ input: { textAlign: "center", fontSize: "16px" } }}
        />
      )}
      <DeleteButton
        mounted={hovered}
        onClick={() => deleteSubAction(subAction.id)}
      />
    </DraggableBaseCard>
  )
}
