import React from 'react';
import ReactDOM from 'react-dom'
import ReactTestUtils from 'react-dom/test-utils';
import { Appointment, AppointmentsDayView } from '../src/AppointmentsDayView';
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

    //A single test 
    it('renders the customer last name', () => {
        customer = { firstName: 'Silva' };
        render(<Appointment customer={customer} />);

        // To match = anywhere in body textContent
        expect(container.textContent).toMatch('Silva');
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
        {
            startsAt: today.setHours(12, 0),
            customer: { firstName: 'John' }
        },
        {
            startsAt: today.setHours(13, 0),
            customer: { firstName: 'Jordan' }
        },
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

    it('initially shows a message saying there no appointments today', () => {
        render(<AppointmentsDayView appointments={[]} />);

        expect(container.textContent).toMatch('No appointments');
    });

    it('selects the first appointment by default', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        expect(container.textContent).toMatch('John');
    });

    it('has a button element in each li', () => {
        render(<AppointmentsDayView appointments={appointments} />);

        expect(container.querySelectorAll('li > button')).toHaveLength(2);
        expect(container.querySelectorAll('li > button')[0].type).toEqual('button');

    });

    it('renders another appointment when selected', () => {
        render(<AppointmentsDayView appointments={appointments} />);
        const button = container.querySelectorAll('button')[1];
        ReactTestUtils.Simulate.click(button);
        expect(container.textContent).toMatch('Jordan');
    });

});

