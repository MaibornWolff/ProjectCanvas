import { PaperProps, Text, TextInput } from "@mantine/core"
import { useState } from "react"
import { Action } from "../types"
import { ItemCard } from "./ItemCard"

export function ActionCard({
  id,
  index,
  children,
  updateAction,
  ...props
}: {
  id: string
  index: number
  children: string
  updateAction: ({ id, title }: Action) => void
} & PaperProps) {
  const [edit, toggleEdit] = useState(false)
  const [title, setTitle] = useState(children)
  return (
    <ItemCard id={id} index={index} itemType="action" m="sm" {...props}>
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
    </ItemCard>
  )
}
