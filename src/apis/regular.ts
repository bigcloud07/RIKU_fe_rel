// apis/regular.ts
import customAxios from "../apis/customAxios";

export type RegularDetail = {
  title: string;
  location: string;
  date: string; // ISO
  content: string;
  postImageUrl: string | null;
  participants: any[];
  participantsNum: number;
  pacers: any[];
  attachmentUrls: string[];
  userInfo: {
    userId: number;
    userName: string;
    userProfileImg?: string;
    userRole: string;
  };
  postCreatorInfo: { userName: string; userProfileImg?: string | null };
  groupedParticipants: any[];
  postStatus: "NOW" | "CANCELED" | "CLOSED";
};

export const getRegularPost = async (
  postId: string,
): Promise<RegularDetail> => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "null");
  const { data } = await customAxios.get(`/run/regular/post/${postId}`, {
    headers: { Authorization: `${token}` },
  });
  if (!data?.isSuccess)
    throw new Error(data?.responseMessage || "불러오기 실패");
  return data.result;
};

export const getRegularGroups = async (postId: string) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "null");
  const { data } = await customAxios.get(`/run/regular/post/${postId}/group`, {
    headers: { Authorization: `${token}` },
  });
  if (!data?.isSuccess)
    throw new Error(data?.responseMessage || "그룹 조회 실패");
  return data.result as { group: string; pace: string }[];
};

export const patchJoin = async (postId: string, group?: string) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "null");
  const url = `/run/regular/post/${postId}/join${group ? `?group=${group}` : ""}`;
  const { data } = await customAxios.patch(
    url,
    {},
    { headers: { Authorization: `${token}` } },
  );
  if (!data?.isSuccess)
    throw new Error(data?.responseMessage || "참여/취소 실패");
  return data;
};

export const postAttend = async (postId: string, code: string) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "null");
  const { data } = await customAxios.post(
    `/run/regular/post/${postId}/attend`,
    { code },
    { headers: { Authorization: `${token}` } },
  );
  if (!data?.isSuccess) throw new Error(data?.responseMessage || "출석 실패");
  return data;
};

export const deletePost = async (postId: string) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "null");
  const { data } = await customAxios.delete(`/run/regular/post/${postId}`, {
    headers: { Authorization: `${token}` },
  });
  if (!data?.isSuccess) throw new Error(data?.responseMessage || "삭제 실패");
  return data;
};

export const patchManualAttendance = async (
  postId: string,
  payload: { userId: number; isAttend: boolean }[],
) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "null");
  const { data } = await customAxios.patch(
    `/run/regular/post/${postId}/manual-attendance`,
    payload,
    { headers: { Authorization: `${token}` } },
  );
  if (!data?.isSuccess) throw new Error(data?.responseMessage || "수정 실패");
  return data;
};

export const patchFixAttendance = async (
  postId: string,
  payload: { userId: number; isAttend: boolean }[],
) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "null");
  const { data } = await customAxios.patch(
    `/run/regular/post/${postId}/fix-attendance`,
    payload,
    { headers: { Authorization: `${token}` } },
  );
  if (!data?.isSuccess) throw new Error(data?.responseMessage || "수정 실패");
  return data;
};
