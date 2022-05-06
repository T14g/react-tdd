import React, { useEffect, useState } from 'react';

const CustomerRow = ({ customer }) => (
    <tr>
        <td>{customer.firstName}</td>
        <td>{customer.lastName}</td>
        <td>{customer.phoneNumber}</td>
        <td />
    </tr>
);

const SearchButtons = () => (
    <div className="button-bar">
        <button role="button" id="next-page">
            Next
        </button>
    </div>
);

export const CustomerSearch = () => {
    const [customers, setCustomers] = useState([]);

    //use the same useEffect ceremony that we've seen before, using an
    // inline function to ensure we don't return a value to useEffect, and passing an
    // empty array to ensure the effect only runs when the component is first mounted:
    useEffect(() => {

        const fetchData = async () => {
            const result = await window.fetch('/customers', {
                method: 'GET',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' }
            });

            setCustomers(await result.json());
        }

        fetchData();
    }, []);

    return (
        <React.Fragment>
            <SearchButtons />
            <table>
                <thead>
                    <tr>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Phone number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 && customers.map(customer => (
                        <CustomerRow customer={customer} key={customer.id} />
                    ))}
                </tbody>
            </table>
        </React.Fragment>
    );
};
