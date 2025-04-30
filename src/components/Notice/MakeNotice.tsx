//공지사항 작성하는 페이지
import React, { useRef, useState } from "react";
import ActionBarDetail from "../ActionBarDetail";
import AutoGrowTextarea from "./AutoGrowTextArea";

//공지에 들어가는 요소
interface Notice {
  title: string;
  detail: string;
  images?: (string | File)[];
}

const MakeNotice = () => {
  const titleRef = useRef<HTMLInputElement>(null); //공지의 '제목' 관련 ref
  const detailRef = useRef<HTMLTextAreaElement>(null); //공지의 '내용' 관련 ref
  const [images, setImages] = useState<(File | string)[]>([]); //이미지 관련 state

  const handleImageUpload = () => {
    alert("열심히 기능 준비중임!");
  };

  return (
    <div className="h-screen flex flex-col">
      <ActionBarDetail barName="공지사항" isOptionBtnNeeded={false} />
      <div className="flex flex-col w-full pt-6 px-7 bg-kuWhite flex-1">
        {/* 상단에 '공지사항 글쓰기' 제목 있는 곳 */}
        <div className="flex justify-between w-full text-left mb-6">
          <span className="text-2xl font-normal">공지사항 글쓰기</span>
        </div>
        <div className="flex flex-col text-left w-full gap-3 mb-3">
          <span className="text-xl text-kuBlack pl-1">제목</span>
          <input
            className="w-full border border-kuCoolGray rounded-xl px-3 py-3 mb-4 focus: outline-kuDarkGreen"
            ref={titleRef}
            placeholder="제목"
          />
        </div>
        <div className="flex flex-col text-left w-full gap-3 mb-3">
          <span className="text-xl text-kuBlack pl-1">내용</span>
          <AutoGrowTextarea ref={detailRef} placeholder="공지 내용" maxHeight={300} />
        </div>
        <div className="flex flex-col text-left w-full gap-3">
          <span className="text-xl text-kuBlack pl-1">사진 첨부</span>
          <button
            className={`w-full py-3 bg-kuDarkGreen hover:bg-kuGreen text-white font-bold rounded-2xl transition-colors`}
            onClick={handleImageUpload}
          >
            사진 업로드
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeNotice;
