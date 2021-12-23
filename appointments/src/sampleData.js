const today = new Date();

const at = hours => today.setHours(hours, 0);

export const sampleAppointments = [
    { startsAt: at(9), customer: { firstName: 'Charlie', lastName: 'Silva' } },
    { startsAt: at(10), customer: { firstName: 'Frankie', lastName: 'Silva' } },
    { startsAt: at(11), customer: { firstName: 'Casey', lastName: 'Silva' } },
    { startsAt: at(12), customer: { firstName: 'Ashley', lastName: 'Santos' } },
    { startsAt: at(13), customer: { firstName: 'Jordan', lastName: 'Santos' } },
    { startsAt: at(14), customer: { firstName: 'Jay', lastName: 'Santos' } },
    { startsAt: at(15), customer: { firstName: 'Alex', lastName: 'Santos' } },
    { startsAt: at(16), customer: { firstName: 'Jules', lastName: 'Santos' } },
    { startsAt: at(17), customer: { firstName: 'Stevie', lastName: 'test' } }
];