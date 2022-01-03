import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulators';
import { AppointmentForm } from '../src/AppointmentForm';

describe('AppointmentForm', () => {
    let render, container;

    beforeEach(() => {
        ({ render, container } = createContainer());
    });

    const form = id => container.querySelector(`form[id="${id}"]`);
    const labelFor = formEl => container.querySelector(`label[for="${formEl}"]`);
    const field = name => form('appointment').elements[name];

    it('renders a form', () => {
        render(<AppointmentForm />);
        expect(form('appointment')).not.toBeNull();
    });

    describe('service field', () => {
        const findOption = (dropdownNode, textContent) => {
            const options = Array.from(dropdownNode.childNodes);
            return options.find(
                option => option.textContent === textContent
            );
        };

        it('renders as a select box', () => {
            render(<AppointmentForm />);
            expect(field('service')).not.toBeNull();
            expect(field('service').tagName).toEqual('SELECT');
        });

        it('initiatlly has a blank value chosen', () => {
            render(<AppointmentForm />);
            const firstNode = field('service').childNodes[0];
            expect(firstNode.value).toEqual('');
            expect(firstNode.selected).toBeTruthy();
        });

        it('lists all salon services', () => {
            const selectableServices = ['Cut', 'Blow-dry'];
            render(
                <AppointmentForm
                    selectableServices={selectableServices}
                />
            );

            const optionNodes = Array.from(
                field('service').childNodes
            );

            const renderedServices = optionNodes.map(
                node => node.textContent
            );

            expect(renderedServices).toEqual(
                expect.arrayContaining(selectableServices)
            );

        });

        it('pre-selects the existing value', () => {
            const services = ['Cut', 'Blow-dry'];
            render(
                <AppointmentForm
                    selectableServices={services}
                    service="Blow-dry"
                />
            );

            const option = findOption(field('service'), 'Blow-dry');

            expect(option.selected).toBeTruthy();
        });

        it('renders a label', () => {
            render(<AppointmentForm />);
            expect(labelFor('service')).not.toBeNull();
        });

        it('assigns a id that matches label id', () => {
            render(<AppointmentForm />);
            expect(field('service').id).toEqual('service');
        });

        it('saves existing value when submitted', async () => {
            expect.hasAssertions();

            render(
                <AppointmentForm
                    {...{ ['service']: 'Cut' }}
                    onSubmit={(props) =>
                        expect(props['service']).toEqual('Cut')}
                />
            );

            await ReactTestUtils.Simulate.submit(form('appointment'));
        });

        it('saves new value when submitted', async () => {
            expect.hasAssertions();

            render(
                <AppointmentForm
                    {...{ ['service']: 'Cut' }}
                    onSubmit={(props) =>
                        expect(props['service']).toEqual('Cut')}
                />
            );

            await ReactTestUtils.Simulate.change(field('service'), {
                target: { name: 'service', value: 'Cut' }
            });

            await ReactTestUtils.Simulate.submit(form('appointment'));

        });
    });

});

describe('time slot table', () => {
    let render, container;
    const timeSlotTable = () => container.querySelector('table#time-slots');

    beforeEach(() => {
        ({ render, container } = createContainer());
    });

    it('renders a table for time slots', () => {
        render(<AppointmentForm />);
        expect(
            timeSlotTable()
        ).not.toBeNull();
    });

    it('renders a time slot for every half an hour between open and close', () => {
        render(<AppointmentForm openAt={9} closeAt={11} />);
        const timesOfDay = timeSlotTable().querySelectorAll('tbody >* th');

        expect(timesOfDay).toHaveLength(4);
        expect(timesOfDay[0].textContent).toEqual('09:00');
        expect(timesOfDay[1].textContent).toEqual('09:30');
        expect(timesOfDay[3].textContent).toEqual('10:30');
    });

    it('renders an empty cell at the start of the header row', () => {
        render(<AppointmentForm />);
        const headerRow = timeSlotTable().querySelector('thead > tr');
        expect(headerRow.firstChild.textContent).toEqual('');
    });

    it('renders a week of available dates', () => {
        const today = new Date(2022, 1, 2);
        render(<AppointmentForm today={today} />);
        const dates = timeSlotTable().querySelectorAll('thead >* th:not(:first-child)');
        expect(dates).toHaveLength(7);
        expect(dates[0].textContent).toEqual('Wed 02');
        expect(dates[1].textContent).toEqual('Thu 03');
        expect(dates[6].textContent).toEqual('Tue 08');
    });

    it(('renders a radio button for each time slot'), () => {
        const today = new Date();
        const availableTimeSlots = [
            { startsAt: today.setHours(9, 0, 0, 0) },
            { startsAt: today.setHours(9, 30, 0, 0) }
        ];

        render(
            <AppointmentForm
                availableTimeSlots={availableTimeSlots}
                today={today}
            />
        );

        const cells = timeSlotTable().querySelectorAll('td');
        expect(cells[0].querySelector('input[type="radio"')).not.toBeNull();
        expect(cells[7].querySelector('input[type="radio"')).not.toBeNull();
    });

    it(('does not render radio buttons for unavailable time slots'), () => {
        render(<AppointmentForm availableTimeSlots={[]} />);
        const timesOfDay = timeSlotTable().querySelectorAll('input');
        expect(timesOfDay).toHaveLength(0);
    });
});