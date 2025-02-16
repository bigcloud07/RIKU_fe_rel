import React from "react";
import peopleimg from "../../assets/people_darkgreen.svg"
import cardimg from "../../assets/cardimg.svg"

const NewTodayRun:React.FC = () => {
    return(
        <div className="flex flex-col relative w-[335px] h-[200px] bg-kuLightGray rounded-lg">
            <div className="absolute top-[14px] left-[16px] text-[15px]">date</div>
            <div className="absolute top-[20px] left-[90px]"><img src={peopleimg}/></div>
            <div className="absolute top-[17px] left-[113px] text-[12px]">11 / 20</div>
            <div className="absolute top-[35px] left-[16px] text-[20px]">title</div>
            <div className="absolute top-[79px] left-[16px] justify-center"><img src={cardimg}/></div>
        </div>
    )
}

export default NewTodayRun