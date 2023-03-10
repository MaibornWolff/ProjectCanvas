import { IconPlus } from "@tabler/icons"
import { MouseEventHandler } from "react"
import { BaseCard } from "../Base/BaseCard"

export function AddCase({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLDivElement>
}) {
  return (
    <BaseCard
      sx={{
        background: "transparent",
        border: "2px dashed lightgray",
        color: "gray",
      }}
      shadow={undefined}
      m={undefined}
      onClick={onClick}
    >
      <IconPlus />
    </BaseCard>
  )
}
