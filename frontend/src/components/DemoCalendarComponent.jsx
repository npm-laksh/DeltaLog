// import React, { useState } from "react";
// import { Button } from "./ui/button"; // Adjust path as needed
// import { Calendar } from "./ui/calendar"; // Adjust path as needed

// export default function DemoCalendarComponent({ selectedDate, setSelectedDate }) {
//   // calendar date tracking
//   const today = new Date();
//   const [month, setMonth] = useState(today);

//   const handleSelect = (dateClicked) => {
//     console.log('Date clicked: ', dateClicked);
//     if (!dateClicked) return;

//     // update userdashboard (paraent component) state
//     setSelectedDate(dateClicked); 
//   };

//   const goToToday = () => {

//     const currentDay = new Date();
    
//     setSelectedDate(currentDay);
//     setMonth(currentDay);
//   };

//   return (
//     <div className="w-fit rounded-xl border p-4 shadow-sm bg-card">
//       <div className="mb-4 flex items-center justify-between">
//         <h3 className="text-sm font-medium text-muted-foreground">
//           Select Date
//         </h3>

//         <Button variant="outline" size="sm" onClick={goToToday}>
//           Today
//         </Button>
//       </div>

//       <Calendar
//         mode="single"
//         selected={selectedDate} 
//         onSelect={handleSelect}
//         month={month}
//         onMonthChange={setMonth}
//         captionLayout="dropdown"
//       />
//     </div>
//   );
// }


import React, { useState } from "react";
import { Button } from "./ui/button"; 
import { Calendar } from "./ui/calendar"; 

export default function DemoCalendarComponent({ selectedDate, setSelectedDate }) {
  const today = new Date();
  const [month, setMonth] = useState(today);

  const handleSelect = (dateClicked) => {
    // 1. If the user clicks an already selected day, dateClicked becomes undefined.
    // We block it here so it doesn't break the parent state or trigger a bad API call.
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
        // 2. Ensure we route directly through our safety handler
        onSelect={handleSelect} 
        month={month}
        onMonthChange={setMonth}
        captionLayout="dropdown"
      />
    </div>
  );
}