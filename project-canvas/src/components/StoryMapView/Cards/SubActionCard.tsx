import { PaperProps } from "@mantine/core"
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
  return (
    <ItemCard
      id={id}
      index={index}
      editItem={() => editSubAction({ id, title: "NEW SUB BABY" })}
      itemType="subAction"
      m="sm"
      {...props}
    >
      {children}
    </ItemCard>
  )
}
