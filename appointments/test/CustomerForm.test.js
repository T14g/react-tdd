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

    const spy = () => {
        let receivedArguments, returnValue;

        return {
            fn: (...args) => {
                receivedArguments = args;
                return returnValue;
            },
            receivedArguments: () => receivedArguments,
            receivedArgument: n => receivedArguments[n],
            stubReturnValue: value => returnValue = value
        };
    };

    const fetchResponseOk = body =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(body)
        });

    expect.extend({
        toHaveBeenCalled(received) {
            if (received.receivedArguments() === undefined) {
                return {
                    pass: false,
                    message: () => 'Spy was not called.'
                }
            }
            return { pass: true, message: () => 'Spy was called.' };
        }
    });

    beforeEach(() => {
        ({ render, container } = createContainer());
        fetchSpy = spy();
        window.fetch = fetchSpy.fn;
        fetchSpy.stubReturnValue(fetchResponseOk({}));
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

            const fetchOpts = fetchSpy.receivedArgument(1);
            expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(value);
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

            const fetchOpts = fetchSpy.receivedArgument(1);
            expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(value);
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
        expect(fetchSpy).toHaveBeenCalled();
        expect(fetchSpy.receivedArgument(0)).toEqual('/customers');
        const fetchOpts = fetchSpy.receivedArgument(1);
        expect(fetchOpts.method).toEqual('POST');
        expect(fetchOpts.credentials).toEqual('same-origin');
        expect(fetchOpts.headers).toEqual({
            'Content-Type': 'application/json'
        });

    });

    it('notifies onSave when form is submitted', async () => {
        const customer = { id: 123 };
        fetchSpy.stubReturnValue(fetchResponseOk(customer));
        const saveSpy = spy();
        render(<CustomerForm onSave={saveSpy.fn} />);
        await act(async () => {
            ReactTestUtils.Simulate.submit(form('customer'));
        });
        expect(saveSpy).toHaveBeenCalled();
        expect(saveSpy.receivedArgument(0)).toEqual(customer);
    });

});