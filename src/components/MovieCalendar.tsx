import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("pl-PL");
const today = new Date();
const min = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6);
const max = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  21
);

export default function MovieCalendar({ seans, halls }: any) {
  const styles = {
    background: "#fff",
    padding: "2em",
    color: "#000",
  };

  const localizer = momentLocalizer(moment);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={seans}
        titleAccessor="id"
        startAccessor="startDate"
        endAccessor="endDdate"
        resourceAccessor="cinemaHallId"
        style={styles}
        defaultView={Views.DAY}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        step={60}
        defaultDate={new Date(2022, 7, 2)}
        min={min}
        max={max}
        resources={halls}
        resourceIdAccessor="id"
        resourceTitleAccessor="name"
      />
    </div>
  );
}
