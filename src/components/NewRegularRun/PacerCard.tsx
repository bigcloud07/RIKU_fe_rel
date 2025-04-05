import React from 'react';

interface Pacer {
    group: string;
    pacerName: string;
    distance: string;
    pace: string;
    profileImg?: string | null;
}

interface PacerCardProps {
    pacers: Pacer[];
}

const PacerCard: React.FC<PacerCardProps> = ({ pacers }) => {
    return (
        <div className="w-[335px] rounded-xl overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-[60px_1.5fr_1fr_1fr] gap-x-2 gap-y-2 text-white text-center text-sm font-semibold">
                <div className="p-3 rounded-[10px] bg-[#F5F5F5]"></div>
                <div className="p-3 rounded-[10px] bg-kuDarkGreen">페이서</div>
                <div className="p-3 rounded-[10px] bg-kuDarkGreen">거리</div>
                <div className="p-3 rounded-[10px] bg-kuDarkGreen">페이스</div>
            </div>

            {/* 페이서 목록 */}
            {pacers.map((pacer, idx) => (
                <div
                    key={idx}
                    className={`grid grid-cols-[60px_1.5fr_1fr_1fr] gap-x-2 gap-y-2 text-center items-center text-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-white'
                        }`}
                >
                    {/* 그룹 */}
                    <div
                        className={`p-3 font-semibold rounded-[10px] text-white mt-1 ${idx === 0
                            ? 'bg-kuDarkGreen bg-opacity-100'
                            : idx === 1
                                ? 'bg-kuDarkGreen bg-opacity-75'
                                : idx === 2
                                    ? 'bg-kuDarkGreen bg-opacity-50'
                                    : idx === 3
                                        ? 'bg-kuDarkGreen bg-opacity-30'
                                        : idx === 4
                                            ? 'bg-kuDarkGreen bg-opacity-10'
                                            : 'bg-kuDarkGreen bg-opacity-5' // 기본값
                            } rounded-l-xl`}
                    >
                        {pacer.group}
                    </div>

                    {/* 페이서 이름 */}
                    <div className="p-3 flex items-center justify-center gap-2 rounded-[10px] mt-1">
                        {pacer.profileImg ? (
                            <img
                                src={pacer.profileImg}
                                alt={`${pacer.pacerName} 프로필`}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[#844E4E] text-white text-xs flex items-center justify-center font-bold">
                                {pacer.pacerName.charAt(0)}
                            </div>
                        )}
                        <span className="text-gray-800 font-medium">{pacer.pacerName}</span>
                    </div>

                    {/* 거리 */}
                    <div className="p-3 font-bold text-kuDarkGreen">{pacer.distance}</div>

                    {/* 페이스 */}
                    <div className="p-3 font-bold text-kuDarkGreen">{pacer.pace}</div>
                </div>
            ))}
        </div>
    );
};

export default PacerCard;
