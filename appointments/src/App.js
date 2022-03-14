import React, { useState, useCallback } from "react";
import ReactDOM from 'react-dom';
import { CustomerForm } from "./CustomerForm";
import { AppointmentsDayViewLoader } from "./AppointmentsDayViewLoader";

export const App = () => {
    const [view, setView] = useState('dayView');

    const transitionToAddCustomer = useCallback(
        () => setView('addCustomer'),
        []
    );

    return (
        <React.Fragment>
            <div className="button-bar" >
                <button type="button" id="addCustomer" onClick={transitionToAddCustomer}>
                    Add customer and appointment
                </button>
            </div>
            <AppointmentsDayViewLoader />
            {view === 'addCustomer' ? <CustomerForm /> : <></>}
        </React.Fragment>
    );
};

