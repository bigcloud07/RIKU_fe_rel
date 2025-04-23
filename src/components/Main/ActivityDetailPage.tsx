import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link 컴포넌트 import
import customAxios from "../../apis/customAxios";
import ActionBar from "../../components/ActionBar";
import defaultProfileImg from "../../assets/default_profile.png";

interface participationDetails {
  date: string;
  postType: string;
  point: number;
  title: string;
}

interface userData {
  name: string;
  userRole: string;
  userProfileImgUrl: string | null;
  points: number;
  participationCounts: number;
  rank: number;
  participationDetails: participationDetails[];
}

//활동 내역의 종류에 따라 마커 컬러를 return하는 메소드
function setMarkerColor(postType: string) {
  if (postType === "REGULAR") {
    //정규런이면..
    return "bg-kuDarkGreen";
  } else if (postType === "TRAINING") {
    //훈련이면..
    return "bg-kuYellow";
  } else if (postType === "EVENT") {
    //행사이면..
    return "bg-kuBrown";
  } else if (postType === "FLASH") {
    //번개런이면..
    return "bg-kuGreen";
  }
}

//활동 내역의 종류에 따라 마커의 "활동 종류"를 return하는 메소드
function setEventTypeString(postType: string) {
  if (postType === "REGULAR") {
    //정규런이면..
    return "정규런";
  } else if (postType === "TRAINING") {
    //훈련이면..
    return "훈련";
  } else if (postType === "EVENT") {
    //행사이면..
    return "행사";
  } else if (postType === "FLASH") {
    //번개런이면..
    return "번개런";
  }
}

//user의 활동 내역을 불러오는 화면 ActivityDetailPage()
function ActivityDetailPage() {
  const navigate = useNavigate(); //useNavigate 훅을 사용해 navigate 함수 생성

  const [userData, setUserData] = useState<userData>({
    //해당 페이지에서 사용할 userData를 한 객체에 모아서 관리
    name: "허기철",
    userRole: "살려주세요",
    userProfileImgUrl: null,
    points: 0,
    participationCounts: 0,
    rank: 0,
    participationDetails: [
      {
        date: "2025.03.14",
        postType: "REGULAR",
        point: 40,
        title: "[참여] 완주를 위한 체력 기르기",
      },
      {
        date: "2024.12.28",
        postType: "FLASH",
        point: 40,
        title:
          "[참여] 일찍 일어나 선릉에 가면 기처리가 마중을 나와준다는 이야기가 있다. 나는 이 이야기를 정말 좋아한다",
      },
      {
        date: "2024.12.25",
        postType: "TRAINING",
        point: 40,
        title:
          "[참여] 아침에 회사에 가서 집에 가고 싶다고 외쳐 보아라. 시끄럽기만 하고 집은 못갈 것이다. 나비보벳따우",
      },
      {
        date: "2024.11.03",
        postType: "EVENT",
        point: 40,
        title: "[참여] 2024 JTBC 서울 마라톤",
      },
    ],
  });

  //유저 세부 정보를 불러오는 fetchUserDetailedProfile()
  async function fetchUserDetailedProfile() {
    try {
      const url = "/user/profile/detail";
      const accessToken = JSON.parse(localStorage.getItem("accessToken") || ""); //localStorage에 저장된 accessToken 값이 없으면 ''으로 초기화
      const response = await customAxios.get(url, {
        headers: {
          Authorization: accessToken,
        },
      });
      console.log(response.data.result);
    } catch (error) {
      console.error("프로필 불러오기 실패:", error);
      alert("프로필 불러오기 실패!");
    }
  }

  //페이지 최초 로딩 1회 시에 유저 정보를 불러와야 함
  useEffect(() => {
    fetchUserDetailedProfile();
  }, []);

  return (
    <>
      <ActionBar />
      <div className="min-h-screen w-full flex flex-col items-center justify-start bg-white pt-[56px] pb-20">
        <div className="w-full text-left mt-2 mb-16 p-4 pl-8">
          <span className="text-2xl font-bold">활동 내역</span>
        </div>
        <div className="relative w-full">
          {/* 프로필 사진 */}
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-28 h-28 rounded-full bg-gray-300 border-[4px] border-kuCoolGray overflow-hidden">
              <img
                src={userData.userProfileImgUrl ?? defaultProfileImg} //userData의 userProfileImg가 null이면 기본 이미지 출력하는 구조
                alt="프로필사진"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 기준이 되는 하단 박스 */}
          <div className="bg-kuLightGray w-full pt-16 pb-4 pl-8 pr-8 mb-8">
            <div className="w-full flex flex-col gap-1 justify-center items-center">
              <span className="text-2xl font-bold">{userData.name}</span>
              <span className="text-xs text-kuBlack">{userData.userRole}</span>
            </div>
            {/* 포인트, 활동 내역, 순위를 나타내는 박스 */}
            <div className="flex flex-row justify-center items-center py-3 px-0 bg-kuWhite rounded-lg mt-6 mb-10">
              <div className="w-1/3 flex flex-col justify-center items-center gap-1">
                <span className="text-2xl font-bold text-kuDarkGreen">{userData.points}</span>
                <span className="text-xs text-kuDarkGray">포인트</span>
              </div>
              <div className="w-1/3 flex flex-col justify-center items-center gap-1 border-x-[1px] border-kuCoolGray ">
                <span className="text-2xl font-bold text-kuDarkGreen">
                  {userData.participationCounts}
                </span>
                <span className="text-xs text-kuDarkGray">활동 내역</span>
              </div>
              <div className="w-1/3 flex flex-col justify-center items-center gap-1">
                <span className="text-2xl font-bold text-kuDarkGreen">{userData.rank}</span>
                <span className="text-xs text-kuDarkGray">순위</span>
              </div>
            </div>
            {/* 여기서부터는 상세 활동 내역을 출력하는 곳입니다 */}
            {userData.participationDetails.map((participationDetail, i) => {
              return (
                <div className="flex w-full rounded-xl overflow-hidden border border-gray-200 mb-3">
                  {/* 좌측 정보 영역 */}
                  <div className="flex flex-col justify-center gap-1 px-4 py-3 bg-white w-4/5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{participationDetail.date}</span>
                      <span
                        className={`${setMarkerColor(
                          participationDetail.postType
                        )} text-white px-2 py-0.5 rounded-lg text-[10px] font-semibold`}
                      >
                        {setEventTypeString(participationDetail.postType)}
                      </span>
                    </div>
                    <div className="text-m font-medium text-gray-800">
                      {participationDetail.title}
                    </div>
                  </div>

                  {/* 우측 포인트 영역 */}
                  <div className="flex items-center justify-center w-1/5 bg-kuWarmGray">
                    <span className="text-lg font-medium text-gray-600">
                      {participationDetail.point}P
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ActivityDetailPage;
