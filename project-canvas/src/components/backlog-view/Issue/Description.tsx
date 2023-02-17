import { Textarea, Text } from "@mantine/core"
import { ChangeEventHandler, FocusEventHandler, MouseEventHandler } from "react"

export function Description(props: {
  showInputEle: boolean
  handleChange: ChangeEventHandler<HTMLTextAreaElement> | undefined
  handleBlur: FocusEventHandler<HTMLTextAreaElement> | undefined
  handleDoubleClick: MouseEventHandler<HTMLSpanElement> | undefined
  value: string
}) {
  return (
    <span>
      {props.showInputEle ? (
        <Textarea
          value={props.value}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          autosize
        />
      ) : (
        <Text onClick={props.handleDoubleClick} mb="xl">
          {props.value !== null ? props.value : "Add Description"}
        </Text>
      )}
    </span>
  )
}
