import React from "react";
import openimg from "../../assets/Main-img/NewOpenStatus.svg"
import cardimg from "../../assets/cardimg.svg"
import peopleimg from "../../assets/people_darkgreen.svg"

interface EventCardProps {
    location : string,
    postimg : string,
    runDate : string,
    runState : string,
    onClick? : () => void,
}

const NewEventCard : React.FC<EventCardProps> = ({ location, postimg, runDate, runState }) => {
    return(
        <div className="flex flex-col relative w-[335px] h-[224px] bg-kuLightGray rounded-lg">
            <img src={openimg} className="w-[50px] h-[20px] absolute top-[14px] left-[14px]"/>
            <div className="absolute top-[38px] left-[16px] text-[15px]">date | time</div>
            <div className="absolute top-[20px] left-[265px]"><img src={peopleimg}/></div>
            <div className="absolute top-[17px] left-[285px] text-[12px]">{runDate}</div>
            <div className="absolute top-[59px] left-[16px] text-[20px]">{location}</div>
            <div className="absolute top-[103px] left-[16px] justify-center"><img src={postimg}/></div>
        </div>
    )
}

export default NewEventCard   