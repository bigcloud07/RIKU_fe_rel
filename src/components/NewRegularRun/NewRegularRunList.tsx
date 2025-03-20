import React, { useEffect, useState } from "react";
import axios from "axios";
import BacbBtnimg from "../../assets/BackBtn.svg";
import NewEventCard from "./NewEventCard";
import NewTodayRun from "./NewTodayRun";
import PastRuns from "./PastRuns";
import NavBar from "../NavBar";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import customAxios from "../../apis/customAxios";

interface RunData {
    id: number;
    title: string;
    date: string;
    participants: number;
    postStatus: "NOW" | "CANCELED" | "CLOSED";
    postImageUrl: string;
}

interface ApiResponse {
    todayRuns: RunData[];
    upcomingRuns: RunData[];
    pastRuns: RunData[];
}

const NewRegularRunList: React.FC = () => {
    const [todayRuns, setTodayRuns] = useState<RunData[]>([]);
    const [upcomingRuns, setUpcomingRuns] = useState<RunData[]>([]);
    const [pastRuns, setPastRuns] = useState<RunData[]>([]);
    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate('/tab/main');
    };

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('accessToken') || 'null');

        const fetchRunData = async () => {
            try {
                const response = await customAxios.get(`/run/regular`, {
                    headers: { Authorization: `${token}` },
                  });
                  setTodayRuns(response.data.todayRuns || []);
                  setUpcomingRuns(response.data.upcomingRuns || []);
                  setPastRuns(response.data.pastRuns || []);
                  
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
                <img src={BacbBtnimg} className="absolute left-[24px] cursor-pointer" alt="Back" onClick={handleBackHome} />
                정규런
            </div>

            {/* 오늘의 러닝 (슬라이드 적용) */}
            <div className="relative bg-kuDarkGreen w-[375px] h-[268px]">
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center">
                    <div className="w-[114px] h-[32px] bg-white text-kuDarkGreen text-[16px] text-center font-bold rounded-xl flex items-center justify-center">오늘의 러닝</div>
                    <Swiper spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }} modules={[Pagination]}>
                        {todayRuns.map((run) => (
                            <SwiperSlide key={run.id}>
                                <NewTodayRun title={run.title} date={run.date} participants={run.participants} postImageUrl={run.postImageUrl} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* 예정된 러닝 */}
            <div className="w-[375px] mt-4">
                <h2 className="text-[20px] font-semibold ml-5">예정된 러닝</h2>
                <div className="flex flex-col space-y-[12px]">
                    {upcomingRuns.map((run) => (
                        <NewEventCard key={run.id} location={run.title} postimg={run.postImageUrl} runDate={run.date} runState={run.postStatus} />
                    ))}
                </div>
            </div>

            {/* 분리 바 */}
            <div className="w-[375px] h-[8px] bg-kuLightGray mt-[32px]"></div>

            {/* 지난 러닝 */}
            <div className="w-[375px] mt-4">
                <h2 className="text-[20px] font-semibold ml-5">지난 러닝</h2>
                <div className="grid grid-cols-3 grid-rows-2 gap-x-[12px] gap-y-[16px] mt-[20px]">
                    {pastRuns.map((run) => (
                        <PastRuns key={run.id} title={run.title} date={run.date} participants={run.participants} postImageUrl={run.postImageUrl} />
                    ))}
                </div>
            </div>
            
            <NavBar />
        </div>
    );
};

export default NewRegularRunList;