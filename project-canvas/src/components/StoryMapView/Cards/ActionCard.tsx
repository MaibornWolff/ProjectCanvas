import { PaperProps, Text, TextInput } from "@mantine/core"
import { useToggle } from "@mantine/hooks"
import { useState } from "react"
import { Action } from "../types"
import { ItemCard } from "./ItemCard"

export function ActionCard({
  id,
  index,
  children,
  editAction,
  ...props
}: {
  id: string
  index: number
  children: string
  editAction: ({ id, title }: Action) => void
} & PaperProps) {
  const [edit, toggleEdit] = useToggle()
  const [title, setTitle] = useState(children)
  return (
    <ItemCard id={id} index={index} itemType="action" m="sm" {...props}>
      {edit && title !== "" ? (
        <Text onClick={() => toggleEdit()}>{title}</Text>
      ) : (
        <TextInput
          onBlur={() => toggleEdit()}
          onChange={(event) => {
            setTitle(event.currentTarget.value)
            editAction({ id, title: event.currentTarget.value } as Action)
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
