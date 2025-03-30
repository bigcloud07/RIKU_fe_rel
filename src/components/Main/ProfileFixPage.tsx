import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link 컴포넌트 import
import profile_Img from '../../assets/default_profile.png'; //이미지 불러오기
import rightArrow_Icon from '../../assets/right_arrow.svg'; //라이쿠 로고 불러오기
import customAxios from '../../apis/customAxios';
import duganadi_Img from '../../assets/RankingPage/dueganadi.png'; //이미지 불러오기
import pencil_Icon from '../../assets/Main-img/pencil.svg'; //연필 로고 불러오기
import arrowDown_Icon from '../../assets/Main-img/arrow_down.svg'; //아래쪽 화살표 로고 불러오기
import ActionBar from '../../components/ActionBar';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

//입력 필드 공통 컴포넌트
const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, disabled=false }) => (
  <div className="mb-6">
    <label className="block mb-2 text-m font-semibold text-gray-700">{label}</label>
    <input
      className="w-full border border-kuCoolGray rounded-xl px-3 py-3 focus: outline-kuDarkGreen"
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

//"학교 정보" 입력 컴포넌트
const SchoolInfoInputField: React.FC<{
  label: string, 
  value: string[], 
  onChange_1: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onChange_2: (e: React.ChangeEvent<HTMLInputElement>) => void}> 
  = ({label, value, onChange_1, onChange_2}) => (
  <div className="mb-6">
    <label className="block mb-2 text-m font-semibold text-gray-700">{label}</label>
    <input
      className="w-full border border-kuCoolGray rounded-xl px-3 py-3 mb-4 focus: outline-kuDarkGreen"
      value={value[0]}
      onChange={onChange_1}
      disabled
    />
    {/* 학과 입력란 */}
    <input
      className="read-only w-full border border-kuCoolGray rounded-xl px-3 py-3 focus: outline-kuDarkGreen"
      value={value[1]}
      onChange={onChange_2}
      disabled
    />
  </div>
)

//한 달 달력에 들어갈 내용(날짜(Date))들의 배열을 만든다.
function ProfileFixPage() {

  const navigate = useNavigate(); //useNavigate 훅을 사용해 navigate 함수 생성

  const [name, setName] = useState("허기철"); //이름
  const [collegeName, setCollegeName] = useState("공과대학"); //학교 정보-단과대명
  const [departmentName, setDepartmentName] = useState("힙합공학부"); //학교 정보-학과명
  const [telNum, setTelNum] = useState(""); //전화번호
  const [studentID, setStudentID] = useState("201911291"); //학번(ID)
  const [password, setPassword] = useState(""); //비밀번호

  //프로필 이미지 관련
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  //클릭 시 input 열기 위한 ref 추가
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  }

  //저장 버튼 클릭 시 처리하는 이벤트 (FormData에 password, 이미지, 전화번호 값을 담아서 보낼 것임)
  async function handleSubmitBtnClick()
  {
    const formData = new FormData();

    if (telNum) formData.append('phone', telNum);
    if (selectedImage) formData.append('userProfileImg', selectedImage)
    formData.append('password', password);

    console.log('FormData 내용:', Array.from(formData.entries()));

    try {
      const accessToken = JSON.parse(localStorage.getItem('accessToken') || ''); //localStorage에 저장된 accessToken 값이 없으면 ''으로 초기화
      const url = `/user/profile`;
      const response = await customAxios.patch(url, formData, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data',
        },
      });

      //성공했다면
      if(response.data.isSuccess) {
        console.log('프로필 수정 성공: ', response.data);
        alert('프로필 수정에 성공했습니다.');
        navigate('/tab/my-page');
      } else {
        console.log('요청 값이 잘못됨');
        alert(response.data.errors.message);
      }
    } catch(error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정 실패!');
    }
  }

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 업로드 최대 가능 용량: 3MB로 우선 하드코딩

  //파일 선택 시 -> file 객체 상태에 저장 + 미리보기 URL 생성하는 메소드 handleFileChange
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      //최대 용량을 넘어갈 경우
      if(file.size > MAX_FILE_SIZE) {
        alert('업로드 가능한 사진 크기는 최대 3MB입니다.');
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // 미리보기용 URL 생성
    }
  };

  //저장하기 전에 필수 form이 다 채워졌나 확인하는 변수 (전화번호를 제외한 모든 form이 채워져 있어야 함)
  const isFormValid = 
    password.trim() !== "" && selectedImage !== null;

  return (
    <>
    <ActionBar/>
    <div className="min-h-screen flex flex-col items-center justify-start bg-white pt-12 pb-20">
      <div className="w-full max-w-sm text-left mt-2 mb-16 p-4">
        <span className="text-2xl font-bold">프로필 수정</span>
      </div>
      <div className="relative w-full max-w-sm">
        {/* 프로필 사진 */}
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-28 h-28 rounded-full bg-gray-300 border-[4px] border-kuDarkGreen overflow-hidden">
            <img src={previewUrl || duganadi_Img} alt="1st" className="w-full h-full object-cover" />
            {/* 연필 아이콘 */}
            <div 
              onClick={handleEditClick}
              className="absolute top-0 right-0 bg-kuDarkGreen p-1.5 rounded-full cursor-pointer"
            >
              <img src={pencil_Icon} alt="Pencil Icon" className="h-5 w-5"/>
            </div>
            {/* 숨겨진 파일 input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* 기준이 되는 하단 박스 */}
        <div className="bg-whiteSmoke w-full pt-16 pb-4 pl-4 pr-4">
          <InputField label="이름" value={name} onChange={(e) => setName(e.target.value)} disabled />
          <SchoolInfoInputField 
            label="학교 정보" 
            value={[collegeName, departmentName]}
            onChange_1={(e) => setCollegeName(e.target.value)}
            onChange_2={(e) => setDepartmentName(e.target.value)}
          />
          <InputField label="전화번호" value={telNum} onChange={(e) => setTelNum(e.target.value)}/>
          <InputField label="학번(ID)" value={studentID} onChange={(e) => setStudentID(e.target.value)} disabled />
          <InputField label="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>

        {/* 저장 버튼 */}
        <div className="w-full max-w-sm text-left p-4">
          <button 
            disabled={!isFormValid}
            onClick={handleSubmitBtnClick}
            className={`w-full font-bold text-xl py-3 rounded-lg mt-6 
            ${isFormValid ? 'bg-kuDarkGreen text-white hover:bg-kuGreen' : 'bg-kuLightGray text-white'}`}>
            저장하기
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default ProfileFixPage;