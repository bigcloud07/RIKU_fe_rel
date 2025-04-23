// ✅ FlashRunEdit.tsx - 번개런 수정 페이지
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import customAxios from "../../apis/customAxios";
import BackIcon from "../../assets/BackBtn.svg";
import { DateInput } from "./DateInput";
import { TimePickerBottomSheet } from "./TimePickerBottomSheet";

function NewFlashRunEdit() {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [dateTime, setDateTime] = useState<{ date: Date | null; time: string }>({ date: null, time: "00:00" });
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const res = await customAxios.get(`/run/flash/post/${postId}`, {
        headers: { Authorization: `${token}` },
      });
      if (res.data.isSuccess) {
        const result = res.data.result;
        setTitle(result.title);
        setLocation(result.location);
        setContent(result.content);
        setPostImagePreview(result.postImageUrl);
        setAttachmentPreviews(result.attachmentUrls || []);
        const utcDate = new Date(result.date); // 서버에서 받은 UTC 날짜
        const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // 9시간 더해 KST로 변환

        setDateTime({
          date: kstDate,
          time: kstDate.toTimeString().slice(0, 5), // KST 기준 시간 추출
        });
        console.log(result)
        console.log(token)
      }
    };
    fetchPost();
  }, [postId]);

  const handlePostImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPostImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPostImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    const selectedArray = Array.from(selectedFiles);
    if (attachments.length + selectedArray.length > 6) {
      alert("최대 6장까지만 업로드할 수 있습니다.");
      return;
    }
    selectedArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setAttachmentPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    setAttachments((prev) => [...prev, ...selectedArray]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setAttachmentPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTimeChange = (time: string) => {
    setDateTime((prev) => ({ ...prev, time }));
  };

  const handleSubmit = async () => {
    if (!title && !location && !content && !dateTime.date && !postImage && attachments.length === 0) {
      alert("수정할 내용을 하나 이상 입력해주세요.");
      return;
    }
  
    try {
      const [hours, minutes] = dateTime.time.split(":").map(Number);
      const selected = dateTime.date!;

      // ✅ 1. KST 기준으로 조립
      const kstDate = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
        hours,
        minutes,
        0
      );

      // ✅ 2. UTC 기준으로 변환
      const utcDate = new Date(kstDate.getTime() - 9 * 60 * 60 * 1000);

      // ✅ 3. 문자열 직접 생성 (🔥 중요: toISOString() 사용하지 말 것!)
      const pad = (n: number) => n.toString().padStart(2, "0");
      const eventDateTime = `${utcDate.getFullYear()}-${pad(utcDate.getMonth() + 1)}-${pad(utcDate.getDate())}T${pad(utcDate.getHours())}:${pad(utcDate.getMinutes())}:${pad(utcDate.getSeconds())}`;
  
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const formData = new FormData();
  
      if (title) formData.append("title", title);
      if (location) formData.append("location", location);
      if (content) formData.append("content", content);
      if (dateTime.date) formData.append("date", eventDateTime);
      if (postImage) formData.append("postImage", postImage);
      attachments?.forEach(file => formData.append("attachments", file));
      
      const endpoint = `/run/flash/post/${postId}`;
      

      console.log(formData)
      console.log(postId)
      const res = await customAxios.patch(endpoint, formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("요청된 최종 엔드포인트:", res.config.url); // ✅ 실제 요청된 URL
      console.log("요청된 URL:", `"${res.config.url}"`);


      console.log("요청 보낼 엔드포인트:",endpoint); // ✅ 여기서 확인 가능
      if (res.data.isSuccess) {
        alert("번개런이 성공적으로 수정되었습니다!");
        navigate("/FlashRun");
      } else {
        alert(`요청 실패: ${res.data.responseMessage}`);
      }
    } catch (err) {
      console.error("번개런 수정 중 오류:", err);
      alert("번개런 수정 중 문제가 발생했습니다.");
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="flex items-center justify-center w-full h-[56px] px-5 mb-5 relative bg-kuDarkGreen">
        <div className="text-2xl font-semibold text-white text-center">번개런 수정</div>
        <button onClick={() => navigate(-1)} className="absolute left-4">
          <img src={BackIcon} alt="뒤로가기" className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full max-w-md px-4">
        <div className="my-2">제목</div>
        <input className="border rounded-lg w-full p-2" value={title} onChange={(e) => setTitle(e.target.value)} />

        <div className="my-2">집합 장소</div>
        <input className="border rounded-lg w-full p-2" value={location} onChange={(e) => setLocation(e.target.value)} />

        <DateInput selectedDate={dateTime.date} onChange={(date) => setDateTime((prev) => ({ ...prev, date }))} />

        <TimePickerBottomSheet time={dateTime.time} onChange={handleTimeChange} />

        <div className="mb-2 mt-4">세부사항</div>
        <textarea className="w-full p-2 border rounded-lg" rows={10} value={content} onChange={(e) => setContent(e.target.value)} />

        {/* 대표 이미지 */}
        <div className="my-4">
          <h2 className="mb-2">대표 이미지</h2>
          <div className="relative w-[104px] h-[104px]">
            {postImagePreview ? (
              <>
                <img src={postImagePreview} className="w-full h-full object-cover rounded-md" />
                <button
                  onClick={() => {
                    setPostImage(null);
                    setPostImagePreview(null);
                  }}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >✕</button>
              </>
            ) : (
              <label htmlFor="postImageUpload" className="w-[104px] h-[104px] border border-dashed border-gray-400 flex items-center justify-center text-gray-500 cursor-pointer rounded-md">+</label>
            )}
            <input type="file" id="postImageUpload" accept="image/*" onChange={handlePostImageUpload} className="hidden" />
          </div>
        </div>

        {/* 첨부 이미지 */}
        <div className="my-4">
          <h2 className="mb-2">코스 사진</h2>
          <div className="grid grid-cols-3 gap-2">
            {attachmentPreviews.map((img, index) => (
              <div key={index} className="relative w-[104px] h-[104px]">
                <img src={img} className="w-full h-full object-cover rounded-md" />
                <button onClick={() => handleRemoveAttachment(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
              </div>
            ))}
            {attachmentPreviews.length < 6 && (
              <label htmlFor="attachmentUpload" className="w-[104px] h-[104px] border border-dashed border-gray-400 flex items-center justify-center text-gray-500 cursor-pointer rounded-md">+</label>
            )}
            <input type="file" id="attachmentUpload" multiple accept="image/*" onChange={handleAttachmentUpload} className="hidden" />
          </div>
        </div>

        <button onClick={handleSubmit} className="w-full bg-[#366943] text-white py-3 font-bold rounded-lg mt-4 mb-4">수정하기</button>
      </div>
    </div>
  );
}

export default NewFlashRunEdit;