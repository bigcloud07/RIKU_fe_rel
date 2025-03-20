import React from "react";
import peopleimg from "../../assets/people_darkgreen.svg"
import cardimg from "../../assets/cardimg.svg"

interface TodayRunData {
    title: string;
    date: string;
    participants: string;
    postImageUrl: string;
}

const NewTodayRun:React.FC<TodayRunData> = ({title, date, participants, postImageUrl}) => {
    return(
        <div className="flex flex-col relative w-[335px] h-[200px] bg-kuLightGray rounded-lg">
            <div className="absolute top-[14px] left-[16px] text-[15px]">{date}</div>
            <div className="absolute top-[20px] left-[90px]"><img src={peopleimg}/></div>
            <div className="absolute top-[17px] left-[113px] text-[12px]">{participants}</div>
            <div className="absolute top-[35px] left-[16px] text-[20px]">{title}</div>
            <div className="absolute top-[79px] left-[16px] justify-center"><img src={postImageUrl}/></div>
        </div>
    )
}

export default NewTodayRun