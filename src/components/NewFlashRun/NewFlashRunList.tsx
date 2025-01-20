import React from "react";
import BacbBtnimg from "../../assets/BackBtn.svg"
import NewEventCard from "./NewEventCard";
import NewTodayRun from "./NewTodayRun";
import PastRuns from "./PastRuns";

const NewFlashRunList: React.FC = () => {

    return(
        <div className="flex flex-col justify-center items-center">
            {/* 상단바 */}
            <div className="relative flex bg-kuDarkGreen w-[375px] h-[56px] text-white text-center text-xl font-semibold justify-center items-center">
            <img src={BacbBtnimg} className="absolute left-5"></img>
            번개런
            </div>

            {/* 오늘의 러닝 */}
            <div className="relative bg-kuDarkGreen w-[375px] h-[268px]">
                <div className="absolute top-0 left-0 w-full h-full grid place-items-center">
                    <div className="w-[114px] h-[32px] bg-white text-kuDarkGreen text-[16px] text-center font-bold grid place-items-center rounded-xl ">오늘의 러닝</div>
                    <div><NewTodayRun/></div>
                </div>
            </div>

            {/* 예정된 러닝 */}
            <div className="text-[20px] font-bold">예정된 러닝</div>
            <div className="flex flex-col space-y-[12px]">
                <NewEventCard/>
                <NewEventCard/>
                <NewEventCard/>
            </div>

            {/* 분리 바 */}
            <div className="w-[375px] h-[8px] bg-kuLightGray mt-[32px]"></div>

            {/* 지난 러닝 */}
            <div>지난 러닝</div>
            <div className="grid grid-cols-3 grid-rows-2 gap-4">
                <PastRuns/>
                <PastRuns/>
                <PastRuns/>
                <PastRuns/>
                <PastRuns/>
                <PastRuns/>
            </div>
        </div>
    )
}

export default NewFlashRunList