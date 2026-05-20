import React, { useState } from "react";
import { Button } from "./ui/button"; 
import { Calendar } from "./ui/calendar"; 

export default function DemoCalendarComponent({ selectedDate, setSelectedDate }) {
  const today = new Date();
  const [month, setMonth] = useState(today);

  const handleSelect = (dateClicked) => {
    // handle already selected date on calendar
    if (!dateClicked) {
      console.log("Selection cleared or undefined blocked.");
      return; 
    }

    console.log('Valid date clicked: ', dateClicked);
    setSelectedDate(dateClicked); 
  };

  const goToToday = () => {
    const currentDay = new Date();
    setSelectedDate(currentDay);
    setMonth(currentDay);
  };

  return (
    <div className="w-fit rounded-xl border p-4 shadow-sm bg-card">
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
        selected={selectedDate}
        onSelect={handleSelect} 
        month={month}
        onMonthChange={setMonth}
        captionLayout="dropdown"
      />
    </div>
  );
}