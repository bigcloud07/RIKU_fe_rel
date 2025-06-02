import React, { useState, useEffect } from "react";
import RankingSection from "./Ranking/RankingSection";
import EventSection from "./Ranking/EventSection";
import DetailModal from "./Ranking/DetailModal";
import { useNavigate } from "react-router-dom";

//랭킹 페이지
function RankingPage() {
  const [isEvent, setIsEvent] = useState(false); // 해당 랭킹이 이벤트 창인지 아닌지 체크
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // "이벤트 순위 페이지"에서 '자세히 보기' 버튼을 눌렀을 경우 해당 state 컨트롤

  const navigate = useNavigate(); // navigate 함수를 위해 사용

  // 상단 토글 버튼을 클릭했을 때의 event handler handleToogleBtn
  const handleToogleBtn = (value: boolean) => {
    // 이미 선택된 곳을 또 선택하려 하면, 해당 요청은 무시한다(불필요한 state 렌더링 방지)
    if (isEvent === value) return;

    setIsEvent(value);
  };

  // "번개런 만들기" 페이지로 이동
  const navigateToMakeFlashRun = () => {
    navigate("/make/flash");
  };

  // "번개런 참여하기" 페이지로 이동
  const navigateToParticipateFlashRun = () => {
    navigate("/flash");
  };

  //Tailwind를 사용하여 스타일링 진행
  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-start py-[56px] ${
        isEvent ? "bg-kuLightBlack" : "bg-kuDarkGreen"
      }`}
    >
      {/* 상단의 순위-Event 선택 토글 버튼 */}
      <div
        className={`fixed top-[76px] flex flex-row justify-between items-center rounded-full p-1 z-50 ${
          !isEvent ? "bg-kuLimeGreen text-kuBlack" : "bg-kuDarkGreen text-kuWhite"
        }`}
      >
        <div
          onClick={() => handleToogleBtn(false)}
          className={`px-7 py-1 rounded-3xl font-bold cursor-pointer
            ${!isEvent ? "bg-kuDarkGreen text-kuWhite" : ""}`}
        >
          순위
        </div>
        <div
          onClick={() => handleToogleBtn(true)}
          className={`px-5 py-1 rounded-3xl font-['danjoBoldRegular'] cursor-pointer
            ${isEvent ? "bg-kuLimeGreen text-kuBlack" : ""}`}
        >
          Event
        </div>
      </div>

      {/* 조건부 렌더링 */}
      {isEvent ? (
        <EventSection onShowDetailModal={() => setIsDetailModalOpen(true)} />
      ) : (
        <RankingSection />
      )}

      {/* "자세히 보기" 눌렀을 경우, 모달이 뜰 것임 */}
      <DetailModal
        isDetailModalOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="웹앱 사용 EVENT"
      >
        <span className="text-sm">
          시험기간인 <strong>6.2-6.15</strong> 14일동안 <br />
          <strong>번개런 생성 및 참여</strong>로 포인트를 모아 <br />
          등수를 매기는 이벤트입니다! <br />
        </span>

        {/* 버튼 2개가 들어갈 컨테이너 */}
        <div className="flex flex-row items-center justify-center gap-3 h-auto pt-[16px] pb-[20px]">
          <div
            onClick={navigateToMakeFlashRun}
            className="text-sm text-kuLightBlack bg-kuLightGray rounded-md py-2 px-3 cursor-pointer"
          >
            번개런 만들기
          </div>
          <div
            onClick={navigateToParticipateFlashRun}
            className="text-sm text-kuWhite bg-kuGreen rounded-md py-2 px-4 font-bold cursor-pointer"
          >
            참여하기
          </div>
        </div>

        <span className="text-sm">
          포인트를 가장 많이 모으신 <br />
          <strong>상위 5등</strong>에게 상품을 드립니다! <br />
          시험 스트레스를 <br />
          함께하는 달리기로 날려버려요🍃
        </span>

        {/* "확인" 버튼 */}
        <div
          onClick={() => setIsDetailModalOpen(false)}
          className="w-full bg-kuLightGreen text-xl font-['danjoBoldRegular'] py-3 mt-[32px] rounded-xl cursor-pointer"
        >
          확인
        </div>
      </DetailModal>
    </div>
  );
}

export default RankingPage;
