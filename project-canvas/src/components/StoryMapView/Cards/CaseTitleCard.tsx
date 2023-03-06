import { TextInput, Title } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { useState } from "react"
import { Case } from "../Types"
import { BaseCard } from "./Base/BaseCard"
import { DeleteButton } from "./DeleteButton"

export function CaseTitleCard({
  caseColumn,
  updateCase,
  deleteCase,
}: {
  caseColumn: Case
  updateCase: (caseColumn: Partial<Case>) => void
  deleteCase: (caseId: string) => void
}) {
  const [edit, toggleEdit] = useState(false)
  const [title, setTitle] = useState(caseColumn.title)
  const { hovered, ref } = useHover()
  return (
    <BaseCard
      w="100%"
      bg="primaryBlue.0"
      pos="relative"
      radius="sm"
      m={undefined}
      shadow={undefined}
      p="md"
      ref={ref}
    >
      {!edit && title !== "" ? (
        <Title onClick={() => toggleEdit(!edit)}>{title}</Title>
      ) : (
        <TextInput
          placeholder="Title"
          onBlur={(event) => {
            setTitle(event.currentTarget.value)
            updateCase({ id: caseColumn.id, title: event.currentTarget.value })
            toggleEdit(!edit)
          }}
          variant="unstyled"
          defaultValue={title}
          autoFocus
          styles={{ input: { textAlign: "center", fontSize: "16px" } }}
        />
      )}
      <DeleteButton
        mounted={hovered}
        onClick={() => deleteCase(caseColumn.id)}
      />
    </BaseCard>
  )
}
