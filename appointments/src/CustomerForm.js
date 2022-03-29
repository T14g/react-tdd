import React, { useState } from "react";

const Error = () => (
    <div className="error">An error occurred during save.</div>
);

export const CustomerForm = ({ firstName, lastName, phone, onSave }) => {
    const [customer, setCustomer] = useState({ firstName: firstName, lastName: lastName, phone: phone });
    const [error, setError] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const required = (target) => {
        const fieldName = target.name;
        const value = target.value;

        let result = '';

        if(fieldName == 'firstName') {
            console.log("run");
            result = !value || value.trim() === '' ? 'First name is required' : undefined;
        }else if(fieldName == 'lastName'){
            result = !value || value.trim() === '' ? 'Last name is required' : undefined;
        }

        return result;
    }

    const handleBlur = ({ target }) => {
        const result =required(target);

        setValidationErrors({
            ...validationErrors,
            firstName: result
        });
    };

    const hasFirstNameError = () =>
        validationErrors.firstName !== undefined;

    const renderFirstNameError = () => {
        if (hasFirstNameError()) {
            return (
                <span className="error">
                    {validationErrors.firstName}
                </span>
            );
        }
    };

    const hasLastLastNameError = () =>
        validationErrors.lastName !== undefined;

    const renderLastNameError = () => {
        if (hasLastLastNameError()) {
            return (
                <span className="error">
                    {validationErrors.firstName}
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
            {renderFirstNameError()}
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
            {renderLastNameError()}
            <label htmlFor="phone">Phone</label>
            <input
                type="text"
                name="phone"
                value={phone}
                id="phone"
                onChange={handleChange}
                readOnly
            />
            <input type="submit" value="Add" />
        </form>
    );
};

CustomerForm.defaultProps = {
    onSave: () => { }
};