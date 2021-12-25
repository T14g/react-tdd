import React from "react";
import { createContainer } from "./domManipulators";
import { CustomerForm } from '../src/CustomerForm';

describe('CustomerForm', () => {
    let render, container;

    const form = id => container.querySelector(`form[id="${id}"]`);
    const firstNameField = () => form('customer').elements.firstName;

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
});