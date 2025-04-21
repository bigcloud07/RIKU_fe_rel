import React from "react";

interface Participant {
  userId: number;
  userName: string;
  userProfileImg?: string | null;
  status: "ATTENDED" | "PENDING" | string;
}

interface GroupedParticipants {
  group: string;
  participants: Participant[];
}

interface AttendanceListProps {
  groupedParticipants: GroupedParticipants[];
}

const AttendanceList: React.FC<AttendanceListProps> = ({ groupedParticipants }) => {
  return (
    <div className="flex flex-col gap-3 p-5">
      {groupedParticipants.map((group) =>
        group.participants.length === 0 ? (
          <div key={group.group} className="flex items-start gap-2.5">
            <div className="w-[30px] font-bold text-gray-600 pt-2">{group.group}</div>
            <div className="text-sm text-gray-400">참가자가 없습니다.</div>
          </div>
        ) : (
          group.participants.map((user, index) => {
            const backgroundColor =
              user.status === "ATTENDED"
                ? "bg-[#F0F4DD]"
                : user.status === "PENDING"
                ? "bg-[#F0F4DD]"
                : "bg-[#ECEBE4]";

            return (
              <div key={user.userId || `user-${index}`} className="flex items-start">
                {/* 왼쪽 그룹명 (첫 번째 참가자에만 표시) */}
                {index === 0 ? (
                  <div className="w-[30px] font-bold text-gray-600 pt-2 m">{group.group}</div>
                ) : (
                  <div className="w-[30px]" />
                )}

                {/* 참가자 박스 */}
                <div
                  className={`flex items-center gap-2.5 w-[288px] h-[52px] px-3 py-2 rounded-lg text-base font-medium ${backgroundColor}`}
                >
                  {/* 프로필 이미지 또는 이니셜 */}
                  <div className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center bg-gray-400 text-white text-sm font-bold">
                    {user.userProfileImg ? (
                      <img
                        src={user.userProfileImg}
                        alt={`${user.userName} profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{user.userName?.charAt(0) || "?"}</span>
                    )}
                  </div>

                  {/* 이름 */}
                  <div className="flex-1 ml-1 text-left text-[14px]">{user.userName}</div>

                  {/* 출석 아이콘 (ATTENDED일 때만 표시) */}
                  {user.status === "ATTENDED" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#4CAF50"
                      viewBox="0 0 24 24"
                      width="20px"
                      height="20px"
                    >
                      <path d="M20.29 5.3a1 1 0 0 0-1.41 0l-9.17 9.17-3.17-3.17a1 1 0 1 0-1.41 1.41l4 4a1 1 0 0 0 1.41 0l10-10a1 1 0 0 0 0-1.41z" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })
        )
      )}
    </div>
  );
};

export default AttendanceList;
