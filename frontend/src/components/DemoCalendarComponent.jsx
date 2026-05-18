import { Calendar } from "./ui/calendar";
import { useState } from "react";
import { Button } from "./ui/button";

export default function DemoCalendarComponent() {
  const today = new Date();

  const [date, setDate] = useState(today);
  const [month, setMonth] = useState(today);

  const handleSelect = (selectedDate) => {
    console.log('date: ', selectedDate)
    if (!selectedDate) return;

    setDate(selectedDate);
    console.log(selectedDate);
  };

  const goToToday = () => {
    const today = new Date();

    setDate(today);
    setMonth(today);
  };

  return (
    <div className="w-fit rounded-xl border p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Select Date
        </h3>

        <Button variant="outline" size="sm" onClick={goToToday}>
          Today
        </Button>
      </div>

      <Calendar
        mode="single"
        selected={date}
        onSelect={handleSelect}
        month={month}
        onMonthChange={setMonth}
        captionLayout="dropdown"
      />
    </div>
  );
}
