import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link 컴포넌트 import
import axios from 'axios';
import customAxios from '../../apis/customAxios';
import riku_logo from '../../assets/riku_logo_loginPage.svg'; //라이쿠 로고 불러오기

//회원 정보와 관련된 객체 정보를 정의한 Member interface
interface Member {
  studentID: string;
  name: string;
  collegeName: string;
  departmentName: string;
  telNum: string | null;
  point: number;
  activity_count: number;
  userRole: string;
}

//운영진 페이지
//회원 정보를 모두 조회하고, 권한 변경 및 회원 삭제를 할 수 있는 API 필요
function AdminPage() {

  const navigate = useNavigate(); //useNavigate 훅을 사용해 navigate 함수 생성

  //필요한 state 정의
  const [members, setMembers] = useState<Member[]>([]);
  const [editedMembers, setEditedMembers] = useState<Member[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Member; sortDirection: 'asc' | 'desc' } | null>(null);

  //임시로 사용할 dummyData
  const dummyData = [
    { studentID: "201911291", name: "허준호", collegeName: "공과대학", departmentName: "컴퓨터공학부", telNum: "010-1111-2222", point: 140, activity_count: 7, userRole: "ADMIN" },
    { studentID: "201812345", name: "김민수", collegeName: "인문대학", departmentName: "국어국문학과", telNum: "010-3333-4444", point: 120, activity_count: 5, userRole: "ADMIN" },
    { studentID: "202013579", name: "박지연", collegeName: "사회과학대학", departmentName: "심리학과", telNum: null, point: 85, activity_count: 3, userRole: "MEMBER" },
    { studentID: "202110123", name: "이수현", collegeName: "자연과학대학", departmentName: "물리학과", telNum: "010-5555-6666", point: 100, activity_count: 6, userRole: "MEMBER" },
    { studentID: "202214567", name: "정우영", collegeName: "경영대학", departmentName: "경영학과", telNum: "010-7777-8888", point: 200, activity_count: 10, userRole: "MEMBER" },
    { studentID: "201914321", name: "최지훈", collegeName: "공과대학", departmentName: "기계공학부", telNum: "010-9999-0000", point: 95, activity_count: 4, userRole: "MEMBER" },
    { studentID: "202312345", name: "한예슬", collegeName: "예술대학", departmentName: "연극영화학과", telNum: "010-1234-5678", point: 75, activity_count: 2, userRole: "MEMBER" },
    { studentID: "202045678", name: "문성호", collegeName: "의과대학", departmentName: "간호학과", telNum: null, point: 180, activity_count: 8, userRole: "ADMIN" },
    { studentID: "202156789", name: "송지훈", collegeName: "공과대학", departmentName: "전자공학부", telNum: "010-8765-4321", point: 110, activity_count: 6, userRole: "NEW_MEMBER" },
    { studentID: "201800123", name: "장미라", collegeName: "자연과학대학", departmentName: "화학과", telNum: "010-5678-9101", point: 90, activity_count: 5, userRole: "NEW_MEMBER" },
  ];

  //API를 이용해서 서버로부터 데이터를 가져오는 작업
  useEffect(() => {
    // async function fetchMembers() {
    //   try {
    //     const response = await customAxios.get('/api/members'); //추후 해당하는 api 엔드포인트로 교체할 예정
    //     setMembers(response.data)
    //     setEditedMembers(response.data);
    //   } catch(error) {
    //     alert('회원 정보를 가져 오는 데 실패했습니다')
    //   }
    // }
    setMembers(dummyData);
    setEditedMembers(dummyData);
  }, []);

  //회원 등급(userRole)을 바꾸기 위한 드롭다운 핸들링 함수 handleRoleChange
  function handleRoleChange(index: number, newRole: string) {
    const updatedMembers = [...editedMembers];
    updatedMembers[index] = { ...updatedMembers[index], userRole: newRole };
    setEditedMembers(updatedMembers);
  };

  //회원 정보들을 정렬하기 위한 handleSort
  function handleSort(key: keyof Member) {
    let sortDirection: 'asc' | 'desc' = 'asc'; //내림차순(desc) 혹은 오름차순(asc) 옵션 관련한 자료형 sortDirection 선언

    //sortConfig 값이 null이 아니라면, sortDirection을 반전 시킨다 
    if (sortConfig && sortConfig.key === key && sortConfig.sortDirection === 'asc') {
      sortDirection = 'desc';
    }

    const sortedMembers = [...editedMembers].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      
      //telNum 옵션에서 null이 발생할 수 있음, 이에 대해선 예외 처리를 해주어야 함
      if (aValue === null || bValue === null) {
        return aValue === bValue ? 0 : aValue === null ? 1 : -1;
      }

      //값에 따라 -1, 0, 1중 1개의 값 반환 (정렬 방향 속성 고려)
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setEditedMembers(sortedMembers);
    setSortConfig({ key, sortDirection }); //sortConfig 재설정
  }

  //저장하는 프로세스를 핸들링하는 메소드 handleSave
  async function handleSave(){
    try {
      await axios.put('/api/members', editedMembers); //추후 해당하는 api 엔드포인트로 교체할 예정
      alert('성공적으로 회원 정보 수정이 완료 되었습니다!');
    } catch (error) {
      console.error('수정 사항을 저장하는 데 오류가 발생했습니다', error);
      alert('수정 사항을 저장하는 데 오류가 발생했습니다!');
    }
  };

  //editedMembers state를 초기화하는 프로세스를 핸들링하는 메소드 handleReset
  function handleReset() {
    setEditedMembers([...members]);
  };

  //마이 페이지로 돌아가는 버튼
  function handleToMyPage() {
    navigate('/tab/my-page')
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-8">
        <img src={riku_logo} alt="Logo" className="h-10 mr-4" />
        <span className="text-2xl font-bold">회원 정보 관리</span>
      </div>
      <div className="flex items-center ml-4 mb-4">
        <span className="text-sm font-bold">참고 사항: 표의 제목을 누르실 경우, 각 항목에 대해 정렬하여 조회하실 수 있습니다</span>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse">
          {/*표 상단의 header 부분 렌더링*/}
          <thead>
            <tr>
              {['학번', '이름', '단과대학명', '전공명', '전화번호', '포인트', '활동내역 갯수', '회원등급'].map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 border-b cursor-pointer"
                  onClick={() => handleSort(
                    [
                      'studentID',
                      'name',
                      'collegeName',
                      'departmentName',
                      'telNum',
                      'point',
                      'activity_count',
                      'userRole',
                    ][index] as keyof Member
                  )}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          {/*표 하단의 회원 정보 출력하는 부분 렌더링*/}
          <tbody>
            {editedMembers.map((member, index) => (
              <tr key={member.studentID}>
                <td className="px-4 py-2 border-b">{member.studentID}</td>
                <td className="px-4 py-2 border-b">{member.name}</td>
                <td className="px-4 py-2 border-b">{member.collegeName}</td>
                <td className="px-4 py-2 border-b">{member.departmentName}</td>
                <td className="px-4 py-2 border-b">{member.telNum}</td>
                <td className="px-4 py-2 border-b">{member.point}</td>
                <td className="px-4 py-2 border-b">{member.activity_count}</td>
                <td className="px-4 py-2 border-b">
                  <select
                    value={member.userRole}
                    onChange={(e) => handleRoleChange(index, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="NEW_MEMBER">신입 부원</option>
                    <option value="MEMBER">일반 부원</option>
                    <option value="ADMIN">운영진</option>
                    <option value="INACTIVE">비활성화 사용자</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 space-x-4">
        <button
          onClick={handleToMyPage}
          className="bg-kuLightGreen text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          마이 페이지로 돌아가기
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          초기화
        </button>
        <button
          onClick={handleSave}
          className="bg-kuDarkGreen text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          저장
        </button>
      </div>
    </div>
  )
}

export default AdminPage;