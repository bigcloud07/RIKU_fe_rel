import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link 컴포넌트 import
import profile_Img from "../../assets/default_profile.png"; //이미지 불러오기
import rightArrow_Icon from "../../assets/right_arrow.svg"; //라이쿠 로고 불러오기
import customAxios from "../../apis/customAxios";
import duganadi_Img from "../../assets/RankingPage/dueganadi.png"; //이미지 불러오기
import pencil_Icon from "../../assets/Main-img/pencil.svg"; //연필 로고 불러오기
import arrowDown_Icon from "../../assets/Main-img/arrow_down.svg"; //아래쪽 화살표 로고 불러오기
import ActionBar from "../../components/ActionBar";
import defaultProfileImg from "../../assets/default_profile.png";

interface userData {
  name: string;
  role: string;
  userProfileImgUrl: string | null;
  points: number;
  participationCounts: number;
  rank: number;
}

//user의 활동 내역을 불러오는 화면 ActivityDetailPage()
function ActivityDetailPage() {
  const navigate = useNavigate(); //useNavigate 훅을 사용해 navigate 함수 생성

  const [userData, setUserData] = useState<userData>({
    //해당 페이지에서 사용할 userData를 한 객체에 모아서 관리
    name: "허기철",
    role: "살려주세요",
    userProfileImgUrl: null,
    points: 0,
    participationCounts: 0,
    rank: 0,
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
            <div className="w-28 h-28 rounded-full bg-gray-300 border-[4px] border-kuDarkGreen overflow-hidden">
              <img
                src={userData.userProfileImgUrl ?? defaultProfileImg} //userData의 userProfileImg가 null이면 기본 이미지 출력하는 구조
                alt="프로필사진"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 기준이 되는 하단 박스 */}
          <div className="bg-whiteSmoke w-full pt-16 pb-4 pl-8 pr-8"></div>
        </div>
      </div>
    </>
  );
}

export default ActivityDetailPage;
