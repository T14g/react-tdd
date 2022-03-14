import React from 'react';
import { CustomerForm } from '../src/CustomerForm';
import {
    className,
    click,
    childrenOf,
    id,
    createShallowRenderer,
    type,
} from './shallowHelpers';
import { App } from '../src/App';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';

describe('App', () => {
    let render, elementMatching, child;

    beforeEach(() => {
        ({ render, elementMatching, child } = createShallowRenderer());
    });

    const beginAddingCustomerAndAppointment = () => {
        render(<App />);
        click(elementMatching(id('addCustomer')));
    };

    it('initially shows the AppointmentDayViewLoader', () => {
        render(<App />);
        expect(
            elementMatching(type(AppointmentsDayViewLoader))
        ).toBeDefined();
    });

    it('has a button bar as the first child', () => {
        render(<App />);
        expect(child(0).type).toEqual('div');
        expect(child(0).props.className).toEqual('button-bar');
    });

    it('has a button to initiate add customer and appointment action',
        () => {

            render(<App />);
            const buttons = childrenOf(
                elementMatching(className('button-bar'))
            );
            expect(buttons[0].type).toEqual('button');
            expect(buttons[0].props.children).toEqual(
                'Add customer and appointment'
            );
        });

    it('displays the CustomerForm when button is clicked', async () => {
        beginAddingCustomerAndAppointment();
        expect(elementMatching(type(CustomerForm))).toBeDefined();
    });

});