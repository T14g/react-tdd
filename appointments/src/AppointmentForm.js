import React, { useState, useCallback } from "react";
import { TimeSlotTable } from '../src/TimeSlotTable';

export const AppointmentForm = ({
    selectableServices,
    service,
    onSubmit,
    openAt,
    closeAt,
    today,
    availableTimeSlots,
    startsAt }) => {
    const [appointment, setAppointment] = useState({ service: service });

    const handleChange = ({ target }) => {
        setAppointment(appointment => ({
            ...appointment,
            [target.name]: target.value
        }));
    };

    const handleStartsAtChange = useCallback(
        ({ target: { value } }) =>
            setAppointment(appointment => ({
                ...appointment,
                startsAt: parseInt(value)
            })),
        []
    );

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
            <TimeSlotTable
                openAt={openAt}
                closeAt={closeAt}
                today={today}
                availableTimeSlots={availableTimeSlots}
                checkedTimeSlot={startsAt}
                handleChange={handleStartsAtChange}
            />
        </form>
    );
}

AppointmentForm.defaultProps = {
    checkedTimeSlot: '',
    availableTimeSlots: [],
    today: new Date(),
    openAt: 9,
    closeAt: 19,
    selectableServices: [
        'Cut',
        'Blow-dry',
        'Cut & color',
        'Beard trim',
        'Cut & beard trim',
        'Extensions']
};

