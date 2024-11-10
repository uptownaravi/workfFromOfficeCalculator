import React, { useState, useMemo } from 'react';
import { Calendar, Percent } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const OfficeAttendanceTracker = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [message, setMessage] = useState('');
  
  const getWorkingDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    let workingDays = 0;
    
    for (let day = 1; day <= totalDays; day++) {
      const currentDate = new Date(year, month, day);
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        workingDays++;
      }
    }
    return workingDays;
  };

  const attendanceStats = useMemo(() => {
    const workingDays = getWorkingDaysInMonth(currentMonth);
    const attendancePercentage = (selectedDates.length / workingDays) * 100;
    const remainingDays = workingDays - selectedDates.length;
    
    return {
      workingDays,
      attendancePercentage: Math.round(attendancePercentage * 10) / 10,
      remainingDays
    };
  }, [selectedDates, currentMonth]);
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getDayName = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  const generateCalendarDays = () => {
    const days = [];
    const totalDays = getDaysInMonth(currentMonth);
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const startingDayOfWeek = firstDay.getDay();
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ isEmpty: true });
    }
    
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push({
        date: date,
        dayOfMonth: i,
        dayName: getDayName(date),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }
    return days;
  };

  const toggleDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + direction)));
    setSelectedDates([]); // Reset selections when changing months
  };

  const submitAttendance = async () => {
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dates: selectedDates,
          userId: 'user123',
          month: currentMonth.toISOString(),
          attendancePercentage: attendanceStats.attendancePercentage
        }),
      });

      if (response.ok) {
        setMessage('Attendance recorded successfully!');
      } else {
        throw new Error('Failed to record attendance');
      }
    } catch (error) {
      setMessage('Error recording attendance. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Office Attendance Tracker
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(-1)}
            >
              Previous
            </Button>
            <span className="font-bold">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(1)}
            >
              Next
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-green-600" />
              <span className="font-semibold">Attendance Progress</span>
            </div>
            <span className="font-bold text-green-600">{attendanceStats.attendancePercentage}%</span>
          </div>
          <Progress 
            value={attendanceStats.attendancePercentage} 
            className="h-2 bg-gray-200"
          />
          <div className="mt-2 text-sm text-gray-600 flex justify-between">
            <span>{selectedDates.length} days selected</span>
            <span>{attendanceStats.remainingDays} working days remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold p-2">
              {day}
            </div>
          ))}
          
          {generateCalendarDays().map((day, index) => {
            if (day.isEmpty) {
              return <div key={`empty-${index}`} className="p-2" />;
            }

            const isSelected = selectedDates.includes(day.date.toISOString().split('T')[0]);
            
            return (
              <Button
                key={day.date}
                variant="outline"
                className={`p-2 h-12 ${
                  day.isWeekend 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100' 
                    : isSelected 
                      ? 'bg-green-500 hover:bg-green-600 text-white border-green-600' 
                      : 'hover:bg-gray-50'
                }`}
                onClick={() => !day.isWeekend && toggleDate(day.date)}
                disabled={day.isWeekend}
              >
                {day.dayOfMonth}
              </Button>
            );
          })}
        </div>

        {message && (
          <Alert className="mt-4">
            <AlertTitle>Status</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Total working days: {attendanceStats.workingDays}
        </div>
        <Button 
          onClick={submitAttendance}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Submit Attendance
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OfficeAttendanceTracker;