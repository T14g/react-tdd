import React from 'react';
import ReactDOM from 'react-dom'
import { Appointment } from '../src/Appointment';
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