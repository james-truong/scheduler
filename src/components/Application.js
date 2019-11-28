import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors";
import axios from "axios";

export default function Application(props) {
  // const [day, setDay] = useState("Monday");
  // const [days, setDays] = useState([]);
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });


  const setDay = day => setState({ ...state, day });
  //const setDays = days => setState({...state, days})
  //const setDays = days => setState(prev => ({ ...prev, days }));

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get(`/api/days`)),
      Promise.resolve(axios.get(`/api/appointments`)),
      Promise.resolve(axios.get(`/api/interviewers`))
    ]).then(all => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;

      setState(prev => ({
        days: days,
        appointments: appointments,
        interviewers: interviewers
      }));
    })
  }, []);
  //const interviewers = getInterviewersForDay(state, state.day);


  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // push appointment to db and update state if successful
    return axios.put(`api/appointments/${id}`, appointment)
      .then(() => setState(prev => ({ ...prev, appointments })));
  }

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // delete interview from db and update state if successful
    return axios.delete(`api/appointments/${id}`)
      .then(() => setState(prev => ({ ...prev, appointments })));
  }

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />{" "}
      </section>
      <section className="schedule">
        {state.appointments &&
          getAppointmentsForDay(state, state.day).map(appointment => {
            const interview = getInterview(state, appointment.interview);
            return (
              <Appointment
                cancelInterview={cancelInterview}
                bookInterview={bookInterview}
                key={appointment.id}
                id={appointment.id}
                time={appointment.time}
                interview={interview}
                interviewers={getInterviewersForDay(state, state.day)}
              />
            );
          })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

