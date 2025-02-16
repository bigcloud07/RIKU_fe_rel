import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link 컴포넌트 import
import duganadi_Img from '../../assets/RankingPage/dueganadi.png'; //이미지 불러오기
import rikuHorn_left from '../../assets/RankingPage/rikuHorn_left.svg';
import rikuHorn_right from '../../assets/RankingPage/rikuHorn_right.svg';
import rightArrow_Icon from '../../assets/right_arrow.svg'; //라이쿠 로고 불러오기
import customAxios from '../../apis/customAxios';

//랭킹 페이지에서 보여줄 간단한 회원 정보에 관한 SimpleUserInfo interface
interface SimpleUserInfo {
  name: string;
  profileImg: string; // 우선은 File이 아닌 string(URL)로 가정
  point: number;
  rank: number;
}

//랭킹 페이지
function RankingPage() {

  const [userRankInfo, setUserRankInfo] = useState<SimpleUserInfo[]>([]);

  //자신의 랭킹 정보 myRankInfo
  const [myRankInfo, setMyRankInfo] = useState<SimpleUserInfo>(
    { name: "나원허", profileImg: "https://via.placeholder.com/48", point: 111, rank: 12}
  )
  //우선은 테스트를 위한 dummydata (userRankings_dummy)
  const [userRankings_dummy, setUserRankings_dummy] = useState<SimpleUserInfo[]>([
    { name: "김철수", profileImg: "https://via.placeholder.com/48", point: 245, rank: 4 },
    { name: "이영희", profileImg: "https://via.placeholder.com/48", point: 220, rank: 5 },
    { name: "박지성", profileImg: "https://via.placeholder.com/48", point: 198, rank: 6 },
    { name: "나원허", profileImg: "https://via.placeholder.com/48", point: 137, rank: 7 },
    { name: "허주노", profileImg: "https://via.placeholder.com/48", point: 136, rank: 8 },
    { name: "허원나", profileImg: "https://via.placeholder.com/48", point: 133, rank: 9 }
  ])

  //"전체 보기" 클릭 시 수행할 함수
  function handleSeeAllBtnClick()
  {
    alert("열심히 기능 준비중입니다!");
  };

  //초기에 랭킹 정보를 가져와야 한다. 해당 기능을 수행하는 메소드 fetchRankingInfo()
  async function fetchRankingInfo() {

  }


  //처음 렌더링 될 때만 회원 랭킹 정보 불러오기
  useEffect(() => {
    fetchRankingInfo();
  },[])

  
  //Tailwind를 사용하여 스타일링 진행
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-kuDarkGreen py-20 px-4">

      {/* 상단의 Top3 프로필 카드 */}
      <div className="w-full max-w-sm bg-kuDarkGreen rounded-xl flex flex-col justify-center items-center">
        <span className="w-fit text-center font-semibold text-kuDarkGreen bg-white py-1 px-8 rounded-xl">
          Top 3
        </span>

        {/* Top3 섹션 */}
        <div className="flex flex-row justify-between items-end my-4 gap-3">
          {/* 2nd 섹션 */}
          <div className="flex flex-1 flex-col items-center animate-fade-up animation-delay-600 opacity-0">
            <span className="block text-center text-2xl font-bold mb-1 text-whiteSmoke">2nd</span>
            {/* 프로필 이미지 */}
            <div className="bg-gray-300 rounded-full flex items-center justify-center border-[6px] border-kuBeige overflow-hidden z-10">
              <img src={duganadi_Img} alt="1st" className="w-full h-full object-cover" />
            </div>

            {/* 이름 및 포인트 정보 (겹쳐진 부분) */}
            <div className="w-full bg-kuBeige rounded-xl -mt-4 py-4">
              <span className="block text-center text-lg font-bold text-black">기처리</span>
              <span className="block text-center text-sm text-kuDarkGreen font-semibold">178P</span>
            </div>
          </div>

          {/* 1st 섹션 */}
          <div className="flex flex-1 flex-col items-center animate-fade-up animation-delay-1000 opacity-0">
            {/* 1st 섹션에는 라이쿠 뿔이 양옆으로 들어가야 한다, 따라서 따로 div를 판다 */}
            <div className="flex flex-row items-end justify-between space-x-1 mb-1">
              <img src={rikuHorn_left} alt="rikuHornLeft" className="w-full h-full object-cover" />
              <span className="inline-block text-center text-2xl font-bold text-yellow-200">1st</span>
              <img src={rikuHorn_right} alt="rikuHornRight" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-center -space-y-4">
              {/* 프로필 이미지 */}
              <div className="bg-gray-300 rounded-full flex items-center justify-center border-[6px] border-kuBeige overflow-hidden z-10">
                <img src={duganadi_Img} alt="1st" className="w-full h-full object-cover" />
              </div>

              {/* 이름 및 포인트 정보 (겹쳐진 부분) */}
              <div className="w-full bg-kuBeige rounded-xl pt-4 pb-14">
                <span className="block text-center text-lg font-bold text-black">김고은</span>
                <span className="block text-center text-sm text-kuDarkGreen font-semibold">233P</span>
              </div>
            </div>
          </div>

          {/* 3rd 섹션 */}
          <div className="flex flex-1 flex-col items-center animate-fade-up animation-delay-300 opacity-0">
            <span className="block text-center text-2xl font-bold text-whiteSmoke mb-1">3rd</span>
            {/* 프로필 이미지 */}
            <div className="bg-gray-300 rounded-full flex items-center justify-center border-[6px] border-kuBeige overflow-hidden z-10">
              <img src={duganadi_Img} alt="1st" className="w-full h-full object-cover" />
            </div>

            {/* 이름 및 포인트 정보 (겹쳐진 부분) */}
            <div className="w-full bg-kuBeige rounded-xl -mt-4 py-4">
              <span className="block text-center text-lg font-bold text-black">남궁민</span>
              <span className="block text-center text-sm text-kuDarkGreen font-semibold">143P</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* "이번달 내 순위" 내용을 표현하는 부분 */}
      <div className="w-full max-w-sm text-left m-4">
        <span className="text-xl font-bold pr-4 text-whiteSmoke">이번달 내 순위</span>
        <span className="text-xl font-bold pr-4 text-whiteSmoke">|</span>
        <span className="text-xl font-bold text-kuLightGreen">{myRankInfo.rank}</span>
      </div>

      {/* 자신의 랭킹을 표시하는 카드 섹션 */}
      <div className="w-full max-w-sm bg-kuLightGray rounded-xl flex flex-row justify-between items-center px-3 py-2 mb-6">
        <div className="flex flex-row flex-start items-center">
          <span className="text-kuDarkGray text-base font-bold mr-4">{myRankInfo.rank}</span>
          <img src={duganadi_Img} alt="myProfileImg" className="w-16 h-16 rounded-full mr-4"/>
          <span className="text-black text-xl font-bold">{myRankInfo.name}</span>
        </div>
        <span className="text-kuDarkGreen text-xl font-bold mr-3">{myRankInfo.point}P</span>
      </div>

      {/* 그 밑의 4위부터 회원들 랭킹 프로필 카드 (받아온 랭킹 정보를 바탕으로 map 함수로 return할 것임) */}
      {userRankings_dummy.map((user, index) => (
        <div
          key={index}
          className="w-full max-w-sm bg-kuWarmGray rounded-xl flex flex-row justify-between items-center px-3 py-2 mb-2"
        >
          {/* 왼쪽 영역: 순위, 프로필 이미지, 이름 */}
          <div className="flex flex-row items-center">
            <span className="text-kuDarkGray text-sm font-bold mr-4">{index + 4}</span>
            <img src={duganadi_Img} alt={`${user.name} Profile`} className="w-12 h-12 rounded-full mr-4"/>
            <span className="text-black text-base">{user.name}</span>
          </div>
          {/* 오른쪽 영역: 포인트 */}
          <span className="text-kuDarkGreen text-base font-semibold mr-3">{user.point}P</span>
        </div>
      ))}

      {/* 하단의 '전체보기' 버튼 */}
      <div 
        className="w-full max-w-sm bg-kuBeige rounded-xl text-center py-2 mt-4 mb-12"
        onClick={handleSeeAllBtnClick}
      >
        <span className="text-black text-base font-normal">전체보기</span>
      </div>
      
    </div>
  );
}

export default RankingPage;