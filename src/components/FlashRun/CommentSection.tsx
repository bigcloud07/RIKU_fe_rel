import React, { useEffect, useState } from "react";
import customAxios from "../../apis/customAxios";
import CommentIcon from "../../assets/CommentIcon.svg";

const formatTimeAgo = (rawDate?: string): string => {
    if (!rawDate) return "";
    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
};

interface Reply {
    commentId: number;
    userId: number;
    userName: string;
    content: string;
    commentStatus: string;
    replies: Reply[];
    createdAt?: string;
}

interface Comment extends Reply { }

interface CommentSectionProps {
    postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState<string>("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editedContent, setEditedContent] = useState<string>("");

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

    const handleSubmitReply = async () => {
        if (!replyContent.trim() || replyTargetId === null) return;
        try {
            const token = JSON.parse(localStorage.getItem("accessToken") || "null");
            const response = await customAxios.post(
                `/run/flash/post/${postId}/comment`,
                { content: replyContent, targetId: replyTargetId },
                { headers: { Authorization: `${token}` } }
            );
            if (response.data.isSuccess) {
                setReplyContent("");
                setReplyTargetId(null);
                fetchComments();
            }
        } catch {
            alert("대댓글 등록 오류");
        }
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

    const handleDeleteReply = async (commentId: number) => {
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
            alert("대댓글 삭제 오류");
        }
    };

    const handleEditClick = (commentId: number, currentContent: string) => {
        setEditingCommentId(commentId);
        setEditedContent(currentContent);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditedContent("");
    };

    const handleSubmitEdit = async (commentId: number) => {
        try {
            const token = JSON.parse(localStorage.getItem("accessToken") || "null");
            const response = await customAxios.patch(
                `/run/flash/post/${postId}/comment/${commentId}`,
                { content: editedContent },
                { headers: { Authorization: `${token}` } }
            );
            if (response.data.isSuccess) {
                setEditingCommentId(null);
                setEditedContent("");
                fetchComments();
            }
        } catch {
            alert("댓글 수정 오류");
        }
    };

    const activeComments = comments.filter((comment) => comment.commentStatus === "ACTIVE");

    const totalActiveCount =
        activeComments.length +
        activeComments.reduce(
            (sum, comment) =>
                sum + comment.replies.filter((reply) => reply.commentStatus === "ACTIVE").length,
            0
        );

    return (
        <div className="w-[327px]">
            <div className="mt-2 mb-2 text-[16px] text-left">
                댓글 {totalActiveCount}
            </div>
            <div className="bg-[#F5F5F5] rounded-xl p-4 space-y-4">
                {activeComments.map((comment) => (
                    <div key={comment.commentId} className="border-b border-[#E0E0E0] pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-2">
                                <div className="flex items-center justify-center w-6 h-6 bg-[#9DC34A] rounded-full text-white text-xs font-bold">
                                    {comment.userName.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-left">{comment.userName}</div>

                                    {editingCommentId === comment.commentId ? (
                                        <>
                                            <input
                                                type="text"
                                                className="text-sm p-1 border border-gray-300 rounded w-full mt-1"
                                                value={editedContent}
                                                onChange={(e) => setEditedContent(e.target.value)}
                                            />
                                            <div className="flex gap-2 mt-1">
                                                <button
                                                    className="text-sm text-[#7EC24F] font-semibold"
                                                    onClick={() => handleSubmitEdit(comment.commentId)}
                                                >
                                                    수정 완료
                                                </button>
                                                <button
                                                    className="text-xs text-gray-400"
                                                    onClick={handleCancelEdit}
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-sm text-left">{comment.content}</div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {formatTimeAgo(comment.createdAt)}
                                            </div>
                                        </>
                                    )}

                                    {comment.replies
                                        .filter((reply) => reply.commentStatus === "ACTIVE")
                                        .map((reply) => (
                                            <div key={reply.commentId} className="flex items-start gap-2 mt-2 pl-8">
                                                <div className="flex items-center justify-center w-5 h-5 bg-[#9DC34A] rounded-full text-white text-[10px] font-bold">
                                                    {reply.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm">{reply.userName}</div>
                                                    <div className="text-sm text-left">{reply.content}</div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {formatTimeAgo(reply.createdAt)}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteReply(reply.commentId)}
                                                        className="text-xs text-red-500 mt-1"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                    {replyTargetId === comment.commentId && (
                                        <div className="flex items-start gap-2 mt-2 pl-8">
                                            <div className="flex items-center justify-center w-5 h-5 bg-[#9DC34A] rounded-full text-white text-[10px] font-bold">
                                                {localStorage.getItem("userName")?.charAt(0) || "나"}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="대댓글 작성..."
                                                    className="w-full bg-kuLightGray text-sm p-1 rounded-[8px]"
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                />
                                                <div className="flex justify-end mt-1 space-x-2">
                                                    <button
                                                        className="text-sm text-[#7EC24F] font-semibold"
                                                        onClick={handleSubmitReply}
                                                    >
                                                        등록
                                                    </button>
                                                    <button
                                                        className="text-sm text-gray-400"
                                                        onClick={() => setReplyTargetId(null)}
                                                    >
                                                        취소
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {replyTargetId !== comment.commentId && (
                                        <button
                                            className="ml-2 text-xs text-blue-500"
                                            onClick={() => setReplyTargetId(comment.commentId)}
                                        >
                                            <img src={CommentIcon} alt="답글" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1 mt-1">
                                {/* <button
                  onClick={() => handleEditClick(comment.commentId, comment.content)}
                  className="text-xs text-blue-500"
                >
                  수정
                </button> */}
                                <button
                                    onClick={() => handleDeleteComment(comment.commentId)}
                                    className="text-xs text-red-500"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex items-center mt-3 bg-[#F5F5F5] rounded-xl px-3 py-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-[#9DC34A] rounded-full text-white text-xs font-bold mr-2">
                        {localStorage.getItem("userName")?.charAt(0) || "나"}
                    </div>
                    <input
                        type="text"
                        placeholder="댓글 추가..."
                        className="flex-1 bg-kuLightGray text-sm rounded-[8px] p-1 w-[263px] h-[32px] focus:outline-none"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        className="ml-2 text-[#7EC24F] text-sm font-semibold"
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                    >
                        등록
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;