import React, { useState, useImperativeHandle, forwardRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import customAxios from "../../apis/customAxios";
import peopleimg from "../../assets/people_darkgreen.svg";

interface User {
  userId: number;
  userName: string;
  userProfileImg?: string | null;
  status: "ATTENDED" | "PENDING" | "ABSENT"; 
  canEdit: string;
}

export interface EditableAttendanceListHandle {
  saveAttendance: () => Promise<void>;
}

interface EditableAttendanceListProps {
  postId: string;
  runType: string;
  users: User[];
  onUsersChange: (newUsers: User[]) => void;
  onSaveComplete?: () => void;
  canEdit?: boolean;
  postStatus?: string;
  postDate?: string;
}

const EditableAttendanceList = forwardRef<EditableAttendanceListHandle, EditableAttendanceListProps>(
  ({ postId, runType, users, onUsersChange, onSaveComplete, canEdit, postStatus, postDate }, ref) => {
    const [editMode, setEditMode] = useState(false);

    // ✅ 3단계 순환 토글: ATTENDED → ABSENT → PENDING → ATTENDED
    const handleToggle = (userId: number) => {
      const updated = users.map((user) => {
        if (user.userId !== userId) return user;

        let newStatus: User["status"];
        if (user.status === "ATTENDED") newStatus = "ABSENT";
        else if (user.status === "ABSENT") newStatus = "PENDING";
        else newStatus = "ATTENDED";

        return { ...user, status: newStatus };
      });
      onUsersChange(updated);
    };

    const handleSave = async () => {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");

      const payload = users.map((user) => ({
        userId: user.userId,
        isAttend: user.status === "ATTENDED",
      }));

      try {
        const response = await customAxios.patch(
          `/run/${runType}/post/${postId}/manual-attend`,
          payload,
          { headers: { Authorization: `${token}` } }
        );

        if (response.data.isSuccess) {
          alert("명단이 저장되었습니다.");
          setEditMode(false);
          if (onSaveComplete) onSaveComplete();
        } else {
          alert(response.data.responseMessage);
        }
      } catch (err) {
        alert("저장 중 오류가 발생했습니다.");
      }
    };

    useImperativeHandle(ref, () => ({
      saveAttendance: handleSave,
    }));

    return (
      <div className="flex flex-col p-5 gap-3">
        {/* 상단 인원 수 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <img src={peopleimg} alt="체크 아이콘" className="w-[24px] h-[17px]" />
            <span className="text-[16px] font-semibold">
              <span className="text-kuDarkGreen">
                {users.filter((u) => u.status === "ATTENDED").length}
              </span>{" "}
              / {users.length}
            </span>
          </div>

          {canEdit && (
            <button
              onClick={() => {
                if (!editMode) {
                  if (postStatus === "CLOSED" || postStatus === "CANCELED") {
                    alert("출석이 종료되어 명단 수정이 불가능합니다.");
                    return;
                  }
                  if (postDate) {
                    const now = new Date();
                    const postKST = new Date(new Date(postDate).getTime() + 9 * 60 * 60 * 1000);
                    if (now < postKST) {
                      alert("아직 명단 수정을 할 수 없습니다.");
                      return;
                    }
                  }
                }
                editMode ? handleSave() : setEditMode(true);
              }}
              className={`text-[12px] w-[72px] h-[24px] font-semibold rounded-[10px] ${
                editMode
                  ? "bg-kuDarkGreen text-white"
                  : "bg-kuLightGray text-kuDarkGray"
              }`}
            >
              {editMode ? "명단 저장" : "명단 수정"}
            </button>
          )}
        </div>

        {/* 유저 목록 */}
        {users.map((user, index) => {
          const backgroundClass =
            user.status === "ATTENDED"
              ? "bg-[#F0F4DD]" // 연두색
              : user.status === "ABSENT"
              ? "bg-[#ECEBE4]"
              : "bg-[#F0F4DD]"

          return (
            <div
              key={user.userId}
              className={`flex items-center gap-3 w-[335px] h-[56px] px-4 py-2.5 rounded-lg ${backgroundClass}`}
            >
              {/* 순번 */}
              <div className="w-5 text-center text-gray-500 font-semibold">{index + 1}</div>

              {/* 프로필 */}
              <div className="w-10 h-10 rounded-full bg-gray-400 text-white font-bold flex items-center justify-center overflow-hidden">
                {user.userProfileImg ? (
                  <img src={user.userProfileImg} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  user.userName?.charAt(0) || "?"
                )}
              </div>

              {/* 이름 */}
              <div className="flex-1 text-left">{user.userName}</div>

              {/* 상태 아이콘 */}
              {editMode ? (
                <div className="cursor-pointer" onClick={() => handleToggle(user.userId)}>
                  {user.status === "ATTENDED" ? (
                    <FaCheckCircle size={24} color="#4CAF50" />
                  ) : user.status === "PENDING" ? (
                    <div className="w-[24px] h-[24px] border border-kuDarkGreen rounded-full"></div>
                  ) : null /* ABSENT는 아이콘 없음 */}
                </div>
              ) : user.status === "ATTENDED" ? (
                <FaCheckCircle size={24} color="#4CAF50" />
              ) : null /* ABSENT와 PENDING은 아이콘 없음 */}
            </div>
          );
        })}
      </div>
    );
  }
);

export default EditableAttendanceList;
