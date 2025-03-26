import React from "react";
import NewOpenStatus from "../../assets/Main-img/NewOpenStatus.svg";
import { useNavigate } from "react-router-dom";
import NewMainImage from "../../assets/CardDefaultImg.svg"
import NOWimg from "../../assets/Main-img/NewOpenStatus.svg";
import CLODESDimg from "../../assets/Main-img/NewClosedStatus.svg";
import CANCELEDimg from "../../assets/Main-img/NewCanceledStatus.svg";

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
      className="w-[160px] h-[236px] bg-kuLightGray rounded-lg overflow-hidden relative"
      onClick={handleClick}
    >
      {/* 이미지 영역 */}
      <div className="w-full h-[120px]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 콘텐츠 유형 배지 */}
      <div className="absolute top-[100px] bg-kuLightGray text-[12px] font-semibold rounded-lg px-4 py-1">
        {event_type}
      </div>

      {/* 정보 영역 */}
      <div className="ml-3 mt-4">
        {statusImg && (
          <img src={statusImg} alt="Status" className="w-[40px] h-[20px]" />
        )}
        <div className="text-gray-500 text-[12px] font-bold mt-1">{date}</div>
        <div className="font-bold text-[20px]">{title}</div>
      </div>
    </div>
  );
};

export default NewMainCard;



