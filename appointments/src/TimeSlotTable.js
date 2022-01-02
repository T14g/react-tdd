import React from "react";

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
    const totalSlots = (salonClosesAt - salonOpensAt) * 2;
    const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
    const increment = 30 * 60 * 1000;
    return Array(totalSlots)
        .fill([startTime])
        .reduce((acc, _, i) =>
            acc.concat([startTime + (i * increment)])
        );
};

const toTimeValue = timestamp =>
    new Date(timestamp).toTimeString().substring(0, 5);

export const TimeSlotTable = ({ openAt, closeAt }) => {
    const timeSlots = dailyTimeSlots(
        openAt,
        closeAt);

    return (
        <table id="time-slots">
            <tbody>
                {timeSlots.map(timeSlot => (
                    <tr key={timeSlot}>
                        <th>{toTimeValue(timeSlot)}</th>
                    </tr>
                ))}
            </tbody>
        </table>
    );

};
