import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewMainCard from "./NewMainCard";
import NewMainImage from "../../assets/Main-img/NewMainImage.svg";
import TabNavigationUI from "../TabNavigationUI";
import plusBtn from "../../assets/plus_Icon.svg";
import img1 from "../../assets/Main-img/main-moving-images/1.png";
import img2 from "../../assets/Main-img/main-moving-images/2.png";
import img3 from "../../assets/Main-img/main-moving-images/3.png";
import img4 from "../../assets/Main-img/main-moving-images/4.png";
import TopBarimg from "../../assets/Top-bar.svg";
import customAxios from "../../apis/customAxios";
import NOWimg from "../../assets/Main-img/NewOpenStatus.svg";
import CLODESDimg from "../../assets/Main-img/NewClosedStatus.svg";
import CANCELEDimg from "../../assets/Main-img/NewCanceledStatus.svg";


interface EventData {
  location?: string; // 이벤트 위치
  date?: string; // 표시할 날짜 문자열
  postimgurl?: string; // 포스트 이미지
  poststatus?: string; // 포스트 상태
}

interface MainData {
  regularRun: EventData; // 정규런 데이터
  flashRun: EventData; // 번개런 데이터
  training: EventData; // 훈련 데이터
  event: EventData; // 행사 데이터
  onClick?: () => void // 클릭 이벤트 핸들러
}

const NewMain: React.FC = () => {
  const getStatusImg = (status: string | null | undefined) => {
    switch (status) {
      case "NOW":
        return NOWimg;
      case "CLOSED":
        return CLODESDimg;
      case "CANCELED":
        return CANCELEDimg;
      default:
        return undefined;
    }
  };


  const [maindata, setMaindata] = useState<MainData>({
    regularRun: { location: "없습니다", date: "정규런이" },
    flashRun: { location: "없습니다", date: "번개런이" },
    training: { location: "없습니다", date: "훈련이" },
    event: { location: "없습니다", date: "행사가" },
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFloatingButtonOpen, setIsFloatingButtonOpen] = useState(false);

  const [showFirstButton, setShowFirstButton] = useState(false);
  const [showSecondButton, setShowSecondButton] = useState(false);
  const [showThirdButton, setShowThirdButton] = useState(false);
  const [showFourthButton, setShowFourthButton] = useState(false);

  const navigate = useNavigate();
  const images = [img1, img2, img3, img4];

  const formatDate = (isoDateString?: string): string => {
    if (!isoDateString) return "...";
    const dateObj = new Date(isoDateString);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const weekday = dateObj.toLocaleDateString("ko-KR", { weekday: "long" });
    return `${month}/${day} ${weekday}`;
  };
  
  // 슬라이드 변경 로직
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    const fetchMain = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('accessToken') || 'null');
        const response = await customAxios.get(`/run`, {
          headers: { Authorization: `${token}` },
        });

        if (response.data.isSuccess) {
          const MainStatusMap: Record<string, string> = {
            NOW: "prog",
            CLOSING: "argent",
            CLOSED: "closed",
          };

          const result = response.data.result;
          console.log(response.data)
          console.log(response.data.result.location)
          // 상태를 각 ContentList에 맞게 분리하여 저장
          setMaindata({
            regularRun: {
              location: result.regularRun?.title || "정규런이 없네요",
              date: formatDate(result.regularRun?.date),
              postimgurl: result.regularRun?.postImageUrl,
              poststatus: result.regularRun?.postStatus,
            },
            flashRun: {
              location: result.flashRun?.title || "번개런이 없네요",
              date: formatDate(result.flashRun?.date),
              postimgurl: result.flashRun?.postImageUrl,
              poststatus: result.flashRun?.postStatus,
            },
            training: {
              location: result.trainingRun?.title || "훈련이 없네요",
              date: formatDate(result.trainingRun?.date),
              postimgurl: result.trainingRun?.postImageUrl,
              poststatus: result.trainingRun?.postStatus,
            },
            event: {
              location: result.eventRun?.title || "행사가 없습니다",
              date: formatDate(result.eventRun?.date),
              postimgurl: result.eventRun?.postImageUrl,
              poststatus: result.eventRun?.postStatus,
            },
          });
        } else {
          console.error("데이터를 불러오지 못했습니다.", response.data.responseMessage);
        }
      } catch (error) {
        console.error("API 요청 오류", error);
      }
    };

    fetchMain();
  }, []);

  // 플로팅 버튼 토글
  const toggleFloatingButton = () => {
    setIsFloatingButtonOpen(!isFloatingButtonOpen);
  };

  // 플로팅 버튼 애니메이션
  useEffect(() => {
    if (isFloatingButtonOpen) 
    {
      setShowFirstButton(false);
      setShowSecondButton(false);
      setShowThirdButton(false);
      setShowFourthButton(false);

      setTimeout(() => setShowFourthButton(true), 100);
      setTimeout(() => setShowThirdButton(true), 200);
      setTimeout(() => setShowSecondButton(true), 300);
      setTimeout(() => setShowFirstButton(true), 400);
    } 
    else 
    {
      setShowFirstButton(false);
      setShowSecondButton(false);
      setShowThirdButton(false);
      setShowFourthButton(false);
    }
  }, [isFloatingButtonOpen]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  //그리드 레이아웃에 있는 동그라미 버튼(GridContent)를 눌렀을 시의 동작 수행
  const handleCardClick = () => {
    navigate('/run');
  };

  const handleflashRunMake = () => {
    navigate("/run/make");
  };
  const handleRegularRunMake = () => {
    navigate("/regular/make");
  };
  const handleEventMake = () => {
    navigate("/event");
  };
  const handleTrainingtMake = () => {
    navigate("/training/make");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* 상단바 */}
      <div className="h-[56px]"></div>

      {/* 슬라이드쇼 */}
      <div className="w-[390px] h- max-w-4xl mx-auto m-0">
        <div className="flex justify-center">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full"
          />
        </div>
        <div className="flex w-[390px] h-[40px] justify-center items-center space-x-2 bg-kuDarkGreen">
          {images.map((_, index) => (
            <span
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${
                currentIndex === index ? "bg-white/80" : "bg-white/40"
              }`}
            ></span>
          ))}
        </div>
      </div>

      {/* NewMainCard 그리드 */}
      <div className="grid grid-cols-2 grid-rows-2 gap-x-3 gap-y-6 mt-7 mb-36">
        <div className="cursor-pointer">
        <NewMainCard
          title={maindata?.regularRun.location}
          date={maindata?.regularRun.date}
          statusImg={getStatusImg(maindata.regularRun.poststatus)}
          imageUrl={maindata.regularRun.postimgurl || NewMainImage}
          event_type="정규런"
          path="/regular"
        />
        </div>
        <div className="cursor-pointer">
        <NewMainCard
          title={maindata?.flashRun.location}
          date={maindata?.flashRun.date}
          statusImg={getStatusImg(maindata.flashRun.poststatus)}
          imageUrl={maindata.flashRun.postimgurl || NewMainImage}
          event_type="번개런"
          path="/FlashRun"
        />
        </div>
        <div className="cursor-pointer">
        <NewMainCard
          title={maindata?.training.location}
          date={maindata?.training.date}
          statusImg={getStatusImg(maindata.training.poststatus)}
          imageUrl={maindata.training.postimgurl || NewMainImage}
          event_type="훈련"
          path="/training"
        />
        </div>
        <div className="cursor-pointer">
        <NewMainCard
          title={maindata?.event.location}
          date={maindata?.event.date}
          statusImg={getStatusImg(maindata.event.poststatus)}
          imageUrl={maindata.event.postimgurl || NewMainImage}
          event_type="행사"
          path="/run"
        />
        </div>
      </div>

      {/* 플로팅 버튼 */}
      <button
        onClick={toggleFloatingButton}
        className={`fixed bottom-20 right-4 w-16 h-16 rounded-full bg-kuDarkGreen text-white flex items-center justify-center shadow-lg hover:bg-kuDarkGreen-dark focus:outline-none z-50 transition-transform duration-300 ${
          isFloatingButtonOpen ? "rotate-45" : "rotate-0"
        }`}
      >
        <img
          src={plusBtn}
          alt="플로팅 버튼 아이콘"
          className={`w-8 h-8 transition-transform duration-300 ${
            isFloatingButtonOpen ? "rotate-20" : "rotate-0"
          }`}
        />
      </button>

      {/* 플로팅 버튼이 열렸을 때 나타나는 옵션들 */}
      {isFloatingButtonOpen && (
        <div onClick={() => setIsFloatingButtonOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out flex justify-end items-end p-8 z-40">
          <div onClick={(e) => e.stopPropagation()} className="fixed bottom-40 right-10 flex flex-col space-y-4 pointer-events-auto">
            {/* 첫 번째 버튼 */}
            <button
              className={`w-auto h-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-white text-black font-semibold shadow-lg py-2 px-4 hover:bg-gray-100 transition-all duration-300 ease-out transform ${showFirstButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              onClick={handleflashRunMake}
            >
              번개런 일정 추가하기
            </button>

            {/* 두 번째 버튼 */}
            <button
              className={`w-auto h-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-white text-black font-semibold shadow-lg py-2 px-4 hover:bg-gray-100 transition-all duration-300 ease-out transform ${showSecondButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              onClick={handleRegularRunMake}
            >
              정규런 일정 추가하기
            </button>

            {/* 세 번째 버튼 */}
            <button
              className={`w-auto h-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-white text-black font-semibold shadow-lg py-2 px-4 hover:bg-gray-100 transition-all duration-300 ease-out transform ${showThirdButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              onClick={handleTrainingtMake}
            >
              훈련 일정 추가하기
            </button>

            {/* 세 번째 버튼 */}
            <button
              className={`w-auto h-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-white text-black font-semibold shadow-lg py-2 px-4 hover:bg-gray-100 transition-all duration-300 ease-out transform ${showFourthButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              onClick={handleEventMake}
            >
              행사 일정 추가하기
            </button>
          </div>
        </div>
      )}

      {/* TabNavigationUI */}
      <TabNavigationUI />
    </div>
  );
};

export default NewMain;
