import React from "react";
import ReactTestUtils, { act } from 'react-dom/test-utils';
import { createContainer } from "./domManipulators";
import { CustomerForm } from '../src/CustomerForm';

describe('CustomerForm', () => {
    let render, container, fetchSpy;
    const originalFetch = window.fetch;

    const form = id => container.querySelector(`form[id="${id}"]`);
    const field = name => form('customer').elements[name];
    const labelFor = formEl => container.querySelector(`label[for="${formEl}"]`);

    const fetchRequestBody = () =>
        JSON.parse(fetchSpy.mock.calls[0][1].body);

    const spy = () => {
        let receivedArguments, returnValue;

        return {
            fn: (...args) => {
                receivedArguments = args;
                return returnValue;
            },
            receivedArguments: () => receivedArguments,
            receivedArgument: n => receivedArguments[n],
            mockReturnValue: value => returnValue = value
        };
    };

    const fetchResponseOk = body =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(body)
        });

    const fetchResponseError = () =>
        Promise.resolve({ ok: false });

    beforeEach(() => {
        ({ render, container } = createContainer());
        fetchSpy = jest.fn(() => fetchResponseOk({}))
        window.fetch = fetchSpy;
    });

    afterEach(() => {
        // reset window.fetch global variable
        window.fetch = originalFetch;
    });

    const expectInputToBeOfTypeText = (formEl) => {
        expect(formEl).not.toBeNull();
        expect(formEl.tagName).toEqual('INPUT');
        expect(formEl.type).toEqual('text')
    };

    const itRendersAsATextBox = (fieldName) => {
        it('renders as a text box', () => {
            render(<CustomerForm />);
            expectInputToBeOfTypeText(field(fieldName));
        });
    };

    const itIncludesTheExistingValue = (fieldName, value) => {
        it('includes the existing value', () => {
            render(<CustomerForm {...{ [fieldName]: value }} />);
            expect(field(fieldName).value).toEqual(value);
        });
    };

    const itRendersALabel = (fieldName, label) => {
        it('renders a label', () => {
            render(<CustomerForm />);
            expect(labelFor(fieldName)).not.toBeNull();
            expect(labelFor(fieldName).textContent).toEqual(label);
        });
    };

    const itAssignsAnIdThatMatchesLabelId = (fieldName, labelId) => {
        it('assigns an id that matches the label id', () => {
            render(<CustomerForm />);
            expect(field(fieldName).id).toEqual(labelId);
        });
    };

    // Thats is a test generator 
    const itSubmitsExistingValue = (fieldName, value) => {
        it('saves the existing value when submitted', async () => {

            render(
                <CustomerForm
                    {...{ [fieldName]: value }}
                />
            );
            ReactTestUtils.Simulate.submit(form('customer'));

            expect(fetchRequestBody()).toMatchObject({
                [fieldName] : value
            });
        });

    };

    const itSubmitsNewValue = (fieldName, value) => {
        it('saves new value when submitted', async () => {

            render(
                <CustomerForm
                    {...{ fieldName: value }}
                />
            );

            await ReactTestUtils.Simulate.change(field(fieldName), {
                target: { name: fieldName, value: value }
            });

            await ReactTestUtils.Simulate.submit(form('customer'));

            expect(fetchRequestBody()).toMatchObject({
                [fieldName] : value
            });
        });
    };

    it('renders a form', () => {
        render(<CustomerForm />);
        expect(
            form('customer')
        ).not.toBeNull();
    });

    describe('first name field', () => {
        itRendersAsATextBox('firstName');
        itIncludesTheExistingValue('firstName', 'John');
        itRendersALabel('firstName', 'First Name');
        itAssignsAnIdThatMatchesLabelId('firstName', 'firstName');
        itSubmitsExistingValue('firstName', 'John');
        itSubmitsNewValue('firstName', 'John');
    });

    describe('last name field', () => {
        itRendersAsATextBox('lastName');
        itIncludesTheExistingValue('lastName', 'Silva');
        itRendersALabel('lastName', 'Last Name');
        itAssignsAnIdThatMatchesLabelId('lastName', 'lastName');
        itSubmitsExistingValue('lastName', 'Silva');
        itSubmitsNewValue('lastName', 'Silva');
    });

    describe('phone number field', () => {
        itRendersAsATextBox('phone');
        itIncludesTheExistingValue('phone', '012345');
        itRendersALabel('phone', 'Phone');
        itAssignsAnIdThatMatchesLabelId('phone', 'phone');
        itSubmitsExistingValue('phone', '012345');
        itSubmitsNewValue('phone', '012345');
    });

    it('has a submit button', () => {
        render(<CustomerForm />);
        const submitButton = container.querySelector('input[type="submit"]');
        expect(submitButton).not.toBeNull();
    });

    it(('calls fetch with the right properties when submitting data'), async () => {
        render(
            <CustomerForm onSubmit={() => { }} />
        );

        ReactTestUtils.Simulate.submit(form('customer'));

        expect(fetchSpy).toHaveBeenCalledWith(
            '/customers',
            expect.objectContaining({
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' }
            }));
    });

    it('notifies onSave when form is submitted', async () => {
        const customer = { id: 123 };
        fetchSpy.mockReturnValue(fetchResponseOk(customer));
        const saveSpy = jest.fn();
        render(<CustomerForm onSave={saveSpy} />);
        await act(async () => {
            ReactTestUtils.Simulate.submit(form('customer'));
        });
        expect(saveSpy).toHaveBeenCalledWith(customer);
    });

    it('does not notify onSave if the POST request returns an error',
        async () => {
            fetchSpy.mockReturnValue(fetchResponseError());
            const saveSpy = jest.fn();
            render(<CustomerForm onSave={saveSpy} />);
            await act(async () => {
                ReactTestUtils.Simulate.submit(form('customer'));
            });
            expect(saveSpy).not.toHaveBeenCalled();
        });

    it('prevents the default action when submitting the form', async () => {
        const preventDefaultSpy = jest.fn();

        render(<CustomerForm />);
        await act(async () => {
            ReactTestUtils.Simulate.submit(form('customer'), {
                preventDefault: preventDefaultSpy
            });
        });
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it(('renders error message when fetch call fails'), async () => {
        fetchSpy.mockReturnValue(Promise.resolve({ ok: false }));

        render(<CustomerForm />);
        await act(async () => {
            ReactTestUtils.Simulate.submit(form('customer'));
        });

        const errorElement = container.querySelector('.error');
        expect(errorElement).not.toBeNull();
        expect(errorElement.textContent).toMatch('error occurred');
    });
});