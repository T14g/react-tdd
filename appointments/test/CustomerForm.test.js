import React from "react";
import { createContainer, withEvent } from "./domManipulators";
import { CustomerForm } from '../src/CustomerForm';
import { fetchResponseOk, fetchResponseError, requestBodyOf } from './spyHelpers';
import 'whatwg-fetch';

const validCustomer = {
    firstName: 'first',
    lastName: 'last',
    phoneNumber: '123456789'
};

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
                    {...validCustomer}
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
                    {...validCustomer}
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
        itRendersAsATextBox('phoneNumber');
        itIncludesTheExistingValue('phoneNumber', '012345');
        itRendersALabel('phoneNumber', 'Phone');
        itAssignsAnIdThatMatchesLabelId('phoneNumber', 'phoneNumber');
        itSubmitsExistingValue('phoneNumber', '012345');
        itSubmitsNewValue('phoneNumber', '012345');
    });

    it('has a submit button', () => {
        render(<CustomerForm />);
        const submitButton = element('input[type="submit"]');
        expect(submitButton).not.toBeNull();
    });

    it(('calls fetch with the right properties when submitting data'), async () => {
        render(
            <CustomerForm onSubmit={() => { }}  {...validCustomer} />
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
        render(<CustomerForm onSave={saveSpy}  {...validCustomer} />);
        await submit(form('customer'));

        expect(saveSpy).toHaveBeenCalledWith(customer);
    });

    it('does not notify onSave if the POST request returns an error',
        () => {
            window.fetch.mockReturnValue(fetchResponseError());
            const saveSpy = jest.fn();
            render(<CustomerForm onSave={saveSpy}  {...validCustomer} />);

            submit(form('customer'));

            expect(saveSpy).not.toHaveBeenCalled();
        });

    it('renders field validation errors from server', async () => {
        const errors = {
            phoneNumber: 'Phone number already exists in the system'
        };
        window.fetch.mockReturnValue(
            fetchResponseError(422, { errors })
        );
        render(<CustomerForm {...validCustomer} />);
        await submit(form('customer'));
        expect(element('.error').textContent).toMatch(
            errors.phoneNumber
        );
    });

    it('prevents the default action when submitting the form', () => {
        const preventDefaultSpy = jest.fn();

        render(<CustomerForm  {...validCustomer} />);
        submit(form('customer'), {
            preventDefault: preventDefaultSpy
        });

        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it(('renders error message when fetch call fails'), async () => {
        window.fetch.mockReturnValue(Promise.resolve({ ok: false }));

        render(<CustomerForm  {...validCustomer} />);

        await submit(form('customer'));

        const errorElement = element('.error');
        expect(errorElement).not.toBeNull();
        expect(errorElement.textContent).toMatch('error occurred');
    });

    const itInvalidatesFieldWithValue = (
        fieldName,
        value,
        description
    ) => {
        it(`displays error after blur when ${fieldName} field is
           '${value}'`, () => {
            render(<CustomerForm  {...validCustomer} />);
            blur(
                field('customer', fieldName),
                withEvent(fieldName, value)
            );
            expect(element('.error')).not.toBeNull();
            expect(element('.error').textContent).toMatch(
                description
            );
        });
    }

    itInvalidatesFieldWithValue(
        'firstName', ' ', 'First name is required'
    );

    itInvalidatesFieldWithValue(
        'lastName', ' ', 'Last name is required'
    );

    itInvalidatesFieldWithValue(
        'phoneNumber', ' ', 'Phone number is required'
    );

    itInvalidatesFieldWithValue(
        'phoneNumber',
        'invalid',
        'Only numbers, spaces and these symbols are allowed: ( ) + -'
    );

    it('accepts standard phone number characters when validating', () => {
        render(<CustomerForm  {...validCustomer} />);
        blur(
            element("[name='phoneNumber']"),
            withEvent('phoneNumber', '0123456789+()- ')
        );
        expect(element('.error')).toBeNull();
    });

    it('does not submit the form when there are validation errors', async () => {
        render(<CustomerForm />);
        await submit(form('customer'));
        expect(window.fetch).not.toHaveBeenCalled();
    });

    it('renders validation errors after submission fails', async () => {
        render(<CustomerForm />);
        await submit(form('customer'));
        expect(window.fetch).not.toHaveBeenCalled();
        expect(element('.error')).not.toBeNull();
    });
}); 