import React, { useEffect } from 'react';

export const AppointmentsDayViewLoader = ({ today }) => {
    let from, to;
    
    useEffect(() => {
        
        from = today.setHours(0, 0, 0, 0);
        to = today.setHours(23, 59, 59, 999);

        const fetchAppointments = () => {
            window.fetch(`/appointments/${from}-${to}`, {
                method: 'GET',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' }
            });
        };
        fetchAppointments();
    }, [from, to]);
    
    return null;
};
