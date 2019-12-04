import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

export default function useApplicationData() {
  console.log("RESET APP STATE")

  const setDay = day => dispatch({ type: SET_DAY, day });
  const [state, dispatch] = useReducer(reducer, {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then(([days, appointments, interviewers]) => {
      dispatch({type: SET_APPLICATION_DATA, days: days.data, appointments: appointments.data, interviewers: interviewers.data})
      })
  }, []);

  function bookInterview(id, interview) {
    return axios.put("/api/appointments/" + id, {interview})
      // .then(() => {
      //   // reduces the number of spots by 1 when an interview is booked
      //   if (state.appointments[id].interview === null) {
         
      //   const currDayName = state.day;
      //   const dayObj = state.days.find(day => day.name === currDayName);
      //   state.days[dayObj.id-1].spots--;
      //   }
      // })
      .then(() => dispatch({type: SET_INTERVIEW, id, interview}))
  }

  function cancelInterview(id) {
    return axios.delete("/api/appointments/" + id)
      // .then(() => {
  
      //   // increases the number of spots by 1 when an interview is booked
      //   const currDayName = state.day;
      //   const dayObj = state.days.find(day => day.name === currDayName);
      //   console.log("INCREMETING SPOTS")
      //   state.days[dayObj.id-1].spots++;
      // })
      .then(() => dispatch({type: SET_INTERVIEW, id, interview: null}))
      
  }

  return { state, setDay, bookInterview, cancelInterview }
}