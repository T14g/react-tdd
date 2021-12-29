import React from "react";

export const AppointmentForm = ({ selectableServices, service }) => (
    <form id="appointment" >
        <label htmlFor="service">Service</label>
        <select
            name="service"
            value={service}
            readOnly
            id="service"
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

AppointmentForm.defaultProps = {
    selectableServices: [
        'Cut',
        'Blow-dry',
        'Cut & color',
        'Beard trim',
        'Cut & beard trim',
        'Extensions']
};