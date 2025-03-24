import { useState } from "react";

interface Reply {
    commentId: number;
    userId: number;
    userProfileImg: string | null;
    userName: string;
    content: string;
    commentStatus: string;
    replies: Reply[];
  }
  
  interface Comment {
    commentId: number;
    userId: number;
    userProfileImg: string | null;
    userName: string;
    content: string;
    commentStatus: string;
    replies: Reply[];
  }
  
  interface CommentProps {
    comments: Comment[];
    onAddComment: (content: string) => void;
    onAddReply: (commentId: number, content: string) => void;
  }

  const CommentList : React.FC<CommentProps> = ({ comments, onAddComent, onAddReply }) => {
    const [nesComment, setNewComment] = useState("");
    const [replyContent, setReplyContent] = useState<{ [key: number]: string}>({});

    return (
        <div>
            {/* 댓글 입력창 */}
            <div>
                <textarea
                    className="w-full p-2 border rounded-md"
                    placeholder="댓글을 입력하세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    className="">
                    onClick={()=> {
                        if(setNewComment.trim()) {
                            onAddComent(newComment);
                            setNewComment("");
                        }
                    }}
                </button>
                
            </div>
        </div>
    )
  }