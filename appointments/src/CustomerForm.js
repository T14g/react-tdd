import React, { useState } from "react";

const Error = () => (
    <div className="error">An error occurred during save.</div>
);

export const CustomerForm = ({ firstName, lastName, phone, onSave }) => {
    const [customer, setCustomer] = useState({ firstName: firstName, lastName: lastName, phone: phone });
    const [error, setError] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const required = description => value =>
        !value || value.trim() === '' ? description : undefined;

    // High order , on the return of the first you call 2nd
    const handleBlur = ({ target }) => {
        const validators = {
            firstName: required('First name is required'),
            lastName: required('Last name is required'),
            phoneNumber: list(
                required('Phone number is required'),
                match(
                    /^[0-9+()\- ]*$/,
                    'Only numbers, spaces and these symbols are allowed: ( ) + -'
                )
            )

        };

        const result = validators[target.name](target.value);

        setValidationErrors({
            ...validationErrors,
            [target.name]: result
        });
    };

    const hasError = fieldName =>
        validationErrors[fieldName] !== undefined;

    const renderError = fieldName => {
        if (hasError(fieldName)) {
            return (
                <span className="error">
                    {validationErrors[fieldName]}
                </span>
            );
        }
    };

    const handleChange = ({ target }) => {
        setCustomer(customer => ({
            ...customer,
            [target.name]: target.value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const result = await window.fetch('/customers', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer)
        });

        if (result.ok) {
            const customerWithId = await result.json();
            onSave(customerWithId);
        } else {
            setError(true);
        }
    };

    const match = (re, description) => value => !value.match(re) ? description : undefined;

    const list = (...validators) => value =>
        validators.reduce(
            (result, validator) => result || validator(value),
            undefined
        );

    return (
        <form id="customer" onSubmit={handleSubmit}>
            {error ? <Error /> : null}
            <label htmlFor="firstName">First Name</label>
            <input
                type="text"
                name="firstName"
                value={firstName}
                id="firstName"
                onChange={handleChange}
                readOnly
                onBlur={handleBlur}
            />
            {renderError('firstName')}
            <label htmlFor="lastName">Last Name</label>
            <input
                type="text"
                name="lastName"
                value={lastName}
                id="lastName"
                onChange={handleChange}
                readOnly
                onBlur={handleBlur}
            />
            {renderError('lastName')}
            <label htmlFor="phone">Phone</label>
            <input
                type="text"
                name="phoneNumber"
                value={phone}
                id="phone"
                onChange={handleChange}
                onBlur={handleBlur}
                readOnly
            />
            {renderError('phoneNumber')}
            <input type="submit" value="Add" />
        </form>
    );
};

CustomerForm.defaultProps = {
    onSave: () => { }
};