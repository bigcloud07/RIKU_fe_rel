import React, { useState, useEffect } from "react";
import RegularRunlogo from "../../assets/regularRunMark.svg";
import people from "../../assets/FlashRunDetail/people.svg";
import place from "../../assets/FlashRunDetail/place.svg";
import time from "../../assets/FlashRunDetail/time.svg";
import TabButton from "./TapButton";
import AttendanceList from "./AttendanceList";
import customAxios from "../../apis/customAxios";
import flashrunimage from "../../assets/Run-img/flashrunimage.jpg";
import { useNavigate } from "react-router-dom";
import BackBtnimg from "../../assets/BackBtn.svg";
import pacermark from "../../assets/pacer-mark.svg";
import CommentSection from "./CommentSection";
import PacerCard from "./PacerCard";
import questionmarkOn from "../../assets/questionmark_on.svg";
import questionmarkOff from "../../assets/questionmark_off.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import checkedicon from "../../assets/checkedicon.svg"
import "swiper/css";
import "swiper/css/pagination";

interface Participant {
  id: number;
  name: string;
  profileImage?: string | null;
  isPresent: boolean;
}

interface Pacer {
  group: string;
  pacerName: string;
  distance: string;
  pace: string;
}

interface FlashRunUserData {
  postId?: string;
}

const NewTrainingUser: React.FC<FlashRunUserData> = ({ postId }) => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/training");

  const [activeTab, setActiveTab] = useState<"소개" | "명단">("소개");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [postImageUrl, setPostImageUrl] = useState<string | null>(null);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsNum, setParticipantsNum] = useState<number>(0);
  const [pacers, setPacers] = useState<Pacer[]>([]);
  const [userInfo, setUserInfo] = useState<{ userId: number; userName: string; userProfileImg: string }>({
    userId: 0,
    userName: "",
    userProfileImg: "",
  });


  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [trainingtype, setTrainingtype] = useState("");

  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const [refreshComments, setRefreshComments] = useState(false);

  const [groupList, setGroupList] = useState<{ group: string; pace: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedAttendance, setEditedAttendance] = useState<{ [userId: number]: boolean }>({});
  const [groupedParticipants, setGroupedParticipants] = useState<any[]>([]);
  const [postCreatorName, setPostCreatorName] = useState("");

  const [userStatus, setUserStatus] = useState("");
  const [buttonText, setButtonText] = useState("참여하기");

  const [postStatus, setPostStatus] = useState("")

  const [refreshKey, setRefreshKey] = useState(0);





  const toggleAttendance = (userId: number, originalStatus: string) => {
    setEditedAttendance((prev) => {
      const current = userId in prev ? prev[userId] : originalStatus === "ATTENDED";
      return {
        ...prev,
        [userId]: !current,
      };
    });
  };

  const saveAttendanceChanges = async () => {
    const token = JSON.parse(localStorage.getItem("accessToken") || "null");
    const payload = Object.entries(editedAttendance).map(([userId, isAttend]) => ({
      userId: Number(userId),
      isAttend,
    }));

    try {
      await customAxios.patch(`/run/training/post/${postId}/manual-attend`, payload, {
        headers: { Authorization: `${token}` },
      });
      alert("출석 정보가 저장되었습니다.");
      setIsEditMode(false);
      setEditedAttendance({});
      await fetchParticipantsInfo(); // 최신 데이터 반영
    } catch {
      alert("저장에 실패했습니다.");
    }
  };



  useEffect(() => {
    if (activeTab === "명단") {
      fetchParticipantsInfo();
    }
  }, [activeTab]);








  const getTrainingDescription = (type: string) => {
    switch (type) {
      case 'LSD':
        return (
          <>
            <span className="font-bold">LSD</span>란 Long Slow Distance의 약자로, 장거리 달리기 훈련입니다.
          </>
        );
      // 다른 trainingtype에 대한 설명을 추가할 수 있습니다.
      case '인터벌':
        return (
          <>
            <span className="font-bold">인터벌</span> 훈련 이란 짧은 고강도 러닝과, 휴식 또는 저강도의 회복러닝을 번갈아가며 하는 훈련입니다.
          </>
        );
      case '조깅':
        return (
          <>
            <span className="font-bold">조깅</span>이란 느린 속도로 가볍게 달리는 훈련입니다.
          </>
        );
      default:
        return '';
    }
  };

  const [postCreatorImg, setPostCreatorImg] = useState<string | null>(null);


  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken") || "null");
        const response = await customAxios.get(`/run/training/post/${postId}`, {
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
          setTrainingtype(result.trainingType);
          setPostStatus(result.postStatus);



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
      const response = await customAxios.get(`/run/training/post/${postId}`, {
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
      const res = await customAxios.get(`/run/training/post/${postId}/group`, {
        headers: { Authorization: `${token}` },
      });
      if (res.data.isSuccess) setGroupList(res.data.result);
    } catch {
      setError("그룹 조회 실패");
    }
  };

  // ✅ 수정된 handleJoinConfirm
const handleJoinConfirm = async () => {
  const isCancel = selectedGroup === "";

  try {
    const token = JSON.parse(localStorage.getItem("accessToken") || "null");
    const res = await customAxios.patch(
      `/run/training/post/${postId}/join${!isCancel ? `?group=${selectedGroup}` : ""}`,
      {},
      { headers: { Authorization: `${token}` } }
    );

    if (res.data.isSuccess) {
      const result = res.data.result;

      const myInfo = result.userInfo;
      const updatedGroup = result.groupedParticipants;

      setGroupedParticipants(updatedGroup);

      if (isCancel) {
        setUserStatus(""); 
        setButtonText("참여하기");
        setSelectedGroup("");
      } else {
        setUserStatus("PENDING"); // ✅ 직접 "PENDING"으로 세팅해버려
        setButtonText("출석하기"); // ✅ 바로 "출석하기"로 버튼 텍스트 변경
        setIsGroupModalOpen(false);
      }
      

      setIsGroupModalOpen(false);

      // ❌ 여기 이거 지운다
      // await fetchParticipantsInfo();

    } else {
      setError(res.data.responseMessage);
    }
  } catch (error: any) {
    console.error("❌ 참여/취소 요청 실패:", error);
    if (error?.response?.data) {
      setError(error.response.data.responseMessage || "참여 요청 실패");
    } else {
      setError("참여 요청 실패");
    }
  }
};





  const handleStartClick = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.post(`/run/training/post/${postId}/join`, {}, {
        headers: { Authorization: `${token}` },
      });
      if (response.data.isSuccess) {
        setUserStatus(response.data.result.status);
        setButtonText("출석하기");
        setError(null);
      } else {
        setError(response.data.responseMessage);
      }
    } catch {
      setError("러닝 참여에 실패했습니다.");
    }
  };

  const handleOpenAttendanceModal = () => setIsModalOpen(true);

  const handleAttendanceClick = async () => {
    if (!code) return setError("출석 코드를 입력해주세요.");
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.post(
        `/run/training/post/${postId}/attend`,
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

  const handleTabChange = async (tab: "소개" | "명단") => {
    setActiveTab(tab);
    const token = JSON.parse(localStorage.getItem("accessToken") || "null");

    try {
      const response = await customAxios.get(`/run/training/post/${postId}`, {
        headers: { Authorization: `${token}` },
      });

      if (response.data.isSuccess) {
        const result = response.data.result;

        setParticipants(result.participants || []);
        setParticipantsNum(result.participantsNum);

        setDate(result.date);
        setAttachmentUrls(result.attachmentUrls || []);
        setPacers(result.pacers || []);
        setPostCreatorName(result.postCreatorInfo.userName);
        setPostCreatorImg(result.postCreatorInfo.userProfileImg || null);
        setUserInfo({
          userId: result.userInfo?.userId || 0,
          userName: result.userInfo?.userName || "",
          userProfileImg: result.userInfo?.userProfileImg || "",
        });

        // 댓글도 항상 최신화
        setRefreshComments((prev) => !prev);
      } else {
        setError(response.data.responseMessage);
      }
    } catch {
      setError("데이터를 불러오는 데 실패했습니다.");
    }
  };
  // 말풍선 외부를 클릭했을 때 숨기기
  const handleOutsideClick = (event: React.MouseEvent) => {
    if (!event.target.closest('.tooltip-container') && isTooltipVisible) {
      setIsTooltipVisible(false);
    }
  };




  return (
    <div className="flex flex-col items-center text-center max-w-[430px] mx-auto justify-center" onClick={handleOutsideClick}>
      <div className="relative flex bg-kuDarkGreen w-full h-[56px] text-white text-center text-xl font-semibold justify-center items-center">
        <img src={BackBtnimg} className="absolute left-[24px] cursor-pointer" onClick={handleBack} />
        훈련
      </div>

      <div className="relative w-full pb-[180px]">
        <div className="w-full h-[250px] overflow-hidden">
          <object data={postImageUrl || flashrunimage} className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-[230px] w-full rounded-t-[20px] bg-white">
          <div className="flex flex-col items-center mt-[8px]">
            {/* 상단 전체를 relative로 감싸기 */}
            <div className="relative flex flex-col items-center mt-[4px] w-[375px]">

              {/* trainingtype 박스 */}
              <div className="flex bg-[#FFC002] h-[24px] p-[10px] text-[14px] rounded-[8px] font-bold w-fit items-center">
                {trainingtype}
              </div>


              {/* 물음표 아이콘: 고정된 우측 위치 */}
              {getTrainingDescription(trainingtype) && (
                <div className="relative w-full flex justify-end pr-[18px] tooltip-container">
                  <img
                    src={isTooltipVisible ? questionmarkOn : questionmarkOff}
                    alt="question mark"
                    className="absolute top-[-1px] right-[18px] w-[24px] h-[24px] cursor-pointer"
                    onClick={() => setIsTooltipVisible(!isTooltipVisible)}
                  />

                  {/* 툴팁 */}
                  {isTooltipVisible && (
                    <div className="absolute bottom-[140%] right-[25px] bg-[#F5F5F5] pt-[13.5px] pl-[16px] pr-[16px] pb-[13.5px] rounded-tl-lg rounded-tr-lg rounded-bl-lg w-[186px] text-left text-sm z-10">
                      <div className="text-[#4F3F3F] text-[12px]">
                        {getTrainingDescription(trainingtype)}
                      </div>
                    </div>
                  )}
                </div>
              )}



            </div>
            <div className="text-lg font-semibold mt-2 text-[24px]">{title}</div>
          </div>
          <div className="flex flex-col items-start w-full max-w-[360px] mt-5 px-5">
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

      <div className="mt-[12px]"><TabButton leftLabel="소개" rightLabel="명단" onTabChange={handleTabChange} /></div>

      {activeTab === "소개" && (
        <>
          <div className="flex items-start text-left w-full mt-3 my-2 max-w-[349px]">
            <img src={pacermark} />
            <div className="m-1">PACER</div>
          </div>
          <PacerCard pacers={pacers} />
          {attachmentUrls.length > 0 && (
            <div className="mt-5 w-[327px]">
              <div className="text-left text-[16px] mb-2">코스 사진</div>
              <div className="relative">
                <Swiper
                  pagination={{ clickable: true }}
                  modules={[Pagination]}
                  spaceBetween={10}
                  slidesPerView={1}
                >
                  {attachmentUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative">
                        <div className="w-full h-[300px] overflow-hidden">
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
            </div>
          )}
          <div className="flex flex-col mt-2 items-start text-left w-full max-w-[327px]">세부 내용</div>
          <div className="mt-2 w-[327px] border border-[#ECEBE4] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {postCreatorImg ? (
                <img
                  src={postCreatorImg}
                  alt={`${postCreatorName} 프로필`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#844E4E] text-white text-xs flex items-center justify-center font-bold leading-none">
                  {postCreatorName.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium text-black">{postCreatorName}</span>
            </div>

            <div className="text-[#686F75] p-3 text-sm text-justify whitespace-pre-wrap">{content}</div>
          </div>
        </>
      )}

      {activeTab === "명단" &&
        <AttendanceList
          key={JSON.stringify(groupedParticipants)} // ⬅️ 이거 추가!
          groupedParticipants={groupedParticipants}
          userInfoName={userInfo.userName}
          postCreatorName={postCreatorName}
        />
      }

      <CommentSection postId={postId!} userInfo={userInfo} refreshTrigger={refreshComments} />

      {(postStatus === "CANCELED" || postStatus === "CLOSED") ? (
        <div className="w-[327px] h-14 rounded-lg bg-[#ECEBE4] text-[#757575] font-bold mt-6 flex justify-center items-center cursor-not-allowed">
          모집 종료
        </div>
      ) : userStatus === "ATTENDED" ? (
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
            <h2 className="text-[16px] mb-4">훈련 그룹을 선택해주세요.</h2>

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

export default NewTrainingUser;
