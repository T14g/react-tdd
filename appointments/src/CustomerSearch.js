import React, { useEffect, useState, useCallback } from 'react';
const CustomerRow = ({ customer }) => (
    <tr>
        <td>{customer.firstName}</td>
        <td>{customer.lastName}</td>
        <td>{customer.phoneNumber}</td>
        <td />
    </tr>
);

const SearchButtons = ({ handleNext, handlePrevious }) => (
    <div className="button-bar">
        <button role="button" id="previous-page" onClick={handlePrevious}>
            Previous
        </button>
        <button role="button" id="next-page" onClick={handleNext}>
            Next
        </button>
    </div>
);

export const CustomerSearch = () => {
    const [customers, setCustomers] = useState([]);
    const [queryStrings, setQueryStrings] = useState([]);

    const handlePrevious = useCallback(() => setQueryStrings(queryStrings.slice(0, -1)));

    const handleNext = useCallback(() => {
        const after = customers[customers.length - 1].id;
        const queryString = `?after=${after}`;
        setQueryStrings([...queryStrings, queryString]);
    }, [customers, queryStrings]);

    //use the same useEffect ceremony that we've seen before, using an
    // inline function to ensure we don't return a value to useEffect, and passing an
    // empty array to ensure the effect only runs when the component is first mounted:
    useEffect(() => {

        const fetchData = async () => {
            let queryString = '';
            if (queryStrings.length > 0)
                queryString = queryStrings[queryStrings.length - 1];

            const result = await window.fetch(`/customers${queryString}`, {
                method: 'GET',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' }
            });

            setCustomers(await result.json());
        }

        fetchData();
    }, [queryStrings]);

    return (
        <React.Fragment>
            <SearchButtons handleNext={handleNext} handlePrevious={handlePrevious} />

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
