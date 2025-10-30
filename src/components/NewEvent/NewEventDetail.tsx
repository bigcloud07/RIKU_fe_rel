
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customAxios from "../../apis/customAxios";
import NewEventAdmin from "./NewEventAdmin";
import NewEventUser from "./NewEventUser";

interface Participant {
  id: number;
  name: string;
  profileImage?: string | null;
  isPresent: boolean;
}

interface DetailData {
  title: string;
  location: string;
  date: string;
  content: string;
  userName: string;
  participantsNum: number;
  participants: Participant[];
  adminId: number;
  postimgurl: string;
}

const NewEventDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();   const navigate = useNavigate();   const [detailData, setDetailData] = useState<DetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const myId = JSON.parse(localStorage.getItem("MyId") || "null");
    useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken") || "null");
        const response = await customAxios.get(`/run/event/post/${postId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (response.data.isSuccess) {
          const result = response.data.result;
          setDetailData({
            title: result.title,
            location: result.location,
            date: new Date(result.date).toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "long",
            }),
            content: result.content,
            userName: result.userName,
            participantsNum: result.participants.length,
            participants: result.participants,
            adminId: result.postCreatorInfo.userId,
            postimgurl: result.postImageUrl,
          });
        } else {
          console.error(
            "데이터를 불러오지 못했습니다:",
            response.data.responseMessage,
          );
          navigate("/");
        }
      } catch (error) {
        console.error("API 요청 오류:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [postId, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!detailData) {
    return <div>데이터가 없습니다.</div>;
  }
  if (detailData.adminId == myId)
        return <NewEventAdmin {...detailData} postId={postId} />;
  else return <NewEventUser {...detailData} postId={postId} />;
};

export default NewEventDetail;
