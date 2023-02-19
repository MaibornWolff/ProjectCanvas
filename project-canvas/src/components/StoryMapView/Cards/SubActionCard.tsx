import { PaperProps, Text, TextInput } from "@mantine/core"
import { useToggle } from "@mantine/hooks"
import { useState } from "react"
import { SubAction } from "../types"
import { ItemCard } from "./ItemCard"

export function SubActionCard({
  id,
  index,
  children,
  editSubAction,
  ...props
}: {
  id: string
  index: number
  children: string
  editSubAction: ({ id, title }: SubAction) => void
} & PaperProps) {
  const [edit, toggleEdit] = useToggle()
  const [title, setTitle] = useState(children)

  return (
    <ItemCard id={id} index={index} itemType="subAction" m="sm" {...props}>
      {edit && title !== "" ? (
        <Text onClick={() => toggleEdit()}>{title}</Text>
      ) : (
        <TextInput
          onBlur={() => toggleEdit()}
          placeholder="Title"
          onChange={(event) => {
            setTitle(event.currentTarget.value)
            editSubAction({ id, title: event.currentTarget.value })
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
