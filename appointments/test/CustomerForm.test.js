import React from "react";
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from "./domManipulators";
import { CustomerForm } from '../src/CustomerForm';

describe('CustomerForm', () => {
    let render, container;

    const form = id => container.querySelector(`form[id="${id}"]`);
    const firstNameField = () => form('customer').elements.firstName;
    const labelFor = formEl => container.querySelector(`label[for="${formEl}"]`);

    beforeEach(() => {
        // This function is executed imediatly IIFE
        ({ render, container } = createContainer());
    });

    it('renders a form', () => {
        render(<CustomerForm />);
        expect(
            form('customer')
        ).not.toBeNull();
    });

    const expectInputToBeOfTypeText = formEl => {
        expect(formEl).not.toBeNull();
        expect(formEl.tagName).toEqual('INPUT');
        expect(formEl.type).toEqual('text')
    };

    it('renders the firt name field as a text box', () => {
        render(<CustomerForm />);
        expectInputToBeOfTypeText(firstNameField());
    });

    it('includes the existing value for the first name', () => {
        render(<CustomerForm firstName="John" />);
        expect(firstNameField().value).toEqual('John');
    });

    it('renders a label for the first name field', () => {
        render(<CustomerForm />);
        expect(labelFor('firstName')).not.toBeNull();
        expect(labelFor('firstName').textContent).toEqual('First Name');
    });

    it('assigns an id that matches the label id for the first name field', () => {
        render(<CustomerForm />);
        expect(firstNameField().id).toEqual('firstName');
    });

    it('saves the existing first name when submitted', async () => {
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
});