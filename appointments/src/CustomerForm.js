import React, { useState } from "react";

const Error = () => (
    <div className="error">An error occurred during save.</div>
   );   

export const CustomerForm = ({ firstName, lastName, phone, onSave }) => {
    const [customer, setCustomer] = useState({ firstName: firstName, lastName: lastName, phone: phone });
    const [error, setError] = useState(false);

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
        }else{
            setError(true);
        }
    };

    return (
        <form id="customer" onSubmit={handleSubmit}>
            { error ? <Error /> : null }
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

CustomerForm.defaultProps = {
    onSave: () => { }
};