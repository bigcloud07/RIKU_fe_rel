import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import BacbBtnimg from "../../assets/BackBtn.svg";
import NewEventCard from "./NewEventCard";
import NewTodayRun from "./NewTodayRun";
import PastRuns from "./PastRuns";
import NavBar from "../NavBar";

// Swiper 관련
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import customAxios from "../../apis/customAxios";

interface RunData {
    id: number;
    title: string;
    date: string;
    participants: number;
    postStatus: "NOW" | "CANCELED" | "CLOSED";
    postImageUrl: string;
}

const NewTrainingList: React.FC = () => {
    const [todayRuns, setTodayRuns] = useState<RunData[]>([]);
    const [upcomingRuns, setUpcomingRuns] = useState<RunData[]>([]);
    const [pastRuns, setPastRuns] = useState<RunData[]>([]);
    const navigate = useNavigate();

    // const prevRef = useRef<HTMLDivElement | null>(null);
    // const nextRef = useRef<HTMLDivElement | null>(null);
    const paginationRef = useRef<HTMLDivElement | null>(null); // ✅ pagination element ref

    const handleBackHome = () => {
        navigate("/tab/main");
    };




    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("accessToken") || "null");

        const fetchRunData = async () => {
            try {
                const response = await customAxios.get(`/run/training`, {
                    headers: { Authorization: `${token}` },
                });

                const result = response.data.result;

                console.log("✅ 서버 응답:", result);



                setTodayRuns(result.todayRuns ?? []);
                setUpcomingRuns(result.upcomingRuns ?? []);
                setPastRuns(result.pastRuns ?? []);
                console.log("📦 upcomingRuns 배열", result.upcomingRuns);
            } catch (error) {
                console.error("Error fetching run data:", error);
            }
        };

        fetchRunData();
    }, []);







    return (
        <div className="flex flex-col justify-center items-center">
            {/* 상단바 */}
            <div className="relative flex bg-kuDarkGreen w-[430px] h-[56px] text-white text-xl font-semibold justify-center items-center">
                <img
                    src={BacbBtnimg}
                    className="absolute left-[24px] cursor-pointer"
                    alt="Back"
                    onClick={handleBackHome}
                />
                훈련
            </div>

            {/* 오늘의 러닝 */}
            <div className="relative bg-kuDarkGreen w-[430px] min-h-[268px]">
                <div className="w-full flex flex-col items-center pt-2">
                    <div className="w-[114px] h-[32px] bg-white text-kuDarkGreen text-[16px] font-bold rounded-xl flex items-center justify-center">
                        오늘의 훈련
                    </div>

                    {todayRuns.length > 0 ? (
                        <>
                            {/* ✅ Swiper 컴포넌트 (기존 코드 그대로 유지) */}
                            <div className="relative w-[335px] mt-3">
                                <Swiper
                                    modules={[Pagination, Navigation]} // Swiper 모듈 활성화
                                    pagination={{
                                        el: ".custom-pagination", // ✅ 클래스 기반으로 지정
                                        clickable: true,
                                    }}
                                    spaceBetween={16}
                                    slidesPerView={1}
                                >
                                    {todayRuns.map((run) => {
                                        const utcDate = new Date(run.date);
                                        const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
                                        const formattedDate = format(kstDate, "MM/dd EEEE", { locale: ko });
                                        const formattedTime = format(kstDate, "HH:mm");

                                        return (
                                            <SwiperSlide key={run.id}>
                                                <NewTodayRun
                                                    key={run.id}
                                                    location={run.title}
                                                    postimg={run.postImageUrl}
                                                    runDate={run.date}
                                                    runState={run.postStatus ?? "NOW"}
                                                    participants={run.participants}
                                                    date={formattedDate}
                                                    time={formattedTime}
                                                    onClick={() => navigate(`/run/regular/${run.id}`)}
                                                />
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>

                                {/* ✅ Swiper pagination dot 표시 영역 */}
<div
  ref={paginationRef}
  className="custom-pagination h-[20px] mb-[12px] mt-[12px] flex justify-center items-center
    [&>.swiper-pagination-bullet]:bg-white
    [&>.swiper-pagination-bullet-active]:bg-white
    [&>.swiper-pagination-bullet]:mx-[4px]"
></div>
                            </div>
                        </>
                    ) : (
                        // ✅ 오늘의 러닝이 없을 경우
                        <div className="flex flex-col items-center justify-center w-[335px] h-[200px] bg-kuLightGray rounded-lg mt-4">
                            <p className="text-[18px] font-semibold text-black">현재 진행중인 훈련이 없습니다.</p>

                        </div>
                    )}
                </div>
            </div>



            {/* 예정된 러닝 */}
            <div className="w-[375px] mt-4">
                <h2 className="text-[20px] font-semibold ml-5 ">예정된 러닝</h2>
                <div className="flex flex-col space-y-[12px] mt-[16px] ml-[20px]">
                    {upcomingRuns.map((run) => {
                        const utcDate = new Date(run.date);
                        const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
                        const formattedDate = format(kstDate, "MM/dd EEEE", { locale: ko });
                        const formattedTime = format(kstDate, "HH:mm");

                        return (
                            <NewEventCard
                                key={run.id}
                                location={run.title}
                                postimg={run.postImageUrl}
                                runDate={run.date}
                                runState={run.postStatus ?? "NOW"}
                                participants={run.participants}
                                date={formattedDate}
                                time={formattedTime}
                                onClick={() => navigate(`/run/training/${run.id}`)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* 구분선 */}
            <div className="w-[375px] h-[8px] bg-kuLightGray mt-[32px]"></div>

            {/* 지난 러닝 */}
            <div className="w-[375px] mt-4 mb-[100px]">
                <h2 className="text-[20px] font-semibold ml-5">지난 러닝</h2>
                <div className="grid grid-cols-3 grid-rows-2 gap-x-[12px] gap-y-[16px] mt-[20px] px-3">
                    {pastRuns.map((run) => (


                        <PastRuns
                            key={run.id}
                            title={run.title}
                            date={format(new Date(run.date), "yyyy.MM.dd")}
                            peoplecount={String(run.participants)}
                            postimg={run.postImageUrl}
                            location=""
                            runDate=""
                            runState=""
                        />
                    ))}
                </div>
            </div>

            <NavBar />
        </div>
    );
};

export default NewTrainingList;
