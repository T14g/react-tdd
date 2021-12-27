import React, { useState } from "react";

export const CustomerForm = ({ firstName, lastName, onSubmit }) => {
    const [customer, setCustomer] = useState({ firstName: firstName, lastName: lastName });

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
        </form>
    );
};