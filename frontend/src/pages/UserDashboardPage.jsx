import Navbar from "../components/common/Navbar"
// import CalendarComponent from "../components/CalendarComponent"
import DemoCalendarComponent from "../components/DemoCalendarComponent"
import JournalEntry from "../components/JournalEntry"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card"

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="p-6">

        <div className="flex flex-wrap justify-evenly gap-6 w-full items-start">

          <Card className="w-52 h-28">
            <CardHeader>
              <CardTitle>Check In</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">08:30 AM</p>
            </CardContent>
          </Card>     

          <Card className="w-52 h-28">
            <CardHeader>
              <CardTitle>Check Out</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">05:30 PM</p>
            </CardContent>
          </Card>

          <Card className="w-52 h-28">
            <CardHeader>
              <CardTitle>Check in Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1 hour</p>
            </CardContent>
          </Card>

          <DemoCalendarComponent />

        </div>

        <JournalEntry />

      </main>
    </div>
  )
}