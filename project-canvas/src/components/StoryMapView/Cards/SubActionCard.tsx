import { PaperProps, Text, TextInput } from "@mantine/core"
import { useToggle } from "@mantine/hooks"
import { useState } from "react"
import { SubAction } from "../Types"
import { DraggableBaseCard } from "./Base/DraggableBaseCard"

export function SubActionCard({
  id,
  index,
  children,
  updateSubAction,
  ...props
}: {
  id: string
  index: number
  children: string
  updateSubAction: ({ id, title }: SubAction) => void
} & PaperProps) {
  const [edit, toggleEdit] = useToggle()
  const [title, setTitle] = useState(children)

  return (
    <DraggableBaseCard id={id} index={index} m="sm" bg="white" {...props}>
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
    </DraggableBaseCard>
  )
}
