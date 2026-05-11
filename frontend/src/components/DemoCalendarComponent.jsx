import { Calendar } from './ui/calendar'
import { useState } from 'react'

export default function DemoCalendarComponent() {
  const [date, setDate] = useState(new Date())

  const handleSelect = (selectedDate) => {
    setDate(selectedDate)
    console.log(selectedDate)
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleSelect}
      className="rounded-lg border"
      captionLayout="dropdown"
    />
  )
}