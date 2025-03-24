import React, { useState, useEffect, useRef } from "react";
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

function EventMake() {
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
    console.log(pacerGroups)
    const hasIncompleteGroup = pacerGroups.some(
      (group) => !group.pacer || !group.distance || !group.pace
      
    );
  
    // if (!title || !location || !content || !dateTime.date || hasIncompleteGroup) {
    //   alert("모든 정보를 입력해주세요.");
    //   return;
    // } -> 계속 오류 떠서 일단 주석처리함
  
    try {
      const isoDate = dateTime.date.toISOString().split("T")[0];
      const eventDateTime = `${isoDate}T${dateTime.time}`;
      const token = JSON.parse(localStorage.getItem('accessToken') || 'null');
  
      const formData = new FormData();
      const eventType = isCustom ? customInput : selected;
      formData.append("eventType", eventType);
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
  
      const response = await customAxios.post("/run/event/post", formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data.isSuccess) {
        alert("행사가 성공적으로 생성되었습니다!");
        navigate("/run");
      } else {
        alert(`요청 실패: ${response.data.responseMessage}`);
      }
    } catch (error) {
      console.error("행사 생성 중 오류:", error);
      alert("행사 생성 중 문제가 발생했습니다.");
    }
  };
  const eventTypes = ['마라톤', '동아리 행사', '러닝 세션', '기타 (직접입력)'];

  
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('마라톤');
  const [customInput, setCustomInput] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (type: string) => {
    setIsCustom(type === '기타 (직접입력)');
    setSelected(type);
    setIsOpen(false);
    if (type !== '기타 (직접입력)') {
      setCustomInput('');
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="text-2xl font-semibold text-white">행사 만들기</div>
        </div>
      </div>

      {/* 훈련유형 */}
      <div className="w-full max-w-md px-4" ref={dropdownRef}>
  <label className="block text-sm font-medium text-gray-700 mb-1">행사 유형</label>
  <div className="relative">
    {!isCustom ? (
      <>
        <button
          type="button"
          onClick={toggleDropdown}
          className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-4 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {selected}
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-200 rounded-md max-h-60 overflow-auto">
            {eventTypes.map((type) => (
              <li
                key={type}
                onClick={() => {
                  if (type === '기타 (직접입력)') {
                    setIsCustom(true);
                    setIsOpen(false);
                    setSelected('');
                  } else {
                    handleSelect(type);
                  }
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
              >
                {type}
              </li>
            ))}
          </ul>
        )}
      </>
    ) : (
      <div className="relative">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="행사명을 입력하세요"
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => {
            setIsCustom(false);
            setCustomInput('');
            setSelected('마라톤'); // 기본값으로 초기화
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    )}
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

export default EventMake;