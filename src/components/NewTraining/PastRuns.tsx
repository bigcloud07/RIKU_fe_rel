import React from "react";
import sampleimg from "../../assets/pastrunsample.svg"
import peopleimg from "../../assets/people_darkgreen.svg"

interface PastRunsProps {
    location : string,
    postimg : string,
    runDate : string,
    runState : string,
    date : string,
    peoplecount : string,
    title : string,
    onClick? : () => void,
}

const PastRuns:React.FC<PastRunsProps> = ({date, peoplecount, title}) => {
    return(
        <div className="relative w-[103.05px] h-[152px] bg-kuLightGray rounded-xl">
            <div className="absolute top-0"><img src={sampleimg}/></div>
            <div className="absolute top-[66px] w-[103px] h-[88px] rounded-xl bg-kuLightGray">
                <div className="relative">
                    <div className="absolute top-[10px] left-[10px] text-[10px] font-semibold">{date}</div>
                    <div className="absolute top-[28px] left-[10px] text-[10px] w-[14.12px] h-[10px]"><img src={peopleimg}/></div>
                    <div className="absolute top-[26px] left-[28.59px] text-[10px]">{peoplecount}</div>
                    <div className="absolute top-[42px] left-[10px] text-[12px] font-bold">{title}</div>
                </div>
            </div>
        </div>
    )
}

export default PastRuns