import { Paper, TextInput, Title } from "@mantine/core"
import { useState } from "react"
import { Case } from "../types"

export function CaseTitleCard({
  caseColumn,
  updateCase,
}: {
  caseColumn: Case
  updateCase: (caseColumn: Partial<Case>) => void
}) {
  const [edit, toggleEdit] = useState(false)
  const [title, setTitle] = useState(caseColumn.title)

  return (
    <Paper
      sx={(theme) => ({
        height: "5em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.primaryBlue[0],
        width: "100%",
      })}
      radius="sm"
      p="md"
      shadow="md"
    >
      {edit && title !== "" ? (
        <Title onClick={() => toggleEdit(!edit)}>{title}</Title>
      ) : (
        <TextInput
          onBlur={() => toggleEdit(!edit)}
          placeholder="Title"
          onChange={(event) => {
            setTitle(event.currentTarget.value)
            updateCase({ id: caseColumn.id, title: event.currentTarget.value })
          }}
          variant="unstyled"
          value={title}
          autoFocus
          styles={{ input: { textAlign: "center", fontSize: "16px" } }}
        />
      )}
    </Paper>
  )
}
