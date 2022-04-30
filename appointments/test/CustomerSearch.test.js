import React from "react";
import { createContainer } from "./domManipulators";
import { CustomerSearch } from '../src/CustomerSearch';

describe('CustomerSearch', () => {
    let renderAndWait, elements;

    beforeEach(() => {
        ({ renderAndWait, elements } = createContainer());
    });

    it('renders a table with four headings', async () => {
        await renderAndWait(<CustomerSearch />);
        const headings = elements('table th');
        expect(headings.map(h => h.textContent)).toEqual([
            'First name', 'Last name', 'Phone number', 'Actions'
        ]);
    });
});