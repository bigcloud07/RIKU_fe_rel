import React, { useState } from 'react';
import riku_logo from '../../assets/riku_logo.png'; //라이쿠 로고 불러오기
import { Link, useNavigate } from 'react-router-dom'; // Link 컴포넌트 import
import profile_Img from '../../assets/marathon_finisher.png'; //이미지 불러오기
import rightArrow_Icon from '../../assets/right_arrow.svg'; //라이쿠 로고 불러오기

//운영진 페이지
//회원 정보를 모두 조회하고, 권한 변경 및 회원 삭제를 할 수 있는 API 필요
function AdminPage() {

  return (
    <div>
        <span className="text-xl">운영진 페이지입니다!<br/>열심히 준비중입니다~</span>
    </div>
  )
}

export default AdminPage;