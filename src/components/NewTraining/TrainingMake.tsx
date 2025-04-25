import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import customAxios from '../../apis/customAxios';
import { motion } from "framer-motion";
import BackIcon from "../../assets/BackBtn.svg";
import removeicon from "../../assets/remove-icon.svg";
import { DateNtime } from "./DateNtime";
import { DateInput } from "./DateInput";
import { TimePickerBottomSheet } from "./TimePickerBottomSheet";

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

function TrainingMake() {
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

  // 대표 사진
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);

  // 코스 사진
  const [courseImages, setCourseImages] = useState<File[]>([]);
  const [coursePreviews, setCoursePreviews] = useState<string[]>([]);
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMainPreview(reader.result as string);
      reader.readAsDataURL(file);
      setMainImage(file);
    }
  };

  const handleCourseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    const selectedArray = Array.from(selectedFiles);
    if (courseImages.length + selectedArray.length > 6) {
      alert("코스 사진은 최대 6장까지 업로드할 수 있습니다.");
      return;
    }
    selectedArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setCoursePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    setCourseImages((prev) => [...prev, ...selectedArray]);
  };

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

  const removeCourseImage = (index: number) => {
    setCourseImages((prev) => prev.filter((_, i) => i !== index));
    setCoursePreviews((prev) => prev.filter((_, i) => i !== index));
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
    if (!title || !mainImage || !location || !content || !dateTime.date || pacerGroups.some(g => !g.pacer || !g.distance || !g.pace)) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    console.log(pacerGroups)
    const hasIncompleteGroup = pacerGroups.some(
      (group) => !group.pacer || !group.distance || !group.pace

    );

    

    try {
      const [hours, minutes] = dateTime.time.split(":").map(Number);
      const selectedDate = dateTime.date!;

      // ✅ 1. KST 기준으로 조립
      const kstDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hours,
        minutes,
        0
      );
      // ✅ 2. UTC 기준으로 변환
      const utcDate = new Date(kstDate.getTime() - 9 * 60 * 60 * 1000);

      // ✅ 3. 문자열 직접 생성 (🔥 중요: toISOString() 사용하지 말 것!)
      const pad = (n: number) => n.toString().padStart(2, "0");
      const eventDateTime = `${utcDate.getFullYear()}-${pad(utcDate.getMonth() + 1)}-${pad(utcDate.getDate())}T${pad(utcDate.getHours())}:${pad(utcDate.getMinutes())}:${pad(utcDate.getSeconds())}`;

      const token = JSON.parse(localStorage.getItem('accessToken') || 'null');

      const formData = new FormData();
      const trainingType = isCustom ? customInput : selected;
      formData.append("trainingType", trainingType);
      formData.append("title", title);
      formData.append("location", location);
      formData.append("date", eventDateTime);
      formData.append("content", content);
      files.forEach(file => formData.append("postImage", file));
      if (mainImage) formData.append("postImage", mainImage);
      courseImages.forEach(file => formData.append("attachments", file));



      pacerGroups.forEach((group, index) => {
        formData.append(`pacers[${index}].group`, group.id);
        formData.append(`pacers[${index}].pacerId`, String(group.pacer));
        formData.append(`pacers[${index}].distance`, group.distance);
        formData.append(`pacers[${index}].pace`, group.pace);
      });

      const response = await customAxios.post("/run/training/post", formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.isSuccess) {
        alert("훈련이 성공적으로 생성되었습니다!");
        navigate("/training");
      } else {
        alert(`요청 실패: ${response.data.responseMessage}`);
      }
    } catch (error) {
      console.error("훈련 생성 중 오류:", error);
      alert("훈련 생성 중 문제가 발생했습니다.");
    }
  };
  const eventTypes = ['조깅', '인터벌', 'LSD', '기타 (직접입력)'];


  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('조깅');
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

  // DateInput관련 핸들러
  const handleDateChange = (date: Date | null) => {
    setDateTime((prev) => ({ ...prev, date }));
  };

  // 시간 입력 관련 상태 및 핸들러
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const handleTimeChange = (time: string) => {
    setDateTime((prev) => ({ ...prev, time }));
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="flex items-center justify-center w-full h-[56px] px-5 mb-5 relative bg-kuDarkGreen">
        <div className="text-2xl font-semibold text-white text-center">훈련 만들기</div>
        <button onClick={() => navigate(-1)} className="absolute left-4">
          <img src={BackIcon} alt="뒤로가기" className="w-6 h-6" />
        </button>
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
                    className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
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

        {/* <div className="my-2">날짜 및 시간</div>
        <DateNtime onDateTimeChange={handleDateTimeChange} /> */}
        <DateInput selectedDate={dateTime.date} onChange={handleDateChange} />
        <TimePickerBottomSheet time={dateTime.time} onChange={handleTimeChange} />
        <div className="mb-2 mt-4">세부사항</div>
        <textarea
          className="my-2 w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          rows={10}
          placeholder="세부사항을 입력하세요"
          value={content}
          onChange={handleContent}
        ></textarea>
        {/* 페이서 그룹 입력 UI */}
        <div className="flex flex-col items-center w-full max-w-md p-4 bg-white rounded-lg relative">
          {isBottomSheetOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setIsBottomSheetOpen(false)}></div>
          )}
          <h2 className="text-lg font-semibold mb-4 self-start">페이서</h2>
          <div className="w-full">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-gray-700 border-b w-[50px]">그룹</th>
                  <th className="p-2 text-gray-700 border-b w-[85px]">페이서</th>
                  <th className="p-2 text-gray-700 border-b w-[85px]">거리</th>
                  <th className="p-2 text-gray-700 border-b w-[70px]">페이스</th>
                  <th className="p-2 w-[40px] border-b"></th>
                </tr>
              </thead>
              <tbody>
                {pacerGroups.map((group) => (
                  <tr key={group.id} className="border-b border-gray-300">
                    <td className="p-2 text-gray-900 text-center w-[50px]">{group.id}</td>
                    <td className="p-2">
                      <select
                        value={group.pacer}
                        onChange={(e) => handlePacerChange(group.id, e.target.value)}
                        className="w-full text-center border-gray-400 focus:outline-none"
                      >
                        <option value="">-</option>
                        {pacers.map((pacer) => (
                          <option key={pacer.id} value={pacer.id}>{pacer.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => openBottomSheet(group.id, "distance")}
                        className="w-full text-center border-gray-400 focus:outline-none"
                      >{group.distance || "-"}</button>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => openBottomSheet(group.id, "pace")}
                        className="w-full text-center border-gray-400 focus:outline-none"
                      >{group.pace || "-"}</button>
                    </td>
                    <td className="p-2 w-[40px]">
                      {group.id !== "A" && (
                        <button
                          onClick={() => removePacerGroup(group.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >✖</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={addPacerGroup}
            className="mt-4 w-full bg-kuDarkGreen text-white py-2 rounded-lg hover:bg-green-700"
          >페이서 그룹 추가</button>

          {isBottomSheetOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 w-full bg-white shadow-lg rounded-t-lg p-4 z-20"
            >
              <div className="flex flex-col items-center">
                <div className="text-lg font-semibold">{bottomSheetType === 'distance' ? "거리 선택" : "페이스 선택"}</div>
                {bottomSheetType === 'distance' ? (
                  <select className="mt-4 p-2 border border-gray-300 rounded-lg w-24 text-center" value={selectedDistance} onChange={(e) => setSelectedDistance(e.target.value)}>
                    {Array.from({ length: 20 }, (_, i) => `${i + 1}`).map((km) => (
                      <option key={km} value={km}>{km} km</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex space-x-2 mt-4">
                    <select
                      className="p-2 border border-gray-300 rounded-lg w-16 text-center"
                      value={selectedMinutes}
                      onChange={(e) => setSelectedMinutes(e.target.value)}
                    >
                      {Array.from({ length: 11 }, (_, i) => (
                        <option key={i} value={String(i)}>
                          {i}
                        </option>
                      ))}
                    </select>
                    <span className="text-lg font-bold">:</span>
                    <select
                      className="p-2 border border-gray-300 rounded-lg w-16 text-center"
                      value={selectedSeconds}
                      onChange={(e) => setSelectedSeconds(e.target.value)}
                    >
                      {Array.from({ length: 6 }, (_, i) => {
                        const sec = i * 10;
                        const padded = String(sec).padStart(2, "0");
                        return (
                          <option key={padded} value={padded}>
                            {padded}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
                <button onClick={applySelection} className="mt-4 bg-kuDarkGreen text-white px-6 py-2 rounded-lg hover:bg-green-700">적용하기</button>
              </div>
            </motion.div>
          )}
        </div>

        {/* 대표 이미지 */}
        <div className="my-4">
          <h2 className="mb-2">대표 이미지 (필수)</h2>
          <div className="relative w-[104px] h-[104px]">
            {mainPreview ? (
              <>
                <img src={mainPreview} alt="대표 이미지" className="w-full h-full object-cover rounded-md" />
                <button onClick={() => { setMainImage(null); setMainPreview(null); }} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
              </>
            ) : (
              <label htmlFor="mainImageUpload" className="w-full h-full border border-dashed border-gray-400 flex items-center justify-center text-gray-500 cursor-pointer rounded-md">+</label>
            )}
          </div>
          <input type="file" id="mainImageUpload" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
        </div>

        {/* 코스 사진 */}
        <div className="my-4">
          <h2 className="mb-2">코스 사진</h2>
          <div className="grid grid-cols-3 gap-2">
            {coursePreviews.map((img, index) => (
              <div key={index} className="relative w-[104px] h-[104px]">
                <img src={img} alt={`course-${index}`} className="w-full h-full object-cover rounded-md" />
                <button onClick={() => removeCourseImage(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
              </div>
            ))}
            {coursePreviews.length < 6 && (
              <label htmlFor="courseImageUpload" className="w-[104px] h-[104px] border border-dashed border-gray-400 flex items-center justify-center text-gray-500 cursor-pointer rounded-md">+</label>
            )}
          </div>
          <input type="file" id="courseImageUpload" multiple accept="image/*" onChange={handleCourseImageUpload} className="hidden" />
        </div>

        <button onClick={handleSubmit} className="w-full bg-[#366943] text-white py-3 rounded-lg mt-4">만들기</button>
      </div>


    </div>

  );
}

export default TrainingMake;