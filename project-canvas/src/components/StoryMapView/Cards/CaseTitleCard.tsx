import { ActionIcon, Paper, TextInput, Title } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { useState } from "react"
import { Case } from "../Types"

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

  return (
    <Paper
      sx={(theme) => ({
        height: "6.5em",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.primaryBlue[0],
        position: "relative",
      })}
      radius="sm"
      p="md"
    >
      {edit && title !== "" ? (
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
      <ActionIcon
        sx={{ position: "absolute", top: 2, right: 2 }}
        color="red"
        size="sm"
        variant="transparent"
        onClick={() => deleteCase(caseColumn.id)}
      >
        <IconTrash />
      </ActionIcon>
    </Paper>
  )
}
