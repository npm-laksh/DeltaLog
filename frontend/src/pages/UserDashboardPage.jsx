import DatePicker from "../components/DatePicker"
import Navbar from "../components/common/Navbar"

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="p-6">
        Daily Journal
        <DatePicker/>
      </main>
    </div>
  )
}