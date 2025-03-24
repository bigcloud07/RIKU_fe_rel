import React, { useState, ChangeEventHandler } from "react";
import { setHours, setMinutes } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateNtimeProps {
  onDateTimeChange: (date: Date | null, time: string) => void;
}

export function DateNtime({ onDateTimeChange }: DateNtimeProps) {
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const [timeValue, setTimeValue] = useState<string>("00:00");

  const handleTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    setTimeValue(time);

    if (selected) {
      const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
      const newSelectedDate = setHours(setMinutes(selected, minutes), hours);
      setSelected(newSelectedDate);
      onDateTimeChange(newSelectedDate, time);
    } else {
      onDateTimeChange(null, time);
    }
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) {
      setSelected(undefined);
      onDateTimeChange(null, timeValue);
      return;
    }

    const [hours, minutes] = timeValue.split(":").map((str) => parseInt(str, 10));
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
    setSelected(newDate);
    onDateTimeChange(newDate, timeValue);
  };

  return (
    <div className="my-2 max-w-[375px] mx-auto bg-white p-4 rounded-lg border-solid">
      <div className="mb-4">
        <input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#366943]"
        />
      </div>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleDaySelect}
        footer={
          <p className="mt-4 text-center text-b font-medium">
            {selected ? selected.toLocaleString() : "날짜를 선택해주세요"}
          </p>
        }
        styles={{
          day: { color: "#366943", fontWeight: "bold" },
          day_selected: { backgroundColor: "#366943", color: "white" },
        }}
      />
    </div>
  );
}
