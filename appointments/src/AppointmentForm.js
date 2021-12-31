import React, { useState } from "react";

export const AppointmentForm = ({ selectableServices, service, onSubmit }) => {
    const [appointment, setAppointment] = useState({ service: service });

    const handleChange = ({ target }) => {
        setAppointment(appointment => ({
            ...appointment,
            [target.name]: target.value
        }));
    };

    return (
        <form id="appointment" onSubmit={() => onSubmit(appointment)} >
            <label htmlFor="service">Service</label>
            <select
                name="service"
                value={service}
                readOnly
                id="service"
                onChange={handleChange}
            >
                <option />
                {
                    selectableServices.map(s => (
                        <option key={s}>{s}</option>
                    ))
                }
            </select>
        </form>
    );
}

AppointmentForm.defaultProps = {
    selectableServices: [
        'Cut',
        'Blow-dry',
        'Cut & color',
        'Beard trim',
        'Cut & beard trim',
        'Extensions']
};