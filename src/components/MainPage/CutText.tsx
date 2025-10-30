import React from "react";

interface EllipsisTextProps {
  text: string;
  maxLength: number;
}

const CutText: React.FC<EllipsisTextProps> = ({ text, maxLength }) => {
  const truncatedText =
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return <p className="text-sm text-white">{truncatedText}</p>;
};

export default CutText;
