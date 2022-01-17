import React, { useState } from "react";

export const CustomerForm = ({ firstName, lastName, phone }) => {
    const [customer, setCustomer] = useState({ firstName: firstName, lastName: lastName, phone: phone });

    const handleChange = ({ target }) => {
        setCustomer(customer => ({
            ...customer,
            [target.name]: target.value
        }));
    };

    const handleSubmit = () => {
        window.fetch('/customers', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer)
        });
    };

    return (
        <form id="customer" onSubmit={handleSubmit}>
            <label htmlFor="firstName">First Name</label>
            <input
                type="text"
                name="firstName"
                value={firstName}
                id="firstName"
                onChange={handleChange}
                readOnly
            />
            <label htmlFor="lastName">Last Name</label>
            <input
                type="text"
                name="lastName"
                value={lastName}
                id="lastName"
                onChange={handleChange}
                readOnly
            />
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