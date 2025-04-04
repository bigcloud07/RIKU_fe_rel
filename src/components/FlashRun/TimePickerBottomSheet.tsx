// TimePickerBottomSheet.tsx
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TimeWheelPicker } from "./TimeWheelPicker";

interface TimePickerBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (time: string) => void;
}

export const TimePickerBottomSheet: React.FC<TimePickerBottomSheetProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [hour, setHour] = useState("18");
  const [minute, setMinute] = useState("00");

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="w-full max-w-sm bg-white rounded-t-2xl px-4 pt-6 pb-4 mx-auto"
          >
            <div className="text-lg font-semibold text-center mb-4">시간 선택</div>

            <div className="flex justify-center gap-4">
              <TimeWheelPicker items={hours} selected={hour} onSelect={setHour} />
              <div className="text-3xl font-bold flex items-center">:</div>
              <TimeWheelPicker items={minutes} selected={minute} onSelect={setMinute} />
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  onApply(`${hour}:${minute}`);
                  onClose();
                }}
                className="w-full bg-kuDarkGreen text-white py-3 rounded-lg text-lg"
              >
                적용하기
              </button>
              {/* <button
                onClick={onClose}
                className="w-full text-gray-500 text-sm"
              >
                닫기
              </button> */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};