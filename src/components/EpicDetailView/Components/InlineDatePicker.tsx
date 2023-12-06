import { Text, Box, useMantineTheme } from "@mantine/core"
import { UseMutationResult } from "@tanstack/react-query"
import { useState } from "react"
import { DatePicker } from "@mantine/dates";

export function InlineDatePicker(props: {
  date: Date | undefined
  placeholder: string
  mutation: UseMutationResult<unknown, unknown, Date | undefined>
}) {
  const theme = useMantineTheme()
  const [currentDate, setCurrentDate] = useState(props.date)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <span>
      {showDatePicker ? (
        <DatePicker
          placeholder={props.placeholder}
          withinPortal
          clearable
          onBlur={() => {
            setShowDatePicker(false)
            props.mutation.mutate(currentDate)
          }}
          onChange={(value) => {
            setCurrentDate(value || undefined)
          }}
        />
      ) : (
        <Box
          onClick={() => setShowDatePicker(true)}
          sx={{
            ":hover": {
              cursor: "pointer",
              boxShadow: theme.shadows.xs,
              borderRadius: theme.radius.xs,
              transition: "background-color .8s ease-out",
            },
          }}
        >
          {props.date ? (
            <Text>{dateFormat.format(props.date)}</Text>
          ) : (
            <Text color="dimmed">None</Text>
          )}
        </Box>
      )}
    </span>
  )
}
