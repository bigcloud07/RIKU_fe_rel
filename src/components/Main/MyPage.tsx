import React, { useState, useEffect } from 'react';
import riku_logo from '../../assets/riku_logo.png'; //라이쿠 로고 불러오기
import { Link, useNavigate } from 'react-router-dom'; // Link 컴포넌트 import
import profile_Img from '../../assets/default_profile.png'; //이미지 불러오기
import rightArrow_Icon from '../../assets/right_arrow.svg'; //라이쿠 로고 불러오기
import customAxios from '../../apis/customAxios';

// 재사용 가능한 버튼 컴포넌트
function renderButton(text: string, iconSrc: string, onClick: () => void) {
  return (
    <button onClick={onClick} className="w-full flex justify-between items-center p-4">
      <span className="text-xl font-normal text-gray-800">{text}</span>
      <img src={iconSrc} alt="Right Arrow Icon" className="h-5 w-5" />
    </button>
  );
}

function getUserRole(role: string) {
  if(role === "NEW_MEMBER")
  {
    return "신입부원";
  }
  else if(role === "MEMBER")
  {
    return "일반부원";
  }
  else if(role === "ADMIN")
  {
    return "운영진";
  }
  else if(role === "INACTIVE")
  {
    return "비활성화 사용자";
  }
  else
  {
    return "살려주세요";
  }
}

//로그인 페이지
function MyPage() {

  const navigate = useNavigate(); //useNavigate 훅을 사용해 navigate 함수 생성

  //마이페이지에 표시할 유저의 정보를 저장하는 state(서버에서 받아와서 해당 정보를 업데이트할 예정)
  const [userInfo, setUserInfo] = useState({"studentId": "201911291", "userName": "허준호", "userProfileImg": null, "userRole": "살려주세요", "point": 0, "activity": 0});

  //유저 정보를 가져오는 메소드 fetchUserInfo
  async function fetchUserInfo()
  {
    const accessToken = JSON.parse(localStorage.getItem('accessToken') || ''); //localStorage에 저장된 accessToken 값이 없으면 ''으로 초기화

    const url = '/users/profile';

    try {
      const response = await customAxios.get(
        url, //요청 url
        {
          headers: {
            Authorization: accessToken //accessToken을 헤더로 추가해서 요청 보냄
          }
        }
      );

      console.log('유저 프로필 불러오기 성공: ', response); //test용
      if(response.data.isSuccess === true)
      {
        let formattedUserRole = getUserRole(response.data.result.userRole);
        let data = {
          "studentId": response.data.result.studentId,
          "userName": response.data.result.userName,
          "userProfileImg": response.data.result.userProfileImg,
          "userRole": formattedUserRole,
          "point": 0,
          "activity": 0
        }
        setUserInfo(data);
      }
      else if(response.data.isSuccess === false)
      {
        alert(`서버에서 제대로 유저 정보를 불러오지 못했습니다: ${response.data.responseMessage}`);
      }
      
    } catch (error) {
      alert('서버 요청 중 오류 발생!');
      console.error('요청 실패: ', error);
    }
  }

  // 버튼 클릭 시 수행할 함수
  function handleNoticeClick()
  {
    alert("열심히 기능 준비중입니다!");
  };

  //'운영진 페이지' 버튼 클릭시 수행할 함수
  function handleToAdminPageClick()
  {
    if(userInfo.userRole === "ADMIN") //회원 정보가 운영진(ADMIN)일 경우
    {
      alert("운영진으로 확인되셨습니다. 운영진 페이지로 이동합니다");
      navigate('/admin')
    }
    else //운영진 페이지에 접근 권한이 없는 사람이라면
    {
      alert("회원님은 운영진이 아니므로 해당 페이지에 접근 권한이 없으십니다!");
    }
  }

  //처음 렌더링 될 때만 유저 정보 불러오기
  useEffect(() => {
    fetchUserInfo();
  },[])

  
  //Tailwind를 사용하여 스타일링 진행
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white p-4">
      <div className="w-full max-w-sm text-left mt-6 mb-6">
        <span className="text-2xl font-bold">마이페이지</span>
      </div>
      <div className="bg-gray-50 p-6 rounded-xl w-full max-w-sm shadow-lg">

        {/*프로필 이미지와 이름 섹션*/}
        <div className="flex items-center mb-4">
          <img src={profile_Img} alt="Profile" className="w-16 h-16 rounded-full mr-4"/>
          <div className="text-start">
            <p className="text-lg font-semibold text-gray-800">{userInfo.userName}</p>
            <p className="text-sm text-gray-500">{userInfo.userRole}</p>
          </div>
          <button 
            className="ml-auto px-4 py-1 text-sm bg-green-600 text-white rounded-lg hover hover:bg-green-900 transition" 
            onClick={handleNoticeClick}>
              프로필 수정
          </button>
        </div>
        
        {/* 포인트와 활동 내역 섹션 */}
        <div className="flex justify-around mt-6 pt-4 border-t-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{userInfo.point}</p>
            <p className="text-sm text-gray-500">포인트</p>
          </div>
          <div className="text-center">
            {
              //활동내역 갯수가 0 이하인 경우를 따진다
              userInfo.activity <= 0 ? (
                <p className="text-2xl font-bold text-gray-800">-</p>
              ) : (
                <p className="text-2xl font-bold text-gray-800">{userInfo.activity}</p>
              )
            }
            <p className="text-sm text-gray-500">활동 내역</p>
          </div>
        </div>
      </div>

      {/* '공지사항' 버튼 */}
      <div className="w-full max-w-sm mt-8">
        {renderButton("공지사항", rightArrow_Icon, handleNoticeClick)}
      </div>

      {/* '문의하기' 버튼 */}
      <div className="w-full max-w-sm mt-2">
        {renderButton("문의하기", rightArrow_Icon, handleNoticeClick)}
      </div>

      {/* 'FAQ' 버튼 */}
      <div className="w-full max-w-sm mt-2">
        {renderButton("FAQ", rightArrow_Icon, handleNoticeClick)}
      </div>

      {/* '운영진 페이지' 버튼 */}
      <div className="w-full max-w-sm mt-2">
        {renderButton("운영진 페이지", rightArrow_Icon, handleToAdminPageClick)}
      </div>

    </div>
  );
}

export default MyPage;