import { DatePicker } from "@mantine/dates"
import { useState } from "react"

export function CustomDatePicker() {
  const [pickedDate, setPickedDate] = useState(new Date())

  const handleChange = (newValue: Date | null) => {
    setPickedDate(newValue || pickedDate)
  }

  return <DatePicker value={pickedDate} onChange={handleChange} />
}
