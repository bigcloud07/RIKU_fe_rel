// 통합된 NewRegularRunMake.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import customAxios from '../../apis/customAxios';
import { motion } from "framer-motion";
import BackIcon from "../../assets/Main-img/back-icon.svg";
import removeicon from "../../assets/remove-icon.svg";
import { DateNtime } from "./DateNtime";

interface Pacer {
  id: number;
  name: string;
}

interface PacerGroup {
  id: string;
  pacer: string;
  distance: string;
  pace: string;
}

interface CreatePacerRequest {
  group: string;
  pacerId: number;
  distance: string;
  pace: string;
}

function FlashRunMake() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [dateTime, setDateTime] = useState<{ date: Date | null; time: string }>({
    date: null,
    time: "00:00",
  });
  const [pacerGroups, setPacerGroups] = useState<PacerGroup[]>([
    { id: "A", pacer: "", distance: "", pace: "" },
  ]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState<'distance' | 'pace' | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<string>("5");
  const [selectedMinutes, setSelectedMinutes] = useState<string>("5");
  const [selectedSeconds, setSelectedSeconds] = useState<string>("30");
  const [pacers, setPacers] = useState<Pacer[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);

  useEffect(() => {
    const fetchPacers = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('accessToken') || 'null');
        const response = await customAxios.get("/pacers", {
          headers: { Authorization: `${token}` },
        });
        if (response.data.isSuccess) {
          setPacers(response.data.result);
        }
      } catch (error) {
        console.error("페이서 목록을 가져오는 중 오류 발생:", error);
      }
    };
    fetchPacers();
  }, []);

  const addPacerGroup = () => {
    const nextGroupId = String.fromCharCode(65 + pacerGroups.length);
    setPacerGroups([...pacerGroups, { id: nextGroupId, pacer: "", distance: "", pace: "" }]);
  };

  const removePacerGroup = (id: string) => {
    setPacerGroups(pacerGroups.filter(group => group.id !== id));
  };

  const handleInputChange = (id: string, field: keyof PacerGroup, value: string) => {
    setPacerGroups(
      pacerGroups.map(group => group.id === id ? { ...group, [field]: value } : group)
    );
  };

  const handlePacerChange = (id: string, value: string) => {
    setPacerGroups(
      pacerGroups.map(group => group.id === id ? { ...group, pacer: value } : group)
    );
  };

  const openBottomSheet = (id: string, type: 'distance' | 'pace') => {
    setSelectedGroup(id);
    setBottomSheetType(type);
    setIsBottomSheetOpen(true);
  };

  const applySelection = () => {
    if (selectedGroup) {
      if (bottomSheetType === 'distance') {
        handleInputChange(selectedGroup, "distance", `${selectedDistance} km`);
      } else if (bottomSheetType === 'pace') {
        handleInputChange(selectedGroup, "pace", `${selectedMinutes}:${selectedSeconds}`);
      }
    }
    setIsBottomSheetOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
    const selectedArray = Array.from(selectedFiles);
    if (files.length + selectedArray.length > 6) {
      alert("최대 6장까지만 업로드할 수 있습니다.");
      return;
    }
    selectedArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    setFiles((prev) => [...prev, ...selectedArray]);
  };

  const handleRemoveImage = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDateTimeChange = (date: Date | null, time: string) => {
    setDateTime({ date, time });
  };

  const handleSubmit = async () => {
    
  
    if (!title || !location || !content || !dateTime.date) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
  
    try {
      const isoDate = dateTime.date.toISOString().split("T")[0];
      const eventDateTime = `${isoDate}T${dateTime.time}`;
      const token = JSON.parse(localStorage.getItem('accessToken') || 'null');
  
      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("date", eventDateTime);
      formData.append("content", content);
      files.forEach(file => formData.append("postImage", file));
  
      pacerGroups.forEach((group, index) => {
        formData.append(`pacers[${index}].group`, group.id);
        formData.append(`pacers[${index}].pacerId`, String(group.pacer));
        formData.append(`pacers[${index}].distance`, group.distance);
        formData.append(`pacers[${index}].pace`, group.pace);
      });
  
      const response = await customAxios.post("/run/flash/post", formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data)
  
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

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="flex items-center justify-center w-full max-w-[600px] px-5 mb-5 relative bg-kuDarkGreen">
        <div className="relative flex items-center justify-center py-4 mt-4 ">
          <button
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="absolute left-[-95px] bg-none border-none cursor-pointer"
          >
            <img src={BackIcon} alt="뒤로가기" className="w-6 left-3 h-6" />
          </button>
          <div className="text-2xl font-semibold text-white">번개런 만들기</div>
        </div>
      </div>

      <div className="w-full max-w-md px-4">
        <div className="my-2">제목</div>
        <input className="border rounded-lg w-full p-2" placeholder="제목을 입력하세요" onChange={(e) => setTitle(e.target.value)} />

        <div className="my-2">집합 장소</div>
        <input className="border rounded-lg w-full p-2" placeholder="장소명을 입력하세요" onChange={(e) => setLocation(e.target.value)} />

        <div className="my-2">날짜 및 시간</div>
        <DateNtime onDateTimeChange={handleDateTimeChange} />
        <div className="mb-2 mt-4">세부사항</div>
        <textarea
          className="my-2 w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          rows={10}
          placeholder="세부사항을 입력하세요"
          value={content}
          onChange={handleContent}
        ></textarea>
        

        <div className="my-4">
          <h2 className="mb-2">게시글 사진</h2>
          <div className="grid grid-cols-3 gap-2">
            {previews.map((img, index) => (
              <div key={index} className="relative w-[104px] h-[104px]">
                <img src={img} alt={`upload-${index}`} className="w-[104px] h-[104px] object-cover rounded-md" />
                <button onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
              </div>
            ))}
            {previews.length < 6 && (
              <label htmlFor="fileUpload" className="w-[104px] h-[104px] border border-dashed border-gray-400 flex items-center justify-center text-gray-500 cursor-pointer rounded-md">+</label>
            )}
          </div>
          <input type="file" id="fileUpload" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        <button onClick={handleSubmit} className="w-full bg-[#366943] text-white py-3 rounded-lg mt-4">만들기</button>
      </div>
    </div>
  );
}

export default FlashRunMake;