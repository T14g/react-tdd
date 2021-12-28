import React, { useState } from "react";

export const CustomerForm = ({ firstName, lastName, phone, onSubmit }) => {
    const [customer, setCustomer] = useState({ firstName: firstName, lastName: lastName, phone: phone });

    const handleChange = ({ target }) => {
        setCustomer(customer => ({
            ...customer,
            [target.name]: target.value
        }));
    };

    return (
        <form id="customer" onSubmit={() => onSubmit(customer)}>
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
        </form>
    );
};