import React from 'react';
import ReactDOM from 'react-dom'
import { Appointment } from '../src/Appointment';
// A set of tests
describe('Appointment', () => {
    //A single test 
    it('renders the customer first name', () => {
        const customer = { firstName: 'John' };
        const container = document.createElement('div');

        ReactDOM.render(<Appointment customer={customer} />, container);

        // To match = anywhere in body textContent
        expect(container.textContent).toMatch('John');
    });

    // Triangulation
    it('renders another customer first name', () => {
        const customer = { firstName: 'Jordan' };
        const container = document.createElement('div');

        ReactDOM.render(<Appointment customer={customer} />, container);

        // To match = anywhere in body textContent
        expect(container.textContent).toMatch('Jordan');
    });
});