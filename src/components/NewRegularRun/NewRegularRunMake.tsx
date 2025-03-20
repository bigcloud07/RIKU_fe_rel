import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import customAxios from '../../apis/customAxios'; // customAxios 경로에 맞게 변경
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
  pacerid: string;
  distance: string;
  pace: string;
}

function NewRegularRunMake() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [dateTime, setDateTime] = useState<{ date: Date | null; time: string }>({
    date: null,
    time: "00:00",
  });
  const [file, setFile] = useState<File | null>(null);
  const [pacerGroups, setPacerGroups] = useState<PacerGroup[]>([
    { id: "A", pacer: "", distance: "", pace: "" }
  ]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState<'distance' | 'pace' | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<string>("5");
  const [selectedMinutes, setSelectedMinutes] = useState<string>("5");
  const [selectedSeconds, setSelectedSeconds] = useState<string>("30");
  const [image, setImage] = useState<string | null>(null);
  const [pacers, setPacers] = useState<Pacer[]>([]);

  useEffect(() => {
    // API로부터 페이서 목록을 가져옵니다.
    const fetchPacers = async () => {
        try {
          const token = JSON.parse(localStorage.getItem('accessToken') || 'null');
          console.log(token)
          const response = await customAxios.get("/pacers", {
            headers: {
              Authorization: `${token}`,
            },
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
    const nextGroupId = String.fromCharCode(65 + pacerGroups.length); // A -> B -> C ...
    setPacerGroups([...pacerGroups, { id: nextGroupId, pacer: "", distance: "", pace: "" }]);
  };

  const removePacerGroup = (id: string) => {
    setPacerGroups(pacerGroups.filter(group => group.id !== id));
  };

  const handleInputChange = (id: string, field: keyof PacerGroup, value: string) => {
    setPacerGroups(
      pacerGroups.map(group =>
        group.id === id ? { ...group, [field]: value } : group
      )
    );
  };

  const handlePacerChange = (id: string, value: string) => {
    setPacerGroups(
      pacerGroups.map(group =>
        group.id === id ? { ...group, pacer: value } : group
      )
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
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setFile(null);
  };

  const handleDateTimeChange = (date: Date | null, time: string) => {
    setDateTime({ date, time });
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleLocation = (e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value);
  const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);

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
      if (file) {
        formData.append("postImage", file);
      }

      const pacers: CreatePacerRequest[] = pacerGroups.map(group => ({
        group: group.id,
        pacerid: group.pacer,
        distance: group.distance,
        pace: group.pace,
      }));

      formData.append("pacers", JSON.stringify(pacers));

      const response = await customAxios.post(
        "/run/regular/post",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.isSuccess) {
        alert("정규런이 성공적으로 생성되었습니다!");
        navigate("/run");
      } else {
        alert(`요청 실패: ${response.data.responseMessage}`);
      }
    } catch (error) {
      console.error("정규런 생성 중 오류:", error);
      alert("정규런 생성 중 문제가 발생했습니다.");
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
            <img
              src={BackIcon}
              alt="뒤로가기"
              className="w-6 left-3 h-6"
            />
          </button>
          <div className="text-2xl font-semibold text-white">정규런 만들기</div>
        </div>
      </div>
      <div>
        <div className="my-2">제목</div>
        <input
          placeholder="제목을 입력하세요"
          className="my-2 border border-gray-300 rounded-lg px-4 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onChange={handleTitle}
        />
        <div className="my-2">집합 장소</div>
        <input
          placeholder="장소명을 입력하세요"
          className="my-2 border border-gray-300 rounded-lg px-4 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onChange={handleLocation}
        />
        <div className="my-2">날짜 및 시간</div>
        <DateNtime onDateTimeChange={handleDateTimeChange} />
        <div>
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
                    <th className="p-2 text-gray-700 border-b w-[70px]">페이서</th>
                    <th className="p-2 text-gray-700 border-b w-[70px]">거리</th>
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
                            <option key={pacer.id} value={pacer.id}>
                              {pacer.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => openBottomSheet(group.id, 'distance')}
                          className="w-full text-center border-gray-400 focus:outline-none"
                        >
                          {group.distance || "-"}
                        </button>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => openBottomSheet(group.id, 'pace')}
                          className="w-full text-center border-gray-400 focus:outline-none"
                        >
                          {group.pace || "-"}
                        </button>
                      </td>
                      <td className="p-2 w-[40px]">
                        {group.id !== "A" && (
                          <button
                            onClick={() => removePacerGroup(group.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✖
                          </button>
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
            >
              페이서 그룹 추가
            </button>

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
                    <select
                      className="mt-4 p-2 border border-gray-300 rounded-lg w-24 text-center"
                      value={selectedDistance}
                      onChange={(e) => setSelectedDistance(e.target.value)}
                    >
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
                        {Array.from({ length: 60 }, (_, i) => `${i}`).map((min) => (
                          <option key={min} value={min}>{min}</option>
                        ))}
                      </select>
                      <span className="text-lg font-bold">:</span>
                      <select
                        className="p-2 border border-gray-300 rounded-lg w-16 text-center"
                        value={selectedSeconds}
                        onChange={(e) => setSelectedSeconds(e.target.value)}
                      >
                        {Array.from({ length: 60 }, (_, i) => `${i}`).map((sec) => (
                          <option key={sec} value={sec}>{sec}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button
                    onClick={applySelection}
                    className="mt-4 bg-kuDarkGreen text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    적용하기
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        <div className="mb-2 mt-4">세부사항</div>
        <textarea
          className="my-2 w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          rows={10}
          placeholder="세부사항을 입력하세요"
          value={content}
          onChange={handleContent}
        ></textarea>
        <div className="flex flex-col items-center w-full max-w-md bg-white rounded-lg">
          <h2 className=" mb-4 self-start">게시글 사진</h2>
          {image ? (
            <div className="relative w-full max-w-sm">
              <img src={image} alt="Uploaded" className="w-full h-auto rounded-lg" />
              <img
                src={removeicon}
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 cursor-pointer w-[30px] h-[30px]"
              />
            </div>
          ) : (
            <div className="w-full max-w-sm h-40 flex items-center justify-center border border-gray-300 rounded-lg">
              <span className="text-gray-400">이미지를 업로드하세요</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="fileUpload" />
          <label htmlFor="fileUpload" className="mt-4 w-full bg-kuDarkGreen text-white text-center px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer">
            사진 업로드
          </label>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="my-2 w-full py-3 rounded-lg bg-[#366943] text-white text-lg my-4"
        >
          만들기
        </button>
      </div>
    </div>
  );
}

export default NewRegularRunMake;