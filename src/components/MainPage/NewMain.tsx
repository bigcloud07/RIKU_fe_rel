import React, { useEffect, useState,  } from "react";
import { useNavigate } from 'react-router-dom';
import NewMainCard from "./NewMainCard";
import NewMainImage from "../../assets/Main-img/NewMainImage.svg";
import TabNavigationUI from "../TabNavigationUI";
import plusBtn from '../../assets/plus_Icon.svg'; //라이쿠 로고 불러오기
import img1 from "../../assets/Main-img/main-moving-images/1.png";
import img2 from "../../assets/Main-img/main-moving-images/2.png";
import img3 from "../../assets/Main-img/main-moving-images/3.png";
import img4 from "../../assets/Main-img/main-moving-images/4.png";
import TopBarimg from "../../assets/Top-bar.svg"


const NewMain: React.FC = () => {
  const images = [img1, img2, img3, img4];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 슬라이드 변경 로직
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3초 간격으로 변경

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 제거
  }, [images.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const [isFloatingButtonOpen, setIsFloatingButtonOpen] = useState(false);
    
    

    //각 버튼의 개별 상태를 관리하여 순차적 pop-up 효과를 구현
    const [showFirstButton, setShowFirstButton] = useState(false);
    const [showSecondButton, setShowSecondButton] = useState(false);
    const [showThirdButton, setShowThirdButton] = useState(false);
    const [showFourthButton, setShowFourthButton] = useState(false);
    const navigate = useNavigate();

    //그리드 레이아웃에 있는 동그라미 버튼(GridContent)를 눌렀을 시의 동작 수행
    const handleCardClick = () => {
        navigate('/run');
    };
    const handleRunMake = () => {
        navigate('/run/make')
    }

    //플로팅 버튼을 눌렀을 때.. 동작하는 floatingButton
    const toggleFloatingButton = () => {
        setIsFloatingButtonOpen(!isFloatingButtonOpen);
    };

    //플로팅 버튼의 상태가 변경될 때 순차적으로 pop-up 시키는 효과 적용
    useEffect(() => {
    if(isFloatingButtonOpen) {
        // 플로팅 버튼이 열리면 순차적으로 각 버튼을 표시
        setShowFirstButton(false);
        setShowSecondButton(false);
        setShowThirdButton(false);
        setShowFourthButton(false);

        setTimeout(() => setShowFourthButton(true), 100); // 세 번째 버튼(맨 밑 버튼) 100ms 후 표시
        setTimeout(() => setShowThirdButton(true), 200); // 세 번째 버튼(맨 밑 버튼) 100ms 후 표시
        setTimeout(() => setShowSecondButton(true), 300); // 두 번째 버튼 200ms 후 표시
        setTimeout(() => setShowFirstButton(true), 400); // 첫 번째 버튼(맨 위 버튼) 300ms 후 표시
    } else {
        // 플로팅 버튼이 닫힐 때 모든 버튼을 즉시 숨기기
        setShowFirstButton(false);
        setShowSecondButton(false);
        setShowThirdButton(false);
        setShowFourthButton(false);
    }
    }, [isFloatingButtonOpen]); //isFloatingButtonOpen state값이 바뀔 때마다 적용

  return (
    <div className="flex flex-col items-center justify-center">
      

      {/* 상단바 */}
      <div>
        <img src={TopBarimg}></img>
      </div>
      {/* 슬라이드쇼 */}
      <div className="w-[375px] h- max-w-4xl mx-auto m-0">
        {/* 현재 이미지 */}
        <div className="flex justify-center">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full"
          />
        </div>

        {/* 하단 점 */}
        <div className="flex w-[375px] h-[40px] justify-center items-center space-x-2 bg-kuDarkGreen">
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
      <div className="grid grid-cols-2 grid-rows-2 gap-x-3 gap-y-6 mt-7">
        <div className="cursor-pointer">
          <NewMainCard
            title="반포한강공원"
            date="12/24 목요일"
            status="모집중"
            imageUrl={NewMainImage}
            event_type="정규런"
          />
        </div>
        <div className="cursor-pointer">
          <NewMainCard
            title="반포한강공원"
            date="12/24 목요일"
            status="모집중"
            imageUrl={NewMainImage}
            event_type="번개런"
          />
        </div>
        <div className="cursor-pointer">
          <NewMainCard
            title="반포한강공원"
            date="12/24 목요일"
            status="모집중"
            imageUrl={NewMainImage}
            event_type="훈련"
          />
        </div>
        <div className="cursor-pointer">
          <NewMainCard
            title="반포한강공원"
            date="12/24 목요일"
            status="모집중"
            imageUrl={NewMainImage}
            event_type="행사"
          />
        </div>
      </div>
      {/* 플로팅 버튼 */}
      <button
        onClick={toggleFloatingButton}
        className={`fixed bottom-20 right-4 w-16 h-16 rounded-full bg-kuDarkGreen text-white flex items-center justify-center shadow-lg hover:bg-kuDarkGreen-dark focus:outline-none z-50 transition-transform duration-300 ${isFloatingButtonOpen ? 'rotate-45' : 'rotate-0'}`}
      >
        <img
          src={plusBtn}
          alt='플로팅 버튼 아이콘'
          className={`w-8 h-8 transition-transform duration-300 ${isFloatingButtonOpen ? 'rotate-20' : 'rotate-0'}`}
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
              onClick={handleRunMake}
            >
              번개런 일정 추가하기
            </button>

            {/* 두 번째 버튼 */}
            <button
              className={`w-auto h-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-white text-black font-semibold shadow-lg py-2 px-4 hover:bg-gray-100 transition-all duration-300 ease-out transform ${showSecondButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
            >
              정규런 일정 추가하기
            </button>

            {/* 세 번째 버튼 */}
            <button
              className={`w-auto h-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-white text-black font-semibold shadow-lg py-2 px-4 hover:bg-gray-100 transition-all duration-300 ease-out transform ${showThirdButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
            >
              훈련 일정 추가하기
            </button>

            {/* 세 번째 버튼 */}
            <button
              className={`w-auto h-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-white text-black font-semibold shadow-lg py-2 px-4 hover:bg-gray-100 transition-all duration-300 ease-out transform ${showFourthButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
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
