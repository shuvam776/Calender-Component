"use client"
import React, { useState } from 'react'
import Note from './Note'
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Calender() {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [currentDay, setCurrentDay] = useState(currentDate.getDate());

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    }

    const clickedDate = (date: number) => {
        setCurrentDate(new Date(currentYear, currentMonth, date));
        setCurrentDay(date);
    }

    let startDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const prevMonthDays = Array.from({ length: startDayOfWeek }, (_, i) => daysInPrevMonth - startDayOfWeek + 1 + i);

    const daysInCurrMonth = getDaysInMonth(currentYear, currentMonth);
    const currentMonthDays = Array.from({ length: daysInCurrMonth }, (_, i) => i + 1);

    const totalSlots = startDayOfWeek + daysInCurrMonth;
    const nextDaysCount = (7 - (totalSlots % 7)) % 7;
    const nextMonthDays = Array.from({ length: nextDaysCount }, (_, i) => i + 1);

    const prevMonthAction = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonthAction = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return (

        <div className="flex items-center justify-center p-4 min-h-screen w-full bg-white">
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="absolute top-0 left-0 w-full flex justify-between px-10 -mt-3.5 z-50 pointer-events-none">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="w-2 h-7 bg-gradient-to-b from-gray-400 via-gray-100 to-gray-500 rounded-full border border-gray-400 shadow-[1px_1px_2px_rgba(0,0,0,0.2)]" />
                        </div>
                    ))}
                </div>
             {/* fixing of the spiral strings and the image */}
                <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                    <img
                        src="https://images.unsplash.com/photo-1511497584788-876760111969"
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-x-0 bottom-0 bg-green-700/80 backdrop-blur-[2px]"
                        style={{
                            height: '50%',
                            clipPath: 'polygon(0 50%, 45% 95%, 100% 10%, 100% 100%, 0 100%)',
                        }}
                    ></div>
                </div>

                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">

                    <div className="md:col-span-2">

                        <div className="flex justify-between items-center mb-3">
                            <button
                                onClick={prevMonthAction}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-800 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                {months[currentMonth]} <span className="text-green-700">{currentYear}</span>
                            </div>

                            <button
                                onClick={nextMonthAction}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-800 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex justify-between items-center mb-2 text-[11px]">
                            <div className="text-gray-500">
                                Today:
                                <span className="ml-1 font-semibold text-gray-800">
                                    {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>

                            <div className="text-gray-500">
                                Selected:
                                <span className="ml-1 font-semibold text-green-700">
                                    {currentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                            {days.map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-y-3 gap-x-2">

                            {prevMonthDays.map((d, i) => (
                                <div key={i} className="text-gray-400 font-medium text-center py-2 text-sm">{d}</div>
                            ))}

                            {currentMonthDays.map((d) => {
                                const isSelected =
                                    currentDay === d &&
                                    currentMonth === currentDate.getMonth() &&
                                    currentYear === currentDate.getFullYear();

                                const isWeekend = (startDayOfWeek + d - 1) % 7 >= 5;
                                
                                let hasNote = false;
                                if (typeof window !== 'undefined') {
                                    const savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
                                    const dateKey = new Date(currentYear, currentMonth, d).toDateString();
                                    hasNote = !!savedNotes[dateKey];
                                }

                                return (
                                    <div
                                        key={d}
                                        onClick={() => clickedDate(d)}
                                        className={`h-10 flex flex-col items-center justify-center rounded-lg cursor-pointer text-sm font-semibold transition-all relative
                                            ${isSelected
                                                ? "bg-green-700 text-white shadow-md transform scale-105 hover:bg-green-800"
                                                : "text-gray-800 hover:bg-green-100"
                                            }
                                            ${isWeekend && !isSelected ? "text-green-700" : ""}
                                        `}
                                    >
                                        <span>{d}</span>
                                        {hasNote && (
                                            <div className={`w-1 h-1 rounded-full absolute bottom-1.5 ${isSelected ? "bg-white" : "bg-green-600"}`} />
                                        )}
                                    </div>
                                )
                            })}

                            {nextMonthDays.map((d, i) => (
                                <div key={i} className="text-gray-400 font-medium text-center py-2 text-sm">{d}</div>
                            ))}

                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <Note selectedDate={currentDate} />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Calender