import React, { useState } from "react";

const appointmentTimeOfDay = startsAt => {
    const [h, m] = new Date(startsAt).toTimeString().split(':');
    return `${h}:${m}`;
}


export const Appointment = ({ customer: { firstName } }) => (
    <div>{firstName}</div>
);

export const AppointmentsDayView = ({ appointments }) => {
    const [selected, setSelected] = useState(0);

    return (
        <div id="appointmentsDayView">
            <ol>
                {
                    appointments.map((appointment, i) => (
                        <li key={appointment.startsAt} >
                            <button
                                type="button"
                                onClick={() => setSelected(i)}
                            >
                                {appointmentTimeOfDay(appointment.startsAt)}
                            </button>
                        </li>
                    ))
                }
            </ol>


            {
                appointments.length === 0 ? (
                    <p>No appointments</p>
                ) : (
                    <Appointment {...appointments[selected]} />
                )
            }
        </div>
    );
}

