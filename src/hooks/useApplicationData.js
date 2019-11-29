import { useReducer, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  // reducer will take in actions and apply logic based on dispatch actions and data
  // reducer will take in (action, data)
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        // copy state and overwrite with new day
        return { ...state, day: action.day };
      case SET_APPLICATION_DATA:
        //copy state and overwrite with new days, appointments, interviewers
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        };
      case SET_INTERVIEW: {
        return { ...state, appointments: action.appointments };
      }

      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  // set states to each of the objects we want to track and set dispatch actions to each.
  // We pass the useReducer hook to use the reducer actions we declared above.
  // dispatch will now be responsible for handling all cases
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => dispatch({ type: SET_DAY, day });
  // this is to set the app data
  useEffect(() => {
    //const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    const daysData = axios.get("/api/days");
    const appointmentsData = axios.get("/api/appointments");
    const interviewersData = axios.get("/api/interviewers");
    Promise.all([daysData, appointmentsData, interviewersData]).then(all => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      });
    });
    // webSocket.onmessage = function (event) {
    //   const data = JSON.parse(event.data);
    //   if (data.type === "SET_INTERVIEW") {
    //     dispatch({ type: SET_INTERVIEW, data })
    //   }
    // }
  }, []);
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      const SelectedDay = state.days.filter(d => d.name === state.day);

      state.days[SelectedDay[0].id - 1].spots--;
      dispatch({
        type: SET_INTERVIEW,
        appointments
      });
    });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`).then(() => {
      const dayData = state.days.filter(d => d.name === state.day);
      state.days[dayData[0].id - 1].spots++;
      dispatch({
        type: SET_INTERVIEW,
        appointments
      });
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
