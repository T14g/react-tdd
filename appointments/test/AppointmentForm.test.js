import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulators';
import { requestBodyOf, fetchResponseOk } from './spyHelpers';
import { AppointmentForm } from '../src/AppointmentForm';
import 'whatwg-fetch';

const customer = { id: 123 };

describe('AppointmentForm', () => {
    let render, container, submit, form, labelFor;

    // antes de cada test define um container e os métodos auxiliares
    beforeEach(() => {
        ({ render, container, submit, form, labelFor } = createContainer());

        //cria um spy do fetch com retorno OK por default
        jest
            .spyOn(window, 'fetch')
            .mockReturnValue(fetchResponseOk({}));
    });

    // limpa tudo que foi mockado e narestaura o fetch original
    afterEach(() => {
        window.fetch.mockRestore();
    });

    const field = name => form('appointment').elements[name];

    // not toBeNull
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

        // Se não é nulo e se é um select
        it('renders as a select box', () => {
            render(<AppointmentForm />);
            expect(field('service')).not.toBeNull();
            expect(field('service').tagName).toEqual('SELECT');
        });

        // Em branco e selecionado truthy
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
                    {...{ ['service']: 'cut' }}
                    customer={customer}
                />
            );

            await submit(form('appointment'));

            await expect(requestBodyOf(window.fetch)).toMatchObject({
                ['service']: 'cut'
            }
            );


        });
    });

    it('passes the customer id to fetch when submitting', async () => {
        render(<AppointmentForm customer={customer} />);
        await submit(form('appointment'));
        expect(requestBodyOf(window.fetch)).toMatchObject({
            customer: customer.id
        });
    });
});

describe('time slot table', () => {
    let render, container, submit;
    const timeSlotTable = () => container.querySelector('table#time-slots');
    const startsAtField = index => container.querySelectorAll(`input[name="startsAt"]`)[index];
    const form = id => container.querySelector(`form[id="${id}"]`);

    beforeEach(() => {
        ({ render, container, submit } = createContainer());
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

    it(('sets radio button values to the index of the corresponding appointment'), () => {
        const today = new Date();
        const availableTimeSlots = [
            { startsAt: today.setHours(9, 0, 0, 0) },
            { startsAt: today.setHours(9, 30, 0, 0) }
        ];

        render(<AppointmentForm availableTimeSlots={availableTimeSlots} />);

        expect(startsAtField(0).value).toEqual(availableTimeSlots[0].startsAt.toString());
        expect(startsAtField(1).value).toEqual(availableTimeSlots[1].startsAt.toString());
    });

    it('pre-selects an available timeslot', () => {
        const today = new Date();

        const availableTimeSlots = [
            { startsAt: today.setHours(9, 0, 0, 0) },
            { startsAt: today.setHours(9, 30, 0, 0) }
        ];

        render(
            <AppointmentForm
                availableTimeSlots={availableTimeSlots}
                today={today}
                startsAt={availableTimeSlots[0].startsAt}
            />
        );

        expect(startsAtField(0).checked).toEqual(true);
    });

    it(('should save existing value when submitted'), async () => {
        expect.hasAssertions();

        const today = new Date();

        const availableTimeSlots = [
            { startsAt: today.setHours(9, 0, 0, 0) },
            { startsAt: today.setHours(9, 30, 0, 0) }
        ];

        render(
            <AppointmentForm
                availableTimeSlots={availableTimeSlots}
                today={today}
                customer={customer}
                startsAt={availableTimeSlots[0].startsAt}
            />
        );

        await submit(form('appointment'));
        expect(startsAtField(0).checked).toEqual(true);
    });

    it(('saves new value when submitted'), () => {
        expect.hasAssertions();

        const today = new Date();

        const availableTimeSlots = [
            { startsAt: today.setHours(9, 0, 0, 0) },
            { startsAt: today.setHours(9, 30, 0, 0) }
        ];

        render(
            <AppointmentForm
                availableTimeSlots={availableTimeSlots}
                today={today}
                onSubmit={({ startsAt }) =>
                    expect(startsAt).toEqual(availableTimeSlots[1].startsAt)
                }
            />
        );

        ReactTestUtils.Simulate.change(startsAtField(1), {
            target: {
                value: availableTimeSlots[1].startsAt.toString(),
                name: 'startsAt'
            }
        });

        ReactTestUtils.Simulate.submit(form('appointment'));

        expect(startsAtField(0).checked).toEqual(false);

    });
});