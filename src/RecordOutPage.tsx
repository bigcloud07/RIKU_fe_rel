import React from "react"
import testimg from "./assets/RecordPage/test_img.jpeg"
import RIKUwhite from "./assets/RecordPage/riku_text_white.svg"
import RIKUcowWhite from "./assets/RecordPage/riku_cow_white.svg"

const RecordOutPage: React.FC = () => {
    return (
        <div>
            <div className="relative w-[300px] h-[300px]">
                {/* 배경 이미지 */}
                <img src={testimg} className="w-full h-full object-cover" />

                {/* 상단 중앙 정렬된 이미지들 */}
                <div className="absolute top-[7px] left-1/2 transform -translate-x-1/2 flex">
                    <img src={RIKUwhite} className="h-[12px]" />
                    <img src={RIKUcowWhite} className="h-[12px]" />
                </div>

                {/* 하단 왼쪽 정보 텍스트 */}
                <div className="absolute bottom-[15px] left-[10px]">
                    <div className="flex flex-col text-white text-xs leading-none">
                        <div className="flex flex-col">
                            <span className="text-[8px] leading-none">DISTANCE</span>
                            <span className="font-semibold text-[20px] leading-none">04.23 km</span>
                        </div>
                        <div className="flex flex-col mt-[4px]">
                            <span className="text-[8px] leading-none">PACE</span>
                            <span className="font-semibold text-[20px] leading-none">5"30'</span>
                        </div>
                        <div className="flex flex-col mt-[4px]">
                            <span className="text-[8px] leading-none">TIME</span>
                            <span className="font-semibold text-[20px] leading-none">01:32:33</span>
                        </div>
                    </div>
                </div>
                {/* 하단 우측 정보 텍스트 */}
                <div className="absolute bottom-[15px] right-[10px] leading-none">
                    <div className="flex flex-col text-white text-right">
                        <span className="font-bold text-[12px] mb-[3px]">2025.04.14</span>
                        <span className="font-bold text-[12px]">반포한강공원</span>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default RecordOutPage