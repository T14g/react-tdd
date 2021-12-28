import React from "react";
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from "./domManipulators";
import { CustomerForm } from '../src/CustomerForm';

describe('CustomerForm', () => {
    let render, container;

    const form = id => container.querySelector(`form[id="${id}"]`);
    const field = name => form('customer').elements[name];
    const labelFor = formEl => container.querySelector(`label[for="${formEl}"]`);

    beforeEach(() => {
        // This function is executed imediatly IIFE
        ({ render, container } = createContainer());
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

    const itSubmitsExistingValue = (fieldName, value) => {
        it('saves the existing value when submitted', async () => {
            expect.hasAssertions();

            // This is a mix of Arrange and Assert, in this case render is the phase of Arrange
            // And Assert code is inside of onSubmit
            render(
                <CustomerForm
                    {...{ [fieldName]: value }}
                    onSubmit={(props) =>
                        expect(props[fieldName]).toEqual(value)
                    }
                />
            );
            await ReactTestUtils.Simulate.submit(form('customer'));
        });

    };

    const itSubmitsNewValue = (fieldName, value) => {
        it('saves new value when submitted', async () => {
            expect.hasAssertions();
            render(
                <CustomerForm
                    {...{ fieldName: value }}
                    onSubmit={(props) =>
                        expect(props[fieldName]).toEqual(value)
                    }
                />
            );

            await ReactTestUtils.Simulate.change(field(fieldName), {
                target: { name: fieldName, value: value }
            });

            await ReactTestUtils.Simulate.submit(form('customer'));
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
});