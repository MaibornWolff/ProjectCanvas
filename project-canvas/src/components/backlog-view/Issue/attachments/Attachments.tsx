import { Text, Group, Paper } from "@mantine/core"
import { Attachment } from "project-extender"
import { useEffect, useState } from "react"
import { AttachmentCards } from "./AttachmentCards"
import { AttachmentUploadBtn } from "./AttachmentUploadBtn"

export function Attachments(props: {
  issueKey: string
  attachments: Attachment[]
}) {
  const [valid, setValid] = useState<boolean>(true)
  const invalidate = (): void => {
    setValid(!valid)
  }
  const addAttachment = (a: Attachment): void => {
    props.attachments.push(a)
    invalidate()
  }

  useEffect(() => {}, [valid])

  return (
    <>
      <Group position="left" align="flex-start" spacing="xs">
        <Text color="dimmed" mb="sm">
          Attachments
        </Text>
        <AttachmentUploadBtn
          id={props.issueKey}
          addAttachment={addAttachment}
        />
      </Group>
      <Paper mb="lg" mr="sm">
        {props.attachments && (
          <AttachmentCards attachments={props.attachments} />
        )}
      </Paper>
    </>
  )
}
