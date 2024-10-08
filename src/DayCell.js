import React, { useState } from 'react';

function DayCell({
    date,
    isWeekend,
    isHoliday,
    isWorkingDay,
    onWorkingDayToggle,
}) {
    const handleClick = () => {
        onWorkingDayToggle(date.toDateString());
    };

    let className = 'day-cell';
    if (isWeekend) {
        className += ' weekend';
    }
    if (isHoliday) {
        className += ' holiday';
    }
    if (isWorkingDay) {
        className += ' working-day';
    }

    return (
        <td className={className} onClick={handleClick}>
            {date.getDate()}
        </td>
    );
}

export default DayCell;