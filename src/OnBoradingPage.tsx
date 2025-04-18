import rikulogo from "./assets/onboarding_logo.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import backgroundVideo from "./assets/onboard_video_no_sound.mp4";

function OnbordingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  //로그인 세션이 있으면 메인페이지로 연결
  // useEffect(() => {
  //     const token = localStorage.getItem('accessToken');

  //     if (token) {
  //         // 이미 로그인 되어 있는 경우
  //         navigate('/tab/main');
  //     }

  // }, []);
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-white">
      {/* 배경 비디오 */}
      <video
        src={backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 w-auto h-screen max-h-[1000px] transform -translate-x-1/2 -translate-y-1/2 z-0 object-cover"
      />

      {/* 내용 및 버튼 */}
      <div className="z-10 flex flex-col items-center justify-center">
        <div className="mt-[130px]">
          <img src={rikulogo} alt="로고" />
        </div>
        <div className="flex flex-col">
          <button
            onClick={handleLoginClick}
            className="w-[327px] h-[52px] rounded-[10px] bg-kuWarmGray text-black font-bold mt-[90px] 
             hover:bg-kuDarkBeige hover:text-white transition-colors duration-300"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnbordingPage;
