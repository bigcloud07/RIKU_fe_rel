// ✅ 최종 통합 CommentSection.tsx (userProfileImg 대응)
import React, { useEffect, useState } from "react";
import customAxios from "../../apis/customAxios";
import CommentIcon from "../../assets/CommentIcon.svg";
import CommentInputOn from "../../assets/comment_input_on.svg";
import CommentInputOff from "../../assets/comment_input_off.svg";

interface Reply {
  commentId: number;
  userId: number;
  userName: string;
  userProfileImg?: string | null;
  content: string;
  commentStatus: string;
  replies: Reply[];
  createdAt?: string;
}

interface Comment extends Reply {}

interface CommentSectionProps {
  postId: string;
  userInfo: {
    userId: number;
    userName: string;
    userProfileImg?: string | null;
  };
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, userInfo }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [replyTargetCommentId, setReplyTargetCommentId] = useState<number | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.get(`/run/flash/post/${postId}`, {
        headers: { Authorization: `${token}` },
      });
      if (response.data.isSuccess) {
        setComments(response.data.result.comments);
      }
    } catch (err) {
      console.error("댓글 불러오기 실패", err);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.post(
        `/run/flash/post/${postId}/comment`,
        { content: newComment, targetId: null },
        { headers: { Authorization: `${token}` } }
      );
      if (response.data.isSuccess) {
        setNewComment("");
        fetchComments();
      }
    } catch {
      alert("댓글 등록 오류");
    }
  };

  const handleSubmitReply = async (targetId: number) => {
    const content = replyInputs[targetId];
    if (!content?.trim()) return;

    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.post(
        `/run/flash/post/${postId}/comment`,
        { content, targetId },
        { headers: { Authorization: `${token}` } }
      );
      if (response.data.isSuccess) {
        setReplyInputs((prev) => ({ ...prev, [targetId]: "" }));
        setReplyTargetCommentId(null);
        fetchComments();
      }
    } catch {
      alert("대댓글 등록 오류");
    }
  };

  const handleReplyChange = (id: number, value: string) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken") || "null");
      const response = await customAxios.patch(
        `/run/flash/post/${postId}/comment/${commentId}`,
        {},
        { headers: { Authorization: `${token}` } }
      );
      if (response.data.isSuccess) {
        fetchComments();
      }
    } catch {
      alert("댓글 삭제 오류");
    }
  };

  const activeComments = comments.filter((c) => c.commentStatus === "ACTIVE");
  const totalActiveCount =
    activeComments.length +
    activeComments.reduce(
      (sum, c) => sum + c.replies.filter((r) => r.commentStatus === "ACTIVE").length,
      0
    );

  return (
    <div className="w-[327px]">
      <div className="mt-2 mb-2 text-[16px] text-left">댓글 {totalActiveCount}</div>
      <div className="bg-[#F5F5F5] rounded-xl p-4 space-y-4">
        {activeComments.map((comment) => {
          const activeReplies = comment.replies.filter((r) => r.commentStatus === "ACTIVE");
          return (
            <div key={comment.commentId} className="border-b border-[#E0E0E0] pb-3 space-y-2">
              {/* 원댓글 */}
              <div className="flex justify-between items-start w-full">
                <div className="flex items-start gap-2 flex-1">
                  <div className="w-6 aspect-square rounded-full flex items-center justify-center overflow-hidden bg-[#9DC34A] text-white text-[10px] font-bold">
                    {comment.userProfileImg && comment.userProfileImg.trim() !== "" ? (
                      <img src={comment.userProfileImg} alt="작성자" className="w-full h-full object-cover" />
                    ) : (
                      comment.userName.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="font-semibold text-left">{comment.userName}</div>
                    <div className="text-sm text-left break-words whitespace-pre-wrap">{comment.content}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{comment.createdAt}</span>
                      <button
                        onClick={() => setReplyTargetCommentId(comment.commentId)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#7EC24F]"
                      >
                        <img src={CommentIcon} alt="답글" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {comment.userId === userInfo.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment.commentId)}
                    className="text-xs text-red-500 ml-2 whitespace-nowrap"
                  >
                    삭제
                  </button>
                )}
              </div>

              {/* 대댓글 */}
              {activeReplies.map((reply) => (
                <div key={reply.commentId} className="w-full mt-2 pl-8 flex justify-between items-start">
                  <div className="flex items-start gap-2 flex-1">
                    <div className="w-6 aspect-square rounded-full flex items-center justify-center overflow-hidden bg-[#9DC34A] text-white text-[10px] font-bold">
                      {reply.userProfileImg && reply.userProfileImg.trim() !== "" ? (
                        <img src={reply.userProfileImg} alt="작성자" className="w-full h-full object-cover" />
                      ) : (
                        reply.userName.charAt(0)
                      )}
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="font-semibold text-sm text-left">{reply.userName}</div>
                      <div className="text-sm text-left break-words whitespace-pre-wrap">{reply.content}</div>
                      <div className="text-xs text-gray-400 mt-1 text-left">{reply.createdAt}</div>
                    </div>
                  </div>
                  {reply.userId === userInfo.userId && (
                    <button
                      onClick={() => handleDeleteComment(reply.commentId)}
                      className="text-xs text-red-500 ml-2 whitespace-nowrap"
                    >
                      삭제
                    </button>
                  )}
                </div>
              ))}

              {/* 대댓글 입력창 */}
              {replyTargetCommentId === comment.commentId && (
                <div className="flex items-start gap-2 mt-2 pl-8">
                  <div className="w-6 aspect-square rounded-full flex items-center justify-center overflow-hidden bg-[#9DC34A] text-white text-[10px] font-bold">
                    {userInfo.userProfileImg && userInfo.userProfileImg.trim() !== "" ? (
                      <img src={userInfo.userProfileImg} alt="내 프로필" className="w-full h-full object-cover" />
                    ) : (
                      userInfo.userName.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="대댓글 작성..."
                      className="w-full bg-kuLightGray text-sm p-1 rounded-[8px] h-[32px] pr-8"
                      value={replyInputs[comment.commentId] || ""}
                      onChange={(e) => handleReplyChange(comment.commentId, e.target.value)}
                    />
                    <button
                      onClick={() => handleSubmitReply(comment.commentId)}
                      disabled={!replyInputs[comment.commentId]?.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <img
                        src={replyInputs[comment.commentId]?.trim() ? CommentInputOn : CommentInputOff}
                        alt="등록"
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* 원댓글 입력창 */}
        <div className="flex items-center mt-3 bg-[#F5F5F5] rounded-xl px-3 py-2">
          <div className="w-6 aspect-square rounded-full flex items-center justify-center overflow-hidden bg-[#9DC34A] text-white text-[10px] font-bold">
            {userInfo.userProfileImg && userInfo.userProfileImg.trim() !== "" ? (
              <img src={userInfo.userProfileImg} alt="내 프로필" className="w-full h-full object-cover" />
            ) : (
              userInfo.userName.charAt(0)
            )}
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="댓글 추가..."
              className="w-full bg-kuLightGray text-sm rounded-[8px] ml-2 p-1 h-[32px] focus:outline-none pr-8"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <img
                src={newComment.trim() ? CommentInputOn : CommentInputOff}
                alt="댓글 등록"
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
