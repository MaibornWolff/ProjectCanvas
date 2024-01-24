import { useState } from "react"
import {
  Divider,
  Stack,
  Checkbox,
  MantineProvider,
  createTheme,
} from "@mantine/core"
import { isEqual } from "lodash"

export function CheckboxStack({
  data,
  onChange,
}: {
  data: {
    label: string
    value: string
    active?: boolean
  }[]
  onChange: (activeValues: string[]) => void
}) {
  const theme = createTheme({ cursorType: "pointer" })
  const [includedValues, setIncludedValues] = useState<string[]>(
    data.filter((d) => d.active).map((d) => d.value)
  )

  const allValues = data.map((d) => d.value)
  const allValuesSelected = isEqual(includedValues.sort(), allValues.sort())

  const changeValues = (newValues: string[]) => {
    setIncludedValues(newValues)
    onChange(newValues)
  }

  function toggleValue(value: string) {
    if (includedValues.indexOf(value) < 0)
      changeValues([...includedValues, value])
    else
      changeValues(
        includedValues.filter((containedValue) => containedValue !== value)
      )
  }

  return (
    <Stack mt="-12%">
      <MantineProvider theme={theme}>
        <Checkbox
          {...(!allValuesSelected && { c: "dimmed" })}
          label="Select All"
          checked={allValuesSelected}
          indeterminate={!allValuesSelected && includedValues.length > 0}
          onChange={() => changeValues(allValuesSelected ? [] : allValues)}
        />
        <Divider mt="-8%" />
        {data &&
          data.map((d) => (
            <Checkbox
              {...(!includedValues.includes(d.value) && { c: "dimmed" })}
              key={d.value}
              label={d.label}
              checked={includedValues.includes(d.value)}
              onChange={() => toggleValue(d.value)}
            />
          ))}
      </MantineProvider>
    </Stack>
  )
}
