import Appointment from "components/Appointment";

export function getAppointmentsForDay(state, Selectedday) {

  const filteredDay = state.days.filter(day => day.name === Selectedday)[0];
  if(!filteredDay) return [];
  const appointments = filteredDay.appointments;
  console.log(filteredDay);
  console.log(appointments);
  let appointmentList = [];
  for (const id of appointments){
    appointmentList.push(state.appointments[id]);
  }
  return appointmentList;
}