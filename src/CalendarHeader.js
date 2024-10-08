import React from 'react';

function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }) {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    return (
        <div className="calendar-header">
            <button onClick={onPrevMonth}>Previous</button>
            <h2>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={onNextMonth}>Next</button>
        </div>
    );
}

export default CalendarHeader;