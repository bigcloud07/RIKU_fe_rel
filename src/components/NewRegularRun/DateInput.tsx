import React, { useState } from "react";
import CalIcon from "../../assets/cal_icon.svg";
import { DayPicker } from "react-day-picker";
import { AnimatePresence, motion } from "framer-motion";
import { ko } from "date-fns/locale";

// ko 로케일 확장 - 주 시작 요일을 일요일(0)로 설정
const customKo = {
  ...ko,
  options: {
    ...ko.options,
    weekStartsOn: 0,
  },
};

interface DateInputProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
}

export const DateInput: React.FC<DateInputProps> = ({ selectedDate, onChange }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 날짜를 "YYYY년 M월 D일" 형태로 포맷팅
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <>
      <div className="my-2 text-base font-medium">날짜</div>
      <div className="flex items-center my-2">
        <img
          src={CalIcon}
          alt="calendar icon"
          className="ml-[10px] w-[21.6px] h-[24px]"
        />
        <input
          type="text"
          readOnly
          value={formatDate(selectedDate)}
          onClick={() => setIsCalendarOpen(true)}
          placeholder="날짜를 선택하세요"
          className="ml-[24.4px] border-b border-gray-300 rounded px-4 py-2 text-base w-full cursor-pointer"
        />
      </div>

      <AnimatePresence>
        {isCalendarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="w-full max-w-md bg-white rounded-t-2xl px-4 pt-6 pb-8"
            >
              {/* 달력 영역 */}
              <div className="flex justify-center">
                <div className="w-fit mx-auto">
                  <DayPicker
                    locale={customKo}
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={(date) => onChange(date ?? null)}
                    showOutsideDays
                    classNames={{
                      months: "flex flex-col",
                      month: "p-3",
                      nav: "flex items-center justify-between mb-4",
                      nav_button_previous: "w-8 h-8 flex items-center justify-center",
                      nav_button_next: "w-8 h-8 flex items-center justify-center",
                      caption: "inline-flex items-center",
                      caption_label: "text-xl font-bold",
                      table: "table w-full border-collapse",
                      head_row: "table-row",
                      head_cell: "table-cell text-center p-2 font-semibold text-gray-600",
                      row: "table-row",
                      cell: "table-cell text-center p-2",
                      day: "inline-flex items-center justify-center w-10 h-10 rounded-full",
                      day_selected: "bg-kuDarkGreen text-white",
                      day_today: "text-kuDarkGreen font-extrabold",
                      day_outside: "text-gray-300",
                    }}
                    formatters={{
                      formatCaption: (date) =>
                        `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
                    }}
                  />
                </div>
              </div>

              {/* 적용하기 버튼 */}
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="mt-8 w-full bg-kuDarkGreen text-white text-lg font-semibold py-3 rounded-lg"
                disabled={!selectedDate}
              >
                적용하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
