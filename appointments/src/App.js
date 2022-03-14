import React from "react";
import ReactDOM from 'react-dom';
import { AppointmentsDayViewLoader } from "./AppointmentsDayViewLoader";

export const App = () => (
    <React.Fragment>
        <div className="button-bar" />
        <AppointmentsDayViewLoader />
    </React.Fragment>
);