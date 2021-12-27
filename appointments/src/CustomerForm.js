import React, { useState } from "react";

export const CustomerForm = ({ firstName, lastName, phone, onSubmit }) => {
    const [customer, setCustomer] = useState({ firstName: firstName, lastName: lastName, phone: phone });

    const handleChangeFirstName = ({ target }) => {
        setCustomer(customer => ({
            ...customer,
            firstName: target.value
        }));
    };

    const handleChangeLastName = ({ target }) => {
        setCustomer(customer => ({
            ...customer,
            lastName: target.value
        }));
    };

    const handleChangePhone = ({ target }) => {
        setCustomer(customer => ({
            ...customer,
            phone: target.value
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
                onChange={handleChangeFirstName}
                readOnly
            />
            <label htmlFor="lastName">Last Name</label>
            <input
                type="text"
                name="lastName"
                value={lastName}
                id="lastName"
                onChange={handleChangeLastName}
                readOnly
            />
            <label htmlFor="phone">Phone</label>
            <input
                type="text"
                name="phone"
                value={phone}
                id="phone"
                onChange={handleChangePhone}
                readOnly
            />
        </form>
    );
};