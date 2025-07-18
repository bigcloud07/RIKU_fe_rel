import React, { useState, useImperativeHandle, forwardRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import customAxios from "../../apis/customAxios";
import peopleimg from "../../assets/people_darkgreen.svg";

interface User {
  userId: number;
  userName: string;
  userProfileImg?: string | null;
  status: "ATTENDED" | "PENDING";
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

    const handleToggle = (userId: number) => {
      const updated = users.map((user) =>
        user.userId === userId
          ? {
              ...user,
              status: user.status === "ATTENDED" ? "PENDING" : "ATTENDED",
            }
          : user
      );
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
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <img src={peopleimg} alt="체크 아이콘" className="w-[24px] h-[17px]" />
            <span className="text-[16px] font-semibold">
              <span className="text-kuDarkGreen">{users.filter((u) => u.status === "ATTENDED").length}</span> / {users.length}
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
              className={`text-[12px] w-[72px] h-[24px] font-semibold rounded-[10px] ${editMode ? "bg-kuDarkGreen text-white" : "bg-kuLightGray text-kuDarkGray"}`}
            >
              {editMode ? "명단 저장" : "명단 수정"}
            </button>
          )}
        </div>

        {users.map((user, index) => {
          const isAttended = user.status === "ATTENDED";
          return (
            <div key={user.userId} className="flex items-center gap-3 w-[335px] h-[56px] px-4 py-2.5 rounded-lg bg-[#F0F4DD]">
              <div className="w-5 text-center text-gray-500 font-semibold">{index + 1}</div>
              <div className="w-10 h-10 rounded-full bg-gray-400 text-white font-bold flex items-center justify-center overflow-hidden">
                {user.userProfileImg ? (
                  <img src={user.userProfileImg} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  user.userName?.charAt(0) || "?"
                )}
              </div>
              <div className="flex-1 text-left">{user.userName}</div>
              {editMode ? (
                <div className="cursor-pointer" onClick={() => handleToggle(user.userId)}>
                  {isAttended ? (
                    <FaCheckCircle size={24} color="#4CAF50" />
                  ) : (
                    <div className="w-[24px] h-[24px] border border-kuDarkGreen rounded-full"></div>
                  )}
                </div>
              ) : isAttended ? (
                <FaCheckCircle size={24} color="#4CAF50" />
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }
);

export default EditableAttendanceList;
