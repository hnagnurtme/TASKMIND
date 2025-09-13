// CalendarView.tsx
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { vi } from "date-fns/locale/vi"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useTasks } from "@/contexts/tasks.context"

const locales = {
  vi: vi,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

function CalendarView() {
  const { tasks } = useTasks()

  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: new Date(task.deadline),
    end: new Date(new Date(task.deadline).getTime() + 60 * 60 * 1000), // +1h
    allDay: false,
  }))

  return (
    <div style={{ height: "80vh" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
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
