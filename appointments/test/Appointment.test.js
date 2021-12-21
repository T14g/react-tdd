import React from 'react';
import ReactDOM from 'react-dom'
import { Appointment, AppointmentsDayView } from '../src/Appointment';
// A set of tests
describe('Appointment', () => {
    let container, customer;

    // Runs before each test
    beforeEach(() => {
        container = document.createElement('div');
    });

    // Common method for both tests
    const render = component => ReactDOM.render(component, container);
    //A single test 
    it('renders the customer first name', () => {
        customer = { firstName: 'John' };
        render(<Appointment customer={customer} />);

        // To match = anywhere in body textContent
        expect(container.textContent).toMatch('John');
    });

    // Triangulation
    it('renders another customer first name', () => {
        customer = { firstName: 'Jordan' };
        render(<Appointment customer={customer} />);

        // To match = anywhere in body textContent
        expect(container.textContent).toMatch('Jordan');
    });
});

describe('AppointMentsDayView', () => {
    let container;
    const today = new Date();
    const appointments = [
        { startsAt: today.setHours(12, 0) },
        { startsAt: today.setHours(13, 0) },
    ];

    beforeEach(() => {
        container = document.createElement('div');
    });

    const render = component => ReactDOM.render(component, container);

    it('renders a div with the right id', () => {
        render(<AppointmentsDayView appointments={[]} />);
        expect(container.querySelector('div#appointmentsDayView')).not.toBeNull();
    });

    it('renders multiple appointments in a on element', () => {

        render(<AppointmentsDayView appointments={appointments} />);

        expect(container.querySelector('ol')).not.toBeNull();
        expect(container.querySelector('ol').children).toHaveLength(2);

    });

    it('renders each appointment in an li', () => {

        render(<AppointmentsDayView appointments={appointments} />);

        expect(container.querySelectorAll('li')).toHaveLength(2);

        expect(
            container.querySelectorAll('li')[0].textContent)
            .toEqual('12:00');

        expect(
            container.querySelectorAll('li')[1].textContent)
            .toEqual('13:00');
    });
});

