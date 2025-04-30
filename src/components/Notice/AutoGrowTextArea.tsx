//자동으로 늘어나는 입력창 (공지 내용 입력할 때 사용할 거임)
import { forwardRef } from "react";

interface Props {
  placeholder?: string;
  maxHeight?: number;
}

//자동으로 적는 내용에 따라 높이가 늘어나는 textarea
const AutoGrowTextarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ placeholder = "", maxHeight = 300 }, ref) => {
    // 실제 부모에서 접근할 수 있도록 연결
    // useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    };

    return (
      <textarea
        ref={ref}
        onInput={handleInput}
        className={`w-full border overflow-hidden border-kuCoolGray rounded-xl px-3 py-3 mb-4 resize-none max-h-[${maxHeight}px] focus:outline-none focus:ring-2 focus:ring-kuDarkGreen`}
        placeholder={placeholder}
        rows={1}
      />
    );
  }
);

export default AutoGrowTextarea;
