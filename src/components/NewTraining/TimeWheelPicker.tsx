// TimeWheelPicker.tsx
import React, { useRef, useEffect, useState } from "react";

interface TimeWheelPickerProps {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const ITEM_HEIGHT = 48; // px
const SNAP_TIMEOUT = 150; // ms

export const TimeWheelPicker: React.FC<TimeWheelPickerProps> = ({ items, selected, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 초기 렌더 시 scroll 위치 설정
  useEffect(() => {
    const index = items.indexOf(selected);
    if (index !== -1 && containerRef.current) {
      containerRef.current.scrollTop = index * ITEM_HEIGHT;
    }
  }, [selected, items]);

  // 스크롤 감지 및 debounce 처리
  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current) return;

      const scrollTop = containerRef.current.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
      const newValue = items[clampedIndex];

      containerRef.current.scrollTo({
        top: clampedIndex * ITEM_HEIGHT,
        behavior: "smooth",
      });

      onSelect(newValue);
    }, SNAP_TIMEOUT);
  };

  return (
    <div className="relative h-[144px] overflow-hidden w-[80px]">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      >
        <div className="py-[48px]">
          {items.map((item) => (
            <div
              key={item}
              onClick={() => {
                const index = items.indexOf(item);
                if (containerRef.current) {
                  containerRef.current.scrollTo({
                    top: index * ITEM_HEIGHT,
                    behavior: "smooth",
                  });
                }
                onSelect(item);
              }}
              className={`h-[48px] text-[30px] flex items-center justify-center text-2xl snap-start cursor-pointer transition-colors duration-200 ${
                item === selected ? "text-black font-bold" : "text-kuCoolGray"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* 구분선 */}
      <div className="pointer-events-none absolute top-1/2 left-0 w-full h-[48px] border-t border-b border-gray-300 -translate-y-1/2" />
    </div>
  );
};