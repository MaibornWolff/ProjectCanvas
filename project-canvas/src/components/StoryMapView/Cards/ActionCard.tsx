import { PaperProps } from "@mantine/core"
import { ItemCard } from "./ItemCard"
import { Action } from "../types"

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
  return (
    <ItemCard
      id={id}
      index={index}
      editItem={() => editAction({ id, title: "NEWWW" } as Action)}
      itemType="action"
      m="sm"
      {...props}
    >
      {children}
    </ItemCard>
  )
}
