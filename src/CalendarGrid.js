import React from 'react';
import DayCell from './DayCell';

function CalendarGrid({
    currentDate,
    holidays,
    workingDays,
    onHolidayChange,
    onWorkingDayToggle,
}) {
    const firstDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();
    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(<td key={`empty-${i}`}></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        days.push(
            <DayCell
                key={day}
                date={date}
                isWeekend={date.getDay() === 0 || date.getDay() === 6}
                isHoliday={holidays.some(
                    (holiday) =>
                        holiday.getDate() === date.getDate() &&
                        holiday.getMonth() === date.getMonth() &&
                        holiday.getFullYear() === date.getFullYear()
                )}
                isWorkingDay={workingDays.includes(date.toDateString())}
                onHolidayChange={onHolidayChange}
                onWorkingDayToggle={onWorkingDayToggle}
            />
        );
    }

    return (
        <table className="calendar-grid">
            <tbody>
                {[...Array(Math.ceil(days.length / 7))].map((_, i) => (
                    <tr key={i}>{days.slice(i * 7, i * 7 + 7)}</tr>
                ))}
            </tbody>
        </table>
    );
}

export default CalendarGrid;