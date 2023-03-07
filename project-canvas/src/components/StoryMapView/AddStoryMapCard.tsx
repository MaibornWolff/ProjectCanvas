import { IconPlus } from "@tabler/icons"
import { Dispatch, SetStateAction } from "react"
import { BaseCard } from "./Cards/Base/BaseCard"

export function AddStoryMapCard({
  setStoryMaps,
}: {
  setStoryMaps: Dispatch<
    SetStateAction<
      {
        id: string
        name: string
      }[]
    >
  >
}) {
  return (
    <BaseCard
      sx={{
        height: "16em",
        aspectRatio: "9/10",
        background: "transparent",
        border: "2px dashed lightgray",
        color: "gray",
      }}
      shadow={undefined}
      onClick={() =>
        setStoryMaps((prevStoryMaps) => [
          ...prevStoryMaps,
          { id: "3", name: "new" },
        ])
      }
    >
      <IconPlus />
    </BaseCard>
  )
}
