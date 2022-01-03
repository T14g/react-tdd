import React from "react";

const timeIncrements = (numTimes, startTime, increment) =>
    Array(numTimes)
        .fill([startTime])
        .reduce((acc, _, i) =>
            acc.concat([startTime + (i * increment)]));

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
    const totalSlots = (salonClosesAt - salonOpensAt) * 2;
    const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
    const increment = 30 * 60 * 1000;

    return timeIncrements(totalSlots, startTime, increment);
};

const weeklyDateValues = (startDate) => {
    const midnight = new Date(startDate).setHours(0, 0, 0, 0);
    const increment = 24 * 60 * 60 * 1000;
    return timeIncrements(7, midnight, increment);
};


const toTimeValue = timestamp =>
    new Date(timestamp).toTimeString().substring(0, 5);

const toShortDate = timestamp => {
    const [day, , dayOfMonth] = new Date(timestamp)
        .toDateString()
        .split(' ');
    return `${day} ${dayOfMonth}`;
};

const mergeDateAndTime = (date, timeSlot) => {
    const time = new Date(timeSlot);
    return new Date(date).setHours(
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds()
    );
};

export const TimeSlotTable = ({ openAt, closeAt, today, availableTimeSlots }) => {
    const dates = weeklyDateValues(today);
    const timeSlots = dailyTimeSlots(
        openAt,
        closeAt);

    return (
        <table id="time-slots">
            <thead>
                <tr>
                    <th />
                    {dates.map(d => (
                        <th key={d}>{toShortDate(d)}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {timeSlots.map(timeSlot => (
                    <tr key={timeSlot}>
                        <th>{toTimeValue(timeSlot)}</th>
                        {dates.map(date =>
                            <td key={date}>
                                {availableTimeSlots.some(availableTimeSlot =>
                                    availableTimeSlot.startsAt === mergeDateAndTime(date,
                                        timeSlot)
                                )
                                    ? <input type="radio" />
                                    : null
                                }
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );

};
