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

const NewFlashRunList: React.FC = () => {
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
                const response = await customAxios.get(`/run/regular`, {
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
            <div className="relative flex bg-kuDarkGreen w-[375px] h-[56px] text-white text-xl font-semibold justify-center items-center">
                <img
                    src={BacbBtnimg}
                    className="absolute left-[24px] cursor-pointer"
                    alt="Back"
                    onClick={handleBackHome}
                />
                정규런
            </div>

            {/* 오늘의 러닝 */}
            <div className="relative bg-kuDarkGreen w-[375px] min-h-[268px]">
                <div className="w-full flex flex-col items-center pt-2">
                    <div className="w-[114px] h-[32px] bg-white text-kuDarkGreen text-[16px] font-bold rounded-xl flex items-center justify-center">
                        오늘의 정규런
                    </div>

                    {todayRuns.length > 0 && (
                        <>
                            <div className="relative w-[335px] mt-3">
                                
                                {/* <div
                                    ref={prevRef}
                                    className="swiper-button-prev-custom absolute left-[-20px] top-[50%] z-10 cursor-pointer text-white text-2xl font-bold"
                                >
                                    ←
                                </div>
                                <div
                                    ref={nextRef}
                                    className="swiper-button-next-custom absolute right-[-20px] top-[50%] z-10 cursor-pointer text-white text-2xl font-bold"
                                >
                                    →
                                </div> */}

                                {/* Swiper */}
                                <Swiper
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    pagination={{
                                        clickable: true,
                                        el: paginationRef.current ?? undefined, // ✅ ref를 el로 사용
                                    }}
                                    // navigation={{
                                    //     prevEl: prevRef.current ?? undefined,
                                    //     nextEl: nextRef.current ?? undefined,
                                    // }}
                                    onBeforeInit={(swiper) => {
                                        // if (typeof swiper.params.navigation !== "boolean") {
                                        //     swiper.params.navigation.prevEl = prevRef.current;
                                        //     swiper.params.navigation.nextEl = nextRef.current;
                                        // }
                                        if (typeof swiper.params.pagination !== "boolean") {
                                            swiper.params.pagination.el = paginationRef.current;
                                        }
                                    }}
                                    modules={[Pagination]}
                                    
                                    // 주석 처리 한 부분들은 좌우 관련 버튼 부분임
                                >
                                    {todayRuns.map((run) => {
                                        const dateObj = new Date(run.date);
                                        const formattedDate = format(dateObj, "MM/dd EEEE", {
                                            locale: ko,
                                        });
                                        const formattedTime = format(dateObj, "HH:mm");

                                        return (
                                            <SwiperSlide key={run.id}>
                                                <div className="">
                                                    <NewTodayRun
                                                        key={run.id}
                                                        location={run.title}
                                                        postimg={run.postImageUrl}
                                                        runDate={run.date}
                                                        runState={run.postStatus ?? "NOW"}
                                                        participants={run.participants}
                                                        date={formattedDate}
                                                        time={formattedTime}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>

                                {/* ✅ 실제 점(dot) 위치 */}
                                <div
                                    ref={paginationRef}
                                    className="mb-[12px] mt-[12px] flex justify-center"
                                />
                            </div>

                            {/* ✅ dot 스타일 */}
                            <style>
                                {`
                .swiper-pagination-bullet {
                  background-color: rgba(255, 255, 255, 0.4);
                  width: 8px;
                  height: 8px;
                  margin: 0 6px;
                  border-radius: 9999px;
                }

                .swiper-pagination-bullet-active {
                  background-color: white;
                }
              `}
                            </style>
                        </>
                    )}
                </div>
            </div>



            {/* 예정된 러닝 */}
            <div className="w-[375px] mt-4">
                <h2 className="text-[20px] font-semibold ml-5 ">예정된 러닝</h2>
                <div className="flex flex-col space-y-[12px] mt-[16px] ml-[20px]">
                    {upcomingRuns.map((run) => {
                        const dateObj = new Date(run.date);

                        const formattedDate = format(dateObj, "MM/dd EEEE", { locale: ko }); // → 12/24 목요일
                        const formattedTime = format(dateObj, "HH:mm"); // → 18:00

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

export default NewFlashRunList;
