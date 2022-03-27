import React from "react";
import { createContainer, withEvent } from "./domManipulators";
import { CustomerForm } from '../src/CustomerForm';
import { fetchResponseOk, fetchResponseError, requestBodyOf } from './spyHelpers';
import 'whatwg-fetch';

describe('CustomerForm', () => {
    let render, form, field, labelFor, element, change, submit, blur;

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

    beforeEach(() => {
        ({ render, form, field, labelFor, element, change, submit, blur } = createContainer());
        jest
            .spyOn(window, 'fetch')
            .mockReturnValue(fetchResponseOk({}));
    });

    afterEach(() => {
        window.fetch.mockRestore();
    });

    const expectInputToBeOfTypeText = (formEl) => {
        expect(formEl).not.toBeNull();
        expect(formEl.tagName).toEqual('INPUT');
        expect(formEl.type).toEqual('text')
    };

    const itRendersAsATextBox = (fieldName) => {
        it('renders as a text box', () => {
            render(<CustomerForm />);
            expectInputToBeOfTypeText(field('customer', fieldName));
        });
    };

    const itIncludesTheExistingValue = (fieldName, value) => {
        it('includes the existing value', () => {
            render(<CustomerForm {...{ [fieldName]: value }} />);
            expect(field('customer', fieldName).value).toEqual(value);
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
            expect(field('customer', fieldName).id).toEqual(labelId);
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
            submit(form('customer'));

            expect(requestBodyOf(window.fetch)).toMatchObject({
                [fieldName]: value
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

            await change(field('customer', fieldName), {
                target: { name: fieldName, value: value }
            });

            await submit(form('customer'));

            expect(requestBodyOf(window.fetch)).toMatchObject({
                [fieldName]: value
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
        const submitButton = element('input[type="submit"]');
        expect(submitButton).not.toBeNull();
    });

    it(('calls fetch with the right properties when submitting data'), async () => {
        render(
            <CustomerForm onSubmit={() => { }} />
        );

        submit(form('customer'));

        expect(window.fetch).toHaveBeenCalledWith(
            '/customers',
            expect.objectContaining({
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' }
            }));
    });

    it('notifies onSave when form is submitted', async () => {
        const customer = { id: 123 };
        window.fetch.mockReturnValue(fetchResponseOk(customer));
        const saveSpy = jest.fn();
        render(<CustomerForm onSave={saveSpy} />);
        await submit(form('customer'));

        expect(saveSpy).toHaveBeenCalledWith(customer);
    });

    it('does not notify onSave if the POST request returns an error',
        () => {
            window.fetch.mockReturnValue(fetchResponseError());
            const saveSpy = jest.fn();
            render(<CustomerForm onSave={saveSpy} />);

            submit(form('customer'));

            expect(saveSpy).not.toHaveBeenCalled();
        });

    it('prevents the default action when submitting the form', () => {
        const preventDefaultSpy = jest.fn();

        render(<CustomerForm />);
        submit(form('customer'), {
            preventDefault: preventDefaultSpy
        });

        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it(('renders error message when fetch call fails'), async () => {
        window.fetch.mockReturnValue(Promise.resolve({ ok: false }));

        render(<CustomerForm />);

        await submit(form('customer'));

        const errorElement = element('.error');
        expect(errorElement).not.toBeNull();
        expect(errorElement.textContent).toMatch('error occurred');
    });

    it('displays error after blur when first name field is blank', () => {
        render(<CustomerForm />);

        blur(
            field('customer', 'firstName'),
            withEvent('firstName', ' ')
        );

        expect(element('.error')).not.toBeNull();
        expect(element('.error').textContent).toMatch(
            'First name is required'
        );
    });

    it('displays error after blur when last name field is blank', () => {
        render(<CustomerForm />);

        blur(
            field('customer', 'lastName'),
            withEvent('lastName', ' ')
        );
        
        expect(element('.error')).not.toBeNull();
        expect(element('.error').textContent).toMatch(
            'Last name is required'
        );
    });

});