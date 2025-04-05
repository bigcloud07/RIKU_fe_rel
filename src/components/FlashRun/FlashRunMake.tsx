import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import customAxios from "../../apis/customAxios";
import BackIcon from "../../assets/BackBtn.svg";
import { DateInput } from "./DateInput";
import TimeIcon from "../../assets/time_icon.svg"
import { TimePickerBottomSheet } from "./TimePickerBottomSheet";


interface Pacer {
  id: number;
  name: string;
}

function FlashRunMake() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [dateTime, setDateTime] = useState<{ date: Date | null; time: string }>({ date: null, time: "00:00" });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [pacers, setPacers] = useState<Pacer[]>([]);
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);

  // useEffect(() => {
  //   const fetchPacers = async () => {
  //     try {
  //       const token = JSON.parse(localStorage.getItem("accessToken") || "null");
  //       const response = await customAxios.get("/pacers", {
  //         headers: { Authorization: `${token}` },
  //       });
  //       if (response.data.isSuccess) {
  //         // setPacers(response.data.result);
  //       }
  //     } catch (error) {
  //       console.error("페이서 목록을 가져오는 중 오류 발생:", error);
  //     }
  //   };
  //   fetchPacers();
  // }, []);

  const handlePostImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPostImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPostImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
    const selectedArray = Array.from(selectedFiles);
    if (attachments.length + selectedArray.length > 6) {
      alert("최대 6장까지만 업로드할 수 있습니다.");
      return;
    }
    selectedArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachmentPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    setAttachments((prev) => [...prev, ...selectedArray]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setAttachmentPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !location || !content || !dateTime.date || !postImage) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    try {
      const pad = (n: number) => n.toString().padStart(2, "0");
      const year = dateTime.date!.getFullYear();
      const month = pad(dateTime.date!.getMonth() + 1);
      const day = pad(dateTime.date!.getDate());
      const time = dateTime.time;
      const eventDateTime = `${year}-${month}-${day}T${time}:00`; // ✅ 로컬 기준

      const token = JSON.parse(localStorage.getItem("accessToken") || "null");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("date", eventDateTime);
      formData.append("content", content);
      formData.append("postImage", postImage);
      attachments.forEach((file) => formData.append("attachments", file));

      const response = await customAxios.post("/run/flash/post", formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.isSuccess) {
        alert("번개런이 성공적으로 생성되었습니다!");
        navigate("/flashRun");
      } else {
        alert(`요청 실패: ${response.data.responseMessage}`);
      }
    } catch (error) {
      console.error("번개런 생성 중 오류:", error);
      alert("번개런 생성 중 문제가 발생했습니다.");
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };



  // 시간 입력 관련 상태 및 핸들러
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const handleTimeChange = (time: string) => {
    setDateTime((prev) => ({ ...prev, time }));
  };



  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="flex items-center justify-center w-full h-[56px] px-5 mb-5 relative bg-kuDarkGreen">
        <div className="text-2xl font-semibold text-white text-center">번개런 만들기</div>
        <button onClick={() => navigate(-1)} className="absolute left-4">
          <img src={BackIcon} alt="뒤로가기" className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full max-w-md px-4">
        <div className="my-2">제목</div>
        <input
          className="border rounded-lg w-full p-2"
          placeholder="제목을 입력하세요"
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="my-2">집합 장소</div>
        <input
          className="border rounded-lg w-full p-2"
          placeholder="장소명을 입력하세요"
          onChange={(e) => setLocation(e.target.value)}
        />


        <DateInput
          selectedDate={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setDateTime((prev) => ({ ...prev, date }));
          }}
        />

        {/* <div className="my-2">시간</div>
        <div className="flex items-center my-2">
          <img src={TimeIcon} className="ml-[15px] w-5 h-5" />
          <input
            type="text"
            readOnly
            placeholder="시간을 선택하세요"
            value={dateTime.time}
            onClick={() => setIsTimePickerOpen(true)}
            className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm w-full cursor-pointer"
          />
        </div>
        <TimePickerBottomSheet
          isOpen={isTimePickerOpen}
          onClose={() => setIsTimePickerOpen(false)}
          onApply={(time) => setDateTime((prev) => ({ ...prev, time }))}
        /> */}
        <TimePickerBottomSheet time={dateTime.time} onChange={handleTimeChange} />


        <div className="mb-2 mt-4">세부사항</div>
        <textarea
          className="my-2 w-full p-2 border rounded-lg"
          rows={10}
          placeholder="세부사항을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 대표 이미지 업로드 */}
        <div className="my-4">
          <h2 className="mb-2">대표 이미지</h2>
          {postImagePreview ? (
            <div className="relative w-[104px] h-[104px]">
              <img src={postImagePreview} className="w-full h-full object-cover rounded-md" />
              <button
                onClick={() => {
                  setPostImage(null);
                  setPostImagePreview(null);
                }}
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <label
              htmlFor="postImageUpload"
              className="w-[104px] h-[104px] border border-dashed border-gray-400 flex items-center justify-center text-gray-500 cursor-pointer rounded-md"
            >
              +
            </label>
          )}
          <input type="file" id="postImageUpload" accept="image/*" onChange={handlePostImageUpload} className="hidden" />
        </div>

        {/* 첨부 이미지 업로드 */}
        <div className="my-4">
          <h2 className="mb-2">코스 사진 (최대 6장)</h2>
          <div className="grid grid-cols-3 gap-2">
            {attachmentPreviews.map((img, index) => (
              <div key={index} className="relative w-[104px] h-[104px]">
                <img src={img} className="w-full h-full object-cover rounded-md" />
                <button
                  onClick={() => handleRemoveAttachment(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
            {attachmentPreviews.length < 6 && (
              <label
                htmlFor="attachmentUpload"
                className="w-[104px] h-[104px] border border-dashed border-gray-400 flex items-center justify-center text-gray-500 cursor-pointer rounded-md"
              >
                +
              </label>
            )}
          </div>
          <input type="file" id="attachmentUpload" multiple accept="image/*" onChange={handleAttachmentUpload} className="hidden" />
        </div>

        <button onClick={handleSubmit} className="w-full bg-[#366943] text-white py-3 rounded-lg mt-4">
          만들기
        </button>
      </div>
    </div>
  );
}

export default FlashRunMake;
