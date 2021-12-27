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

    const expectInputToBeOfTypeText = formEl => {
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

    it('renders a form', () => {
        render(<CustomerForm />);
        expect(
            form('customer')
        ).not.toBeNull();
    });

    describe('first name field', () => {
        itRendersAsATextBox('firstName');

        it('includes the existing value', () => {
            render(<CustomerForm firstName="John" />);
            expect(field('firstName').value).toEqual('John');
        });

        it('renders a label', () => {
            render(<CustomerForm />);
            expect(labelFor('firstName')).not.toBeNull();
            expect(labelFor('firstName').textContent).toEqual('First Name');
        });

        it('assigns an id that matches the label id', () => {
            render(<CustomerForm />);
            expect(field('firstName').id).toEqual('firstName');
        });

        it('saves the existing value when submitted', async () => {
            expect.hasAssertions();

            // This is a mix of Arrange and Assert, in this case render is the phase of Arrange
            // And Assert code is inside of onSubmit
            render(
                <CustomerForm
                    firstName="John"
                    onSubmit={({ firstName }) =>
                        expect(firstName).toEqual('John')
                    }
                />
            );
            await ReactTestUtils.Simulate.submit(form('customer'));
        });

        it('saves new value when submitted', async () => {
            expect.hasAssertions();
            render(
                <CustomerForm
                    firstName="John"
                    onSubmit={({ firstName }) =>
                        expect(firstName).toEqual('John')
                    }
                />
            );

            await ReactTestUtils.Simulate.change(field('firstName'), {
                target: { value: 'John' }
            });

            await ReactTestUtils.Simulate.submit(form('customer'));
        });
    });

    describe('last name field', () => {
        // ... tests ...
    });

    describe('phone number field', () => {
        // ... tests ...

    });

});