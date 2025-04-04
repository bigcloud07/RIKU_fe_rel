import React, { useState } from "react";
import CalIcon from "../../assets/cal_icon.svg";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { AnimatePresence, motion } from "framer-motion";
import { ko } from "date-fns/locale";

interface DateInputProps {
    selectedDate: Date | null;
    onChange: (date: Date | null) => void;
}

export const DateInput: React.FC<DateInputProps> = ({ selectedDate, onChange }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const defaultClassNames = getDefaultClassNames();

    const formatDate = (date: Date | null) => {
        if (!date) return "";
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    return (
        <>
            <div className="my-2">날짜</div>
            <div className="flex items-center my-2">
                <img src={CalIcon} className="ml-[15px] w-5 h-5" />
                <input
                    type="text"
                    readOnly
                    value={formatDate(selectedDate)}
                    onClick={() => setIsCalendarOpen(true)}
                    placeholder="날짜를 선택하세요"
                    className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm w-full cursor-pointer"
                />
            </div>

            <AnimatePresence>
                {isCalendarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end justify-center"
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
                            <div className="flex justify-center">
                                <DayPicker
                                    mode="single"
                                    selected={selectedDate || undefined}
                                    onSelect={(date) => onChange(date ?? null)}
                                    locale={ko}
                                    className="mx-auto" // ✅ 전체 가운데 정렬
                                    classNames={{
                                        caption: "flex justify-center items-center gap-4 text-lg font-semibold text-black mb-4",
                                        nav: "flex items-center gap-4",
                                        chevron: "w-6 h-6 fill-black",
                                        head_row: "grid grid-cols-7",
                                        head_cell: "text-center text-gray-500 font-medium text-sm",
                                        row: "grid grid-cols-7",
                                        cell: "w-10 h-10 flex justify-center items-center text-sm text-gray-800 hover:bg-gray-100 rounded-full cursor-pointer",
                                        selected: "bg-kuDarkGreen text-white rounded-full",
                                        today: "text-kuDarkGreen font-bold",
                                        outside: "text-gray-300",
                                    }}
                                    formatters={{
                                        formatCaption: (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
                                    }}
                                />

                            </div>

                            <button
                                onClick={() => setIsCalendarOpen(false)}
                                className="mt-6 w-full bg-kuDarkGreen text-white text-base font-semibold py-3 rounded-md"
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
