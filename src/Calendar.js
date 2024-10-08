import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import './Calendar.css';

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [holidays, setHolidays] = useState([]);
    const [workingDays, setWorkingDays] = useState([]);

    const handlePrevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };

    const handleNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    const handleHolidayChange = (newHolidays) => {
        setHolidays(newHolidays);
    };

    const handleWorkingDayToggle = (day) => {
        if (workingDays.includes(day)) {
            setWorkingDays(workingDays.filter((d) => d !== day));
        } else {
            setWorkingDays([...workingDays, day]);
        }
    };

    // Calculate percentage of working days
    const calculateWorkingDaysPercentage = () => {
        const totalWeekdays = getWeekdaysInMonth(currentDate);
        const numWorkingDays = workingDays.filter((day) => {
            const date = new Date(day);
            return isWeekday(date) && !isHoliday(date);
        }).length;
        const calculation = `(${numWorkingDays} / ${totalWeekdays}) * 100`;
        const percentage = (numWorkingDays / totalWeekdays) * 100;
        return { percentage: percentage.toFixed(2), calculation };
    };

    // Helper functions to check if a day is a weekday or holiday
    const isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    const isHoliday = (date) => {
        return holidays.some(
            (holiday) =>
                holiday.getDate() === date.getDate() &&
                holiday.getMonth() === date.getMonth() &&
                holiday.getFullYear() === date.getFullYear()
        );
    };

    // Helper function to get the total number of weekdays in a month
    const getWeekdaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        let weekdays = 0;
        for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
            const currentDate = new Date(year, month, day);
            if (isWeekday(currentDate)) {
                weekdays++;
            }
        }
        return weekdays;
    };

    return (
        <div className="calendar">
            <CalendarHeader
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
            />
            <CalendarGrid
                currentDate={currentDate}
                holidays={holidays}
                workingDays={workingDays}
                onHolidayChange={handleHolidayChange}
                onWorkingDayToggle={handleWorkingDayToggle}
            />
            <div className="working-days-percentage">
                <br />
                <br />
                {/* Display calculation breakdown */}
                Calculation: {calculateWorkingDaysPercentage().calculation}
                <br />
                <br />
                Working Days Percentage: {calculateWorkingDaysPercentage().percentage}%
                <br />
            </div>
        </div>
    );
}

export default Calendar;