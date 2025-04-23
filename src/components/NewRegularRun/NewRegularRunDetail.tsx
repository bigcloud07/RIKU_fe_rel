import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customAxios from "../../apis/customAxios";
import NewRegularRunAdmin from "./NewRegularRunAdmin"
import NewRegularRunUser from "./NewRegularRunUser"


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
  adminId : number,
  postimgurl : string
}

const NewRegularRunDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>(); // URL의 postId 파라미터 가져오기
  const navigate = useNavigate(); // 페이지 이동 훅
  const [detailData, setDetailData] = useState<DetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const myId = JSON.parse(localStorage.getItem('MyId') || 'null');
  // 서버에서 데이터를 가져오는 함수
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('accessToken') || 'null');
        const response = await customAxios.get(`/run/regular/post/${postId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        console.log(myId)
        
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
            participantsNum: result.participantsNum,
            participants: result.participants,
            adminId:result.postCreatorInfo.userId,
            postimgurl:result.postImageUrl,
            
          });
          console.log(response.data)
        } else {
          console.error("데이터를 불러오지 못했습니다:", response.data.responseMessage);
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
  if(detailData.adminId == myId) // 내 userId와 게시글 만든 사람의 Id 비교후 렌더링
    return <NewRegularRunAdmin {...detailData} postId={postId}/>;
  else
    return <NewRegularRunUser {...detailData} postId={postId}/>
};

export default NewRegularRunDetail;
