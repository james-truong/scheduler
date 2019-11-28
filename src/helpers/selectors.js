export function getAppointmentsForDay(state, Selectedday) {
  const filteredDay = state.days.filter(day => day.name === Selectedday)[0];
  if (!filteredDay) return [];
  const appointments = filteredDay.appointments;
  let appointmentList = [];
  for (const id of appointments) {
    appointmentList.push(state.appointments[id]);
  }
  return appointmentList;
}

export function getInterview(state, interview) {
  if (interview) {
    return {
      student: interview.student,
      interviewer: state.interviewers[interview.interviewer]
    };
  }
  return null;
}

export function getInterviewersForDay(state, day) {
  let interviewers = [];
  if(!state || !state.days) return [];
  const dayData = state.days.filter(d => d.name === day);
  if (dayData.length === 0) {
    return interviewers;
  } else {
    for (let interviewer of dayData[0].interviewers) {
      interviewers.push(state.interviewers[interviewer]);
    }
  }
  return interviewers;
}
