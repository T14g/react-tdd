import ReactDOM from "react-dom";
import ReactTestUtils, { act } from 'react-dom/test-utils';

export const withEvent = (name, value) => ({
    target: { name, value }
});

// Cria um container em uma div
// Possui métodos para encontrar forms, fiels e labels
// Possui métodos para achar elementos separados ou grupos de elementos
// Possui Simuladores de evento async e sync
// Possui render async e sync
export const createContainer = () => {
    const container = document.createElement('div');

    const form = id => container.querySelector(`form[id="${id}"]`);
    const field = (formId, name) => form(formId).elements[name];
    const labelFor = formEl => container.querySelector(`label[for="${formEl}"]`);

    const element = selector =>
        container.querySelector(selector);

    const elements = selector =>
        Array.from(container.querySelectorAll(selector));

    const simulateEvent = eventName => (element, eventData) =>
        ReactTestUtils.Simulate[eventName](element, eventData);

    const simulateEventAndWait = eventName => async (
        element,
        eventData
    ) =>
        await act(async () =>
            ReactTestUtils.Simulate[eventName](element, eventData)
        );

    return {
        render: component => act(() => {
            ReactDOM.render(component, container)
        }),
        renderAndWait: async component =>
            await act(async () => ReactDOM.render(component, container)),
        container,
        form,
        field,
        labelFor,
        element,
        elements,
        click: simulateEvent('click'),
        change: simulateEvent('change'),
        submit: simulateEventAndWait('submit'),
        blur: simulateEvent('blur'),
        clickAndWait: simulateEventAndWait('click')
    };
};