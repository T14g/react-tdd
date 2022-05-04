import React, { useEffect } from 'react';

export const CustomerSearch = () => {
    //use the same useEffect ceremony that we've seen before, using an
    // inline function to ensure we don't return a value to useEffect, and passing an
    // empty array to ensure the effect only runs when the component is first mounted:

    useEffect(() => {
        const fetchData = () =>
            window.fetch('/customers', {
                method: 'GET',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' }
            });
        fetchData();
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Phone number</th>
                    <th>Actions</th>
                </tr>
            </thead>
        </table>
    );
};
