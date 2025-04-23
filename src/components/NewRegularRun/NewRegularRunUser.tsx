// ✅ 통합된 NewRegularRunUser.tsx (그룹 선택 및 참여 기능 포함)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import customAxios from "../../apis/customAxios";
import RegularRunlogo from "../../assets/regularRunMark.svg";
import people from "../../assets/FlashRunDetail/people.svg";
import place from "../../assets/FlashRunDetail/place.svg";
import time from "../../assets/FlashRunDetail/time.svg";
import BackBtnimg from "../../assets/BackBtn.svg";
import pacermark from "../../assets/pacer-mark.svg";
import flashrunimage from "../../assets/Run-img/flashrunimage.jpg";

import TabButton from "./TapButton";
import AttendanceList from "./AttendanceList";
import CommentSection from "./CommentSection";
import PacerCard from "./PacerCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import checkedicon from "../../assets/checkedicon.svg"

interface FlashRunUserData {
  postId?: string;
}

const NewRegularRunUser: React.FC<FlashRunUserData> = ({ postId }) => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/regular");

  const [activeTab, setActiveTab] = useState<"소개" | "명단">("소개");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [postImageUrl, setPostImageUrl] = useState<string | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [participantsNum, setParticipantsNum] = useState(0);
  const [pacers, setPacers] = useState<any[]>([]);
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState({ userId: 0, userName: "", userProfileImg: "" });
  const [postCreatorName, setPostCreatorName] = useState("");
  const [postCreatorImg, setPostCreatorImg] = useState<string | null>(null);
  const [refreshComments, setRefreshComments] = useState(false);
  const [userStatus, setUserStatus] = useState("");

  const [buttonText, setButtonText] = useState("참여하기"); // 기본값만


  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupList, setGroupList] = useState<{ group: string; pace: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [groupedParticipants, setGroupedParticipants] = useState<any[]>([]);


  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken") || "null");
        const response = await customAxios.get(`/run/regular/post/${postId}`, {
          headers: { Authorization: `${token}` },
        });

        if (response.data.isSuccess) {
          const result = response.data.result;

          // 기존 상태 세팅
          setTitle(result.title);
          setLocation(result.location);
          setDate(result.date);
          setContent(result.content);
          setPostImageUrl(result.postImageUrl);
          setParticipants(result.participants || []);
          setParticipantsNum(result.participantsNum || 0);
          setPacers(result.pacers || []);
          setAttachmentUrls(result.attachmentUrls || []);
          setUserInfo(result.userInfo || {});
          setPostCreatorName(result.postCreatorInfo.userName);
          setPostCreatorImg(result.postCreatorInfo.userProfileImg || null);
          setGroupedParticipants(result.groupedParticipants || []);

          const myInfo = result.userInfo;
          const foundGroup = result.groupedParticipants?.find(group =>
            group.participants?.some((p: any) => p.userId === myInfo.userId)
          );
          if (foundGroup) {
            setSelectedGroup(foundGroup.group);
            const matchedUser = foundGroup.participants.find((p: any) => p.userId === myInfo.userId);
            setUserStatus(matchedUser?.status || "");
            setButtonText(
              matchedUser?.status === "ATTENDED"
                ? "출석완료"
                : matchedUser?.status === "PENDING"
                  ? "출석하기"
                  : "참여하기"
            );
          }
        }
      } catch {
        setError("데이터 로딩 실패");
      }
    };

    fetchPostData();
  }, [postId]);

  const fetchParticipantsInfo = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.get(`/run/regular/post/${postId}`, {
        headers: { Authorization: `${token}` },
      });

      if (response.data.isSuccess) {
        const result = response.data.result;
        setParticipants(result.participants || []);
        setParticipantsNum(result.participantsNum || 0);
        setGroupedParticipants(result.groupedParticipants || []);

        console.log("📦 Fetched participants:", result.participants);
        console.log("👥 Fetched grouped participants:", result.groupedParticipants);
      }
    } catch (error: any) {
      console.error("❌ 참여/취소 요청 실패:", error);

      if (error?.response?.data) {
        const serverError = error.response.data;
        console.error("📦 서버 응답 내용:", serverError);

        setError(serverError.responseMessage || "참여 요청 실패");
      } else {
        setError("참여 요청 실패");
      }
    }
  };

  useEffect(() => {
    fetchParticipantsInfo();
  }, [postId]);

  useEffect(() => {
    if (activeTab === "명단") {
      fetchParticipantsInfo();
    }
  }, [activeTab]);


  const handleOpenGroupModal = async () => {
    setIsGroupModalOpen(true);
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const res = await customAxios.get(`/run/regular/post/${postId}/group`, {
        headers: { Authorization: `${token}` },
      });
      if (res.data.isSuccess) setGroupList(res.data.result);
    } catch {
      setError("그룹 조회 실패");
    }
  };

  const handleJoinConfirm = async () => {
    const isCancel = selectedGroup === "";

    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const res = await customAxios.patch(
        `/run/regular/post/${postId}/join${!isCancel ? `?group=${selectedGroup}` : ""}`,
        {},
        { headers: { Authorization: `${token}` } }
      );

      if (res.data.isSuccess) {
        if (isCancel) {
          // ✅ 참여 취소 처리
          setUserStatus("");
          setButtonText("참여하기");
          setSelectedGroup("");
          setIsGroupModalOpen(false);

          await fetchParticipantsInfo();
          return;
        }

        // ✅ 그룹 참여 or 수정 처리
        const updatedGroup = res.data.result.groupedParticipants;


        if (!updatedGroup) {
          // 혹시라도 없는 경우 대비해서 다시 전체 fetch
          await fetchParticipantsInfo();
          setIsGroupModalOpen(false);
          return;
        }

        setGroupedParticipants(updatedGroup);

        const foundGroup = updatedGroup?.find(group =>
          group.participants?.find((p: any) => p.userId === userInfo.userId)
        );
        if (foundGroup) {
          const matchedUser = foundGroup.participants.find((p: any) => p.userId === userInfo.userId);
          setUserStatus(matchedUser?.status || "");
          setButtonText(
            matchedUser?.status === "ATTENDED"
              ? "출석완료"
              : matchedUser?.status === "PENDING"
                ? "출석하기"
                : "참여하기"
          );
        }

        setIsGroupModalOpen(false);
      } else {
        setError(res.data.responseMessage);
      }
    } catch (error: any) {
      console.error("❌ 참여/취소 요청 실패:", error);
      if (error?.response?.data) {
        console.error("📦 서버 응답 내용:", error.response.data);
        setError(error.response.data.responseMessage || "참여 요청 실패");
      } else {
        setError("참여 요청 실패");
      }
    }
  };




  // 변경된 handleAttendanceClick 함수:
  const handleAttendanceClick = async () => {
    if (!code) return setError("출석 코드를 입력해주세요.");
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.post(
        `/run/regular/post/${postId}/attend`,
        { code },
        { headers: { Authorization: `${token}` } }
      );
      if (response.data.isSuccess) {
        setUserStatus("ATTENDED");
        setButtonText("출석완료");
        setIsModalOpen(false);
        setError(null);
      } else {
        setError(response.data.responseMessage);
      }
    } catch {
      setError("출석 요청에 실패했습니다.");
    }
  };

  const formatDateTime = (iso: string) => {
    const utcDate = new Date(iso);
    const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
    return `${kstDate.getMonth() + 1}월 ${kstDate.getDate()}일 ${kstDate.getHours().toString().padStart(2, "0")}:${kstDate.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center text-center px-5 justify-center">
      <div className="relative flex bg-kuDarkGreen w-[375px] h-[56px] text-white text-xl font-semibold justify-center items-center">
        <img src={BackBtnimg} className="absolute left-[24px] cursor-pointer" onClick={handleBack} />
        정규런
      </div>

      <div className="relative w-[375px] pb-[90px]">

        <div className="w-[375px] h-[308px] overflow-hidden">
          <object data={postImageUrl || flashrunimage} className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-[230px] w-[375px] rounded-t-[20px] bg-white">
          <div className="flex flex-col items-center mt-[14px]">
            <object data={RegularRunlogo} className="w-[60px] h-[24px]" />
            <div className="text-lg font-semibold mt-2 text-[24px]">{title}</div>
          </div>
          <div className="flex flex-col items-start w-full max-w-[360px] mt-5">
            <div className="flex items-center my-1.5">
              <object data={place} className="w-[24px] h-[24px] mr-2" />
              <span>{location}</span>
            </div>
            <div className="flex items-center my-1.5">
              <object data={time} className="w-[24px] h-[24px] mr-2" />
              <span>{formatDateTime(date)}</span>
            </div>
            <div className="flex items-center my-1.5">
              <object data={people} className="w-[24px] h-[24px] mr-2" />
              <span className="font-bold text-kuDarkGreen">{participantsNum}</span>
            </div>
          </div>
        </div>
      </div>


      <TabButton leftLabel="소개" rightLabel="명단" onTabChange={setActiveTab} />
      {activeTab === "소개" && <>
        <div className="flex items-start text-left w-full mt-[24px] my-2 max-w-[349px]">
          <img src={pacermark} />
          <div className="m-1">PACER</div>
        </div>
        <PacerCard pacers={pacers} />
        {attachmentUrls.length > 0 && (
          <div className="mt-5 w-[327px]">
            <div className="text-left text-[16px] mb-[16px]">코스 사진</div>
            <Swiper pagination={{ clickable: true }} modules={[Pagination]} spaceBetween={10} slidesPerView={1}>
              {attachmentUrls.map((url, index) => (
                <SwiperSlide key={index}>
                  <div className="relative">
                    <div className="w-[400px] h-[300px] overflow-hidden">
                      <img
                        src={url}
                        alt={`코스 사진 ${index + 1}`}
                        className="rounded-lg w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                      {index + 1}/{attachmentUrls.length}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        <div className="flex flex-col mt-[24px] items-start text-left w-full max-w-[327px]">세부 내용</div>
        <div className="mt-[12px] w-[327px] border border-[#ECEBE4] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            {postCreatorImg ? (
              <img src={postCreatorImg} alt="프로필" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#844E4E] text-white text-xs flex items-center justify-center font-bold">
                {postCreatorName.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium text-black">{postCreatorName}</span>
          </div>
          <div className="text-[#686F75] p-3 text-sm text-justify whitespace-pre-wrap">{content}</div>
        </div>
      </>}

      {activeTab === "명단" &&
        <AttendanceList
          key={JSON.stringify(groupedParticipants)} // ⬅️ 이거 추가!
          groupedParticipants={groupedParticipants}
          userInfoName={userInfo.userName}
          postCreatorName={postCreatorName}
        />
      }


      <CommentSection postId={postId!} userInfo={userInfo} refreshTrigger={refreshComments} />

      {/* ✅ 참여 상태에 따른 버튼 렌더링 */}
      {userStatus === "ATTENDED" ? (
        <div className="w-[327px] h-14 rounded-lg bg-[#ECEBE4] text-[#757575] font-bold mt-6 flex justify-center items-center cursor-not-allowed">
          출석완료
        </div>
      ) : userStatus === "PENDING" ? (
        <>
          {selectedGroup && (
            <div className="text-sm text-left text-kuDarkGray w-full max-w-[327px] mt-4 pl-6">
              내가 선택한 그룹 : <span className="font-semibold">{selectedGroup}</span>
            </div>
          )}
          <div className="flex gap-2 mt-[8px] mb-6">
            <button
              className="w-[164px] h-[52px] font-bold rounded-lg text-white bg-kuGreen"
              onClick={handleOpenGroupModal}
            >
              그룹 수정
            </button>
            <button
              className="w-[164px] h-[52px] rounded-lg font-bold bg-kuDarkGreen text-white"
              onClick={() => setIsModalOpen(true)}
            >
              출석하기
            </button>
          </div>
        </>
      ) : (
        <button
          className="w-[327px] h-14 rounded-lg bg-kuGreen text-white font-bold mt-6 mb-6"
          onClick={handleOpenGroupModal}
        >
          참여하기
        </button>
      )}



      {isGroupModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg w-[300px] max-w-[90%] text-center relative shadow-lg">
            <button
              className="absolute top-[2px] right-2.5 text-2xl cursor-pointer w-[16px] h-[16px]"
              onClick={() => setIsGroupModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-[16px] mb-4">정규런 그룹을 선택해주세요.</h2>

            {/* 그룹 선택 옵션 */}
            <div className="flex justify-center">
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto w-full"
                style={{ paddingRight: "8px", marginRight: "-8px" }}>
                {groupList.map((group, index) => {
                  const isSelected = selectedGroup === group.group;

                  const handleSelect = () => {
                    if (isSelected) {
                      setSelectedGroup(""); // 다시 누르면 해제
                    } else {
                      setSelectedGroup(group.group); // 선택
                    }
                  };

                  return (
                    <button
                      key={index}
                      className={`rounded-lg border flex items-center justify-between w-[230px] h-[48px] ${isSelected ? "bg-[#F3F8E8]" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      onClick={handleSelect}
                    >
                      {/* 왼쪽: 그룹명 | 페이스 */}
                      <div className="flex items-center text-left">
                        <span className={`my-[16px] ml-[16px] font-bold text-base ${isSelected ? "text-black" : "text-gray-400"}`}>
                          {group.group}
                        </span>
                        <div className="w-px h-[42px] ml-[16px] bg-gray-400" />
                        <span className={`text-[16px] font-semibold ml-[10px] ${isSelected ? "text-kuDarkGreen" : "text-gray-400"}`}>
                          {group.pace}
                        </span>
                      </div>

                      {/* 오른쪽 체크 아이콘 */}
                      {isSelected && (
                        <img src={checkedicon} alt="checked" className="w-[24px] h-[24px] mr-[16px]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* 확인 버튼 */}
            <button
              className="mt-5 w-full py-3 bg-kuDarkGreen text-white rounded-lg"
              onClick={handleJoinConfirm}
            >
              확인
            </button>

            {/* 에러 메시지 */}
            {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
          </div>
        </div>
      )}

      {/* // 출석 모달 구조 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-5 rounded-lg w-[280px] text-center relative">
            <button className="absolute top-2.5 right-2.5 text-2xl cursor-pointer" onClick={() => setIsModalOpen(false)}>×</button>
            <h2 className="text-lg font-semibold">참여 코드를 입력해주세요.</h2>
            <input
              type="text"
              className="w-full p-2 border-b border-gray-300 text-center text-lg mt-5"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              className="w-full py-3 rounded-lg bg-[#366943] text-white text-lg mt-5"
              onClick={handleAttendanceClick}
            >
              확인
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      )}


    </div>
  );
};

export default NewRegularRunUser;