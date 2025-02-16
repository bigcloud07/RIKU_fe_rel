import React from "react";
import BacbBtnimg from "../../assets/BackBtn.svg"
import NewEventCard from "./NewEventCard";
import NewTodayRun from "./NewTodayRun";
import PastRuns from "./PastRuns";
import NavBar from "../NavBar";

const NewFlashRunList: React.FC = () => {

    return(
        <div className="flex flex-col justify-center items-center">
            {/* 상단바 */}
            <div className="relative flex bg-kuDarkGreen w-[375px] h-[56px] text-white text-center text-xl font-semibold justify-center items-center">
            <img src={BacbBtnimg} className="absolute left-[24px]"></img>
            번개런
            </div>

            {/* 오늘의 러닝 */}
            <div className="relative bg-kuDarkGreen w-[375px] h-[268px]">
                <div className="absolute top-0 left-0 w-full h-full grid place-items-center">
                    <div className="w-[114px] h-[32px] bg-white text-kuDarkGreen text-[16px] text-center font-bold grid place-items-center rounded-xl ">오늘의 러닝</div>
                    <div><NewTodayRun/></div>
                </div>
                <div className="absolute flex justify-center top-[268px] rounded-full bg-white/80 w-[8px] h-[8px]">
                </div>
            </div>

            {/* 예정된 러닝 */}
            <div className="relative w-[375px] h-[63px]">
                <div className="absolute left-[20px] top-[22px] text-[20px] font-semibold">예정된 러닝</div>
            </div>
            <div className="flex flex-col space-y-[12px]">
                <NewEventCard/>
                <NewEventCard/>
                <NewEventCard/>
            </div>

            {/* 분리 바 */}
            <div className="w-[375px] h-[8px] bg-kuLightGray mt-[32px]"></div>

            {/* 지난 러닝 */}
            <div className="relative w-[375px] h-[45px]">
                <div className="absolute top-[24px] left-[20px] text-[20px] font-semibold">지난 러닝</div>
            </div>
            <div className="grid grid-cols-3 grid-rows-2 gap-x-[12px] gap-y-[16px] mt-[20px]">
                <PastRuns/>
                <PastRuns/>
                <PastRuns/>
                <PastRuns/>
                <PastRuns/>
                <PastRuns/>
            </div>
            <div className="flex items-center justify-center bg-kuLightGray w-[335px] h-[32px] rounded-xl text-[14px] text-black/60 font-semibold text-center mt-[24px] mb-[56px]">N개 더보기</div>
            <NavBar/>
        </div>
    )
}

export default NewFlashRunList