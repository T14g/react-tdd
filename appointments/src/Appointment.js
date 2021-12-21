import React from "react";

export const Appointment = ({ customer: { firstName } }) => (
    <div>{firstName}</div>
);

export const AppointmentsDayView = () => <div id="appointmentsDayView"></div>;;