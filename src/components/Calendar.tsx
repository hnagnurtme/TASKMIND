// CalendarView.tsx
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { vi } from "date-fns/locale/vi"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "@/css/CalendarView.css"
import { useTasks } from "@/contexts/tasks.context"
import { useState } from "react"

const locales = { vi }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

function CalendarView() {
  const { tasks } = useTasks()
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState<View>("month") // ✅ quản lý view

  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: new Date(task.deadline),
    end: new Date(new Date(task.deadline).getTime() + 60 * 60 * 1000),
    allDay: false,
    priority: task.priority,
  }))

  return (
    <div style={{ height: "80vh" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        view={view} 
        onView={(newView) => setView(newView)} 
        style={{ height: "100%" }}
        eventPropGetter={(event: any) => {
          let className = ""
          if (event.priority === "high") className = "high"
          else if (event.priority === "medium") className = "medium"
          else if (event.priority === "low") className = "low"

          return { className }
        }}
        messages={{
          today: "Hôm nay",
          previous: "Trước",
          next: "Tiếp",
          month: "Tháng",
          week: "Tuần",
          day: "Ngày",
          agenda: "Lịch biểu",
        }}
      />
    </div>
  )
}

export default CalendarView
