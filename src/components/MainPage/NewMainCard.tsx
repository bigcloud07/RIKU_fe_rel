import React from "react";
import { useNavigate } from "react-router-dom";
import ARGENTimg from "../../assets/Main-img/NewUrgentStatus.svg";

interface CardProps {
  title: string;
  date: string;
  imageUrl: string;
  statusImg?: string; // status -> statusImg로 변경
  event_type: string;
  path: string;
}

const NewMainCard: React.FC<CardProps> = ({
  title,
  date,
  statusImg,
  imageUrl,
  event_type,
  path,
}) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(path);

  return (
    <div
      className="w-[160px] h-[250px] bg-kuLightGray rounded-lg relative"
      onClick={handleClick}
    >
      {/* 이미지 영역 */}
      <div className="w-full h-[120px] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 콘텐츠 유형 배지 */}
      <div className="absolute top-[100px] bg-kuLightGray text-[12px] rounded-lg px-4 py-1">
        {event_type}
      </div>

      {/* 정보 영역 */}
      <div className="ml-[16px] mr-[16px] mb-[20px] mt-[16px]">
        

        {statusImg && (
          <img
            src={statusImg}
            alt="Status"
            className={`${statusImg === ARGENTimg ? "w-[46px] h-[20px]" : "w-[40px] h-[20px]"
              }`}
          />
        )}


        < div className="text-gray-500 text-[12px] mt-1">{date}</div>
        <div className="font-bold text-[20px] w-[130px] h-[64px] overflow-hidden text-ellipsis break-words line-clamp-2">
          {title}</div>
      </div>
    </div >
  );
};

export default NewMainCard;



