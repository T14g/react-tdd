import React from "react";
import { createContainer } from "./domManipulators";
import { CustomerSearch } from '../src/CustomerSearch';
import { fetchResponseOk } from "./spyHelpers";
import 'whatwg-fetch';

describe('CustomerSearch', () => {
    let renderAndWait, elements;

    beforeEach(() => {
        ({ renderAndWait, elements } = createContainer());

        jest.spyOn(window, 'fetch');
    });

    it('renders a table with four headings', async () => {
        await renderAndWait(<CustomerSearch />);
        const headings = elements('table th');
        expect(headings.map(h => h.textContent)).toEqual([
            'First name', 'Last name', 'Phone number', 'Actions'
        ]);
    });

    it('fetches all customer data when component mounts', async () => {
        await renderAndWait(<CustomerSearch />);

        // You need a mock for window.fetch for this to work 
        expect(window.fetch).toHaveBeenCalledWith('/customers', {
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' }
        });
    });

});