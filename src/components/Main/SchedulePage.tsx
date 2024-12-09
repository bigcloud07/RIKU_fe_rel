// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import plusBtn from '../../assets/plus_Icon.svg';
// import customAxios from '../../apis/customAxios';
// import { 
//     format, 
//     addMonths, 
//     subMonths, 
//     startOfMonth, 
//     endOfMonth, 
//     startOfWeek, 
//     endOfWeek, 
//     addDays,
//     parseISO,
// } from 'date-fns';

// // 한 달 달력에 들어갈 내용(날짜(Date))들의 배열을 생성
// function makeCalendarDays(pointDate: Date) {
//   const monthStart = startOfMonth(pointDate);
//   const monthEnd = endOfMonth(pointDate);
//   const startDate = startOfWeek(monthStart);
//   const endDate = endOfWeek(monthEnd);

//   let calendarDays = [];
//   let start = startDate;

//   while (start <= endDate) {
//     calendarDays.push(start);
//     start = addDays(start, 1);
//   }

//   return calendarDays;
// }

// // 에러 방어용 parseISO 래퍼 함수
// const safeParseISO = (dateString: string | null | undefined): Date | null => {
//   if (!dateString) {
//     console.warn('safeParseISO: Received null or undefined dateString');
//     return null;
//   }
//   try {
//     return parseISO(dateString);
//   } catch (error) {
//     console.error('safeParseISO: Invalid date string:', dateString, error);
//     return null;
//   }
// };

// function SchedulePage() {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [pointDate, setPointDate] = useState(new Date());
//   const [monthlyPlan, setMonthlyPlan] = useState<{ date: string; eventCount: number }[]>([]);
//   const [selectedDateEvent, setSelectedDateEvent] = useState<{ title: string; time: string; location: string }[]>([]);
  

//   const [markerColor] = useState(['bg-blue-500', 'bg-orange-600', 'bg-purple-400', 'bg-green-300', 'bg-gray-400']);
//   const [isFloatingButtonOpen, setIsFloatingButtonOpen] = useState(false);

//   const calendarDaysList = makeCalendarDays(pointDate);
//   let weeks: Date[][] = [];
//   let week: Date[] = [];
//   let dayOfTheWeek = ['일', '월', '화', '수', '목', '금', '토'];

//   calendarDaysList.forEach(day => {
//     if (week.length < 7) {
//       week.push(day);
//     } else {
//       weeks.push(week);
//       week = [day];
//     }
//   });
//   if (week.length > 0) weeks.push(week);

//   const nextMonth = () => {
//     setPointDate(addMonths(pointDate, 1));
//   };

//   const prevMonth = () => {
//     setPointDate(subMonths(pointDate, 1));
//   };

//   const handleDateClick = (date: Date) => {
//     setSelectedDate(date);
//     if (date.getMonth() !== pointDate.getMonth()) {
//       setPointDate(date);
//     }
//   };

//   const toggleFloatingButton = () => {
//     setIsFloatingButtonOpen(!isFloatingButtonOpen);
//   };

//   async function fetchMonthlyData() {
//     const formattedPointDate = format(pointDate, 'yyyy-MM-dd');
//     const accessToken = JSON.parse(localStorage.getItem('accessToken') || '""');

//     const data = { date: formattedPointDate };
//     const url = '/calendar/monthly';

//     try {
//       const response = await customAxios.post(url, data, {
//         headers: { Authorization: accessToken },
//       });
//       setMonthlyPlan(response.data.result || []);
//     } catch (error) {
//       console.error('Failed to fetch monthly data:', error);
//       alert('서버 요청 중 오류 발생!');
//     }
//   }

//   async function fetchSelectedDateEventData() {
//     const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
//     const accessToken = JSON.parse(localStorage.getItem('accessToken') || '""');

//     const data = { date: formattedSelectedDate };
//     const url = '/calendar/daily';

//     try {
//       const response = await customAxios.post(url, data, {
//         headers: { Authorization: accessToken },
//       });
//       setSelectedDateEvent(
//         response.data.result?.map((event: any) => ({
//           ...event,
//           time: event.time || null, // time이 없는 경우 null로 초기화
//         })) || []
//       );
//     } catch (error) {
//       console.error('Failed to fetch daily data:', error);
//       alert('서버 요청 중 오류 발생!');
//     }
//   }

//   useEffect(() => {
//     fetchMonthlyData();
//   }, [pointDate]);

//   useEffect(() => {
//     fetchSelectedDateEventData();
//   }, [selectedDate]);

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-white px-6 py-10 pb-16">
//       <div className="flex flex-col items-center justify-center space-y-0 mb-4">
//         <span className="text-xs font-light text-black">{pointDate.getFullYear()}</span>
//         <div className="flex items-center justify-center space-x-4 mb-4">
//           <button onClick={prevMonth} aria-label="Previous month" className="p-2 rounded-full hover:bg-gray-100">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//           <span className="text-2xl font-semibold text-black">{pointDate.getMonth() + 1}월</span>
//           <button onClick={nextMonth} aria-label="Next month" className="p-2 rounded-full hover:bg-gray-100">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//             </svg>
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-7 mb-4 text-center w-full max-w-sm">
//         {dayOfTheWeek.map((dayName, index) => (
//           <div key={index}>
//             <div className="font-bold text-gray-600">{dayName}</div>
//             <div className="w-full h-px bg-gray-200 mt-2" />
//           </div>
//         ))}
//       </div>

//       {weeks.map((week, index) => (
//         <div key={index} className="grid grid-cols-7 mb-2 text-center w-full max-w-sm">
//           {week.map((day, subIndex) => {
//             let isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
//             let planCounts = monthlyPlan.find(item => item.date === format(day, 'yyyy-MM-dd'))?.eventCount || 0;
//             let isCurrentMonth = day.getMonth() === pointDate.getMonth();
//             let style = isSelected ? 'bg-kuDarkGreen text-white' : isCurrentMonth ? 'text-black' : 'text-gray-400';

//             return (
//               <div key={subIndex} className="flex flex-col items-center">
//                 <button
//                   onClick={() => handleDateClick(day)}
//                   className={`p-2 w-10 ${style} rounded-full hover:bg-gray-200 flex flex-col items-center justify-center`}
//                 >
//                   <span className="text-base font-normal">{day.getDate()}</span>
//                   {isCurrentMonth && planCounts > 0 && (
//                     <div className="mt-2 text-xs font-bold text-gray-500">{`+${planCounts}`}</div>
//                   )}
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       ))}

//       <div className="w-full max-w-sm mt-6 flex flex-col items-start">
//         <span className="text-xl font-bold mb-4">{`${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`}</span>
//         {selectedDateEvent.length > 0 ? (
//           selectedDateEvent.map((event, index) => {
//             const eventTime = safeParseISO(event.time);
//             return (
//               <div key={index} className="w-full max-w-sm bg-white border rounded-lg p-2 shadow-sm mb-4 flex flex-row items-center">
//                 <div className={`w-2 h-2 ml-2 ${markerColor[index % markerColor.length]} rounded-full`} />
//                 <div className="pl-4 flex flex-col items-start">
//                   <p className="text-gray-800 font-medium">{event.title}</p>
//                   <p className="text-gray-500 text-sm">
//                     {eventTime ? format(eventTime, 'HH:mm') : '시간 미정'} {event.location}
//                   </p>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <span className="text-xl font-bold mb-4">일정이 없습니다.</span>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SchedulePage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import plusBtn from '../../assets/plus_Icon.svg'; //라이쿠 로고 불러오기
import customAxios from '../../apis/customAxios'; //커스텀 axios 호출

import { 
    format, 
    addMonths, 
    subMonths, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    addDays,
    parseISO,
} from 'date-fns';

//한 달 달력에 들어갈 내용(날짜(Date))들의 배열을 만든다.
function makeCalendarDays(pointDate: Date) {
  const monthStart = startOfMonth(pointDate); //현재 달의 시작 날짜
  const monthEnd = endOfMonth(pointDate); //현재 달의 마지막 날짜
  const startDate = startOfWeek(monthStart); //현재 달의 시작 날짜가 포함된 주의 시작 날짜(그니까, 전 달의 날짜가 나올수도 있음!)
  const endDate = endOfWeek(monthEnd); //현재 달의 마지막 날짜가 포함된 주의 끝 날짜(그니까, 다음 달의 날짜가 나올수도 있음!)

  let calendarDays = [];
  let start = startDate;

  while(start <= endDate) //start가 endDate보다 작거나 같은 동안엔 반복문을 지속한다
  {
      calendarDays.push(start); //calendarDays 배열의 끝에 start 값 추가
      start = addDays(start, 1); //날짜를 하루 더해준다(이것을 통해 start를 업데이트 한다)
  }

  return calendarDays;
}

//일정과 캘린더를 확인할 수 있는 SchedulePage
function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pointDate, setPointDate] = useState(new Date());
  const [monthlyPlan, setMonthlyPlan] = useState<{date: string; eventCount: number}[]>([]);
  const [selectedDateEvent, setSelectedDateEvent] = useState<{title: string, time: string, location: string}[]>([]);

  //캘린더 월별 조회 메소드
  async function fetchMonthlyData() {
    const formattedPointDate = format(pointDate, 'yyyy-MM-dd'); //pointDate(기준이 되는 날짜) 포맷팅
    const accessToken = JSON.parse(localStorage.getItem('accessToken') || ''); //localStorage에 저장된 accessToken 값이 없으면 ''으로 초기화

    //보낼 데이터
    const data = {
      "date" : formattedPointDate
    }

    const url = '/calendar/monthly';

    try {
      const response = await customAxios.post(
        url, //요청 url
        data, //요청 데이터
        {
          headers: {
            Authorization: accessToken //accessToken을 헤더로 추가해서 요청 보냄
          }
        }
      );
      setMonthlyPlan(response.data.result); //불러온 data의 result 값으로 monthlyPlan 값 저장
      console.log('응답 성공:', response.data);
    } catch (error) {
      alert('서버 요청 중 오류 발생!');
      console.error('요청 실패: ', error);
    }
  }

  //캘린더 일별 조회 메소드
  async function fetchSelectedDateEventData() {
    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd'); // selectedDate(선택된 날짜) 포맷팅
    const accessToken = JSON.parse(localStorage.getItem('accessToken') || '') //localStorage에 저장된 accessToken 값이 없으면 ''으로 초기화

    //보낼 데이터
    const data = {
      "date" : formattedSelectedDate
    }

    const url = '/calendar/daily';

    try {
      const response = await customAxios.post(
        url, //요청 url
        data, //요청 데이터
        {
          headers: {
            Authorization: accessToken //accessToken을 헤더로 추가해서 요청 보냄
          }
        }
      );
      setSelectedDateEvent(response.data.result); //불러온 data의 result 값으로 selectedDateEvent 값 저장
      console.log('응답 성공: ', response.data);
    } catch (error) {
      alert('서버 요청 중 오류 발생!');
      console.error('요청 실패: ', error);
    }
  }

  //pointDate 값이 바뀔 때마다 월별 일정을 불러 와야 한다 (fetchMonthlyData 호출)
  useEffect(()=> {
    fetchMonthlyData();
  }, [pointDate]);

  //selectedDate 값이 바뀔 때마다 일별 일정을 불러 와야 한다 (fetchSelectedDateEventData 호출)
  useEffect(() => {
    fetchSelectedDateEventData();
  }, [selectedDate]);
  

  //marker 색깔을 state로 관리할 것이다
  let [markerColor, setMarkerColor] = useState(['bg-blue-500', 'bg-orange-600', 'bg-purple-400', 'bg-green-300', 'bg-gray-400']);
  const [isFloatingButtonOpen, setIsFloatingButtonOpen] = useState(false);

  //각 버튼의 개별 상태를 관리하여 순차적 pop-up 효과를 구현
  const [showFirstButton, setShowFirstButton] = useState(false);
  const [showSecondButton, setShowSecondButton] = useState(false);
  const [showThirdButton, setShowThirdButton] = useState(false);
  const [showFourthButton, setShowFourthButton] = useState(false);

  const calendarDaysList = makeCalendarDays(pointDate);
  let weeks: Date[][] = [];
  let week: Date[] = [];
  let dayOfTheWeek = ['일', '월', '화', '수', '목', '금', '토'];

  calendarDaysList.forEach(day => {
    if (week.length < 7) {
      week.push(day);
    } else {
      weeks.push(week);
      week = [day];
    }
  });
  if (week.length > 0) weeks.push(week);

  const nextMonth = () => {
    setPointDate(addMonths(pointDate, 1));
  };

  const prevMonth = () => {
    setPointDate(subMonths(pointDate, 1));
  };

  const handleDateClick = (date: Date) => {
    if(date.getMonth() !== pointDate.getMonth()){  //이전 혹은 다음 달의 날짜를 선택했을 경우
      setSelectedDate(date);
      setPointDate(date); //기준 날짜도 바꿔야 한다 (그래야, 달력도 그에 맞춰 바뀐다)
    } else { //아니라면
      setSelectedDate(date);
    }
  };

  //플로팅 버튼을 눌렀을 때.. 동작하는 floatingButton
  const toggleFloatingButton = () => {
    setIsFloatingButtonOpen(!isFloatingButtonOpen);
  };

  //플로팅 버튼의 상태가 변경될 때 순차적으로 pop-up 시키는 효과 적용
  useEffect(() => {
    if(isFloatingButtonOpen) {
      // 플로팅 버튼이 열리면 순차적으로 각 버튼을 표시
      setShowFirstButton(false);
      setShowSecondButton(false);
      setShowThirdButton(false);
      setShowFourthButton(false);

      setTimeout(() => setShowFourthButton(true), 100); // 세 번째 버튼(맨 밑 버튼) 100ms 후 표시
      setTimeout(() => setShowThirdButton(true), 200); // 세 번째 버튼(맨 밑 버튼) 100ms 후 표시
      setTimeout(() => setShowSecondButton(true), 300); // 두 번째 버튼 200ms 후 표시
      setTimeout(() => setShowFirstButton(true), 400); // 첫 번째 버튼(맨 위 버튼) 300ms 후 표시
    } else {
      // 플로팅 버튼이 닫힐 때 모든 버튼을 즉시 숨기기
      setShowFirstButton(false);
      setShowSecondButton(false);
      setShowThirdButton(false);
      setShowFourthButton(false);
    }
  }, [isFloatingButtonOpen]); //isFloatingButtonOpen state값이 바뀔 때마다 적용

  return (
    <div className="min-h-screen flex flex-col items-center bg-white px-6 py-10 pb-16">
      {/* 캘린더 상단의 화살표로 월을 조절하는 부분 */}
      <div className="flex flex-col items-center justify-center space-y-0 mb-4">
        <span className="text-xs font-light text-black">{pointDate.getFullYear()}</span>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button onClick={prevMonth} aria-label="Previous month" className="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-2xl font-semibold text-black">{pointDate.getMonth()+1}월</span>
          <button onClick={nextMonth} aria-label="Next month" className="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>           
      </div>          

      {/* 실제적으로 달력이 보이는 부분 */}
      <div className="grid grid-cols-7 mb-4 text-center w-full max-w-sm">
        {dayOfTheWeek.map((dayName, index) => (
          <div key={index}>
            <div className="font-bold text-gray-600">
              {dayName}
            </div>
            <div className="w-full h-px bg-gray-200 mt-2"/>
          </div>
        ))}
        
      </div>

      {/* 중첩 map 함수를 사용해서 달력을 출력할 것이다 */}
      {weeks.map((week, index) => (
        <div key={index} className="grid grid-cols-7 mb-2 text-center w-full max-w-sm">
          {week.map((day, subIndex) => {
            let isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

            let planCounts = monthlyPlan?.find((item: { date: string; eventCount: number }) => 
              item.date === format(day, 'yyyy-MM-dd')
            )?.eventCount || 0;

            let isCurrentMonth = day.getMonth() === pointDate.getMonth();
            let style = isSelected
              ? 'bg-kuDarkGreen text-white'
              : isCurrentMonth
              ? 'text-black'
              : 'text-gray-400';

            return (
              <div key={subIndex} className="flex flex-col items-center">
                <button
                  onClick={() => handleDateClick(day)}
                  className={`p-2 w-10 ${style} rounded-full hover:bg-gray-200 flex flex-col items-center justify-center`}
                >
                  <span className="text-base font-normal">{day.getDate()}</span>
                  {/* marker를 날짜 아래에 배치하여 하나의 요소처럼 보이게 함 */}
                  {isCurrentMonth ? (
                    <div className={'flex flex-col items-center justify-center'}>
                      {
                        planCounts > 0 ? (
                          <>
                          <div className={`w-1.5 h-1.5 mt-2 rounded-full ${isSelected ? 'outline outline-1 outline-white bg-orange-400' : 'bg-orange-400'}`} />
                          <span className={`font-bold text-xs mt-2 ${isSelected ? 'text-white' : 'text-gray-500'}`}>+{planCounts}</span>
                          </>
                        ) : (
                          <>
                          <div className={`w-1.5 h-1.5 mt-2 rounded-full bg-transparent`} />
                          <span className={'font-bold text-xs mt-2 text-transparent'}>0</span>
                          </>
                        )
                      }
                    </div>
                    
                  ) : ( 
                    <div className={'flex flex-col items-center justify-center'}>
                      <div className={`w-1.5 h-1.5 mt-2 rounded-full bg-transparent`} />
                      <span className={'font-bold text-xs mt-2 text-transparent'}>+2</span>
                    </div>
                  )}
                </button>
                {/* 마지막 줄이 아닌 경우에만 선을 추가 */}
                {index < weeks.length - 1 && (
                  <div className="w-full h-px bg-gray-200 mt-2" />
                )}
            </div>
            );
          })}
        </div>
      ))}

      {/* 하단의 일정 출력되는 곳 (Event 섹션 카드는.. 일정이 있는대로 map 함수로 렌더링할 것이다) */}
      <div className="w-full max-w-sm mt-6 flex flex-col items-start">
        <span className="text-xl font-bold mb-4">{selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일</span>
        {
          selectedDateEvent && selectedDateEvent.length !== 0 ? (
            selectedDateEvent.map((event, index) => (
              //일정을 표현하는 카드 섹션
              <div key={index} className="w-full max-w-sm bg-white border border-gray-300 rounded-lg p-2 shadow-sm mb-4 flex flex-row items-center">
                <div className={`w-2 h-2 ml-2 ${markerColor[index]} rounded-full`}/>
                <div className="pl-4 flex flex-col items-start">
                  <p className="text-gray-800 font-medium">{event.title}</p>
                  <p className="text-gray-500 text-sm">{format(parseISO(event.time), 'HH:mm')} {event.location}</p>
                </div>
              </div>
            ))
          ) : (
            //없다고 적어놔야 한다
            <span className="text-xl font-bold mb-4">일정이 없습니다.</span>
          )
        }
      </div>
      {/* 플로팅 버튼 */}
      <button
        onClick={toggleFloatingButton}
        className={`fixed bottom-20 right-4 w-16 h-16 rounded-full bg-kuDarkGreen text-white flex items-center justify-center shadow-lg hover:bg-kuDarkGreen-dark focus:outline-none z-50 transition-transform duration-300 ${isFloatingButtonOpen ? 'rotate-45' : 'rotate-0'}`}
      >
        <img
          src={plusBtn}
          alt='플로팅 버튼 아이콘'
          className={`w-8 h-8 transition-transform duration-300 ${isFloatingButtonOpen ? 'rotate-20' : 'rotate-0'}`}
        />
      </button>
      
      {/* 플로팅 버튼이 열렸을 때 나타나는 옵션들 */}
      {isFloatingButtonOpen && (
        <div onClick={() => setIsFloatingButtonOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out flex justify-end items-end p-8 z-40">
          <div onClick={(e) => e.stopPropagation()} className="fixed bottom-40 right-10 flex flex-col space-y-4 pointer-events-auto">
            {/* 첫 번째 버튼 */}
            <button
              className={`w-auto h-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-white text-black font-semibold shadow-lg py-2 px-4 hover:bg-gray-100 transition-all duration-300 ease-out transform ${
                showFirstButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              번개런 일정 추가하기
            </button>

            {/* 두 번째 버튼 */}
            <button
              className={`w-auto h-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-white text-black font-semibold shadow-lg py-2 px-4 hover:bg-gray-100 transition-all duration-300 ease-out transform ${
                showSecondButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              정규런 일정 추가하기
            </button>

            {/* 세 번째 버튼 */}
            <button
              className={`w-auto h-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-white text-black font-semibold shadow-lg py-2 px-4 hover:bg-gray-100 transition-all duration-300 ease-out transform ${
                showThirdButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              훈련 일정 추가하기
            </button>

            {/* 세 번째 버튼 */}
            <button
              className={`w-auto h-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-white text-black font-semibold shadow-lg py-2 px-4 hover:bg-gray-100 transition-all duration-300 ease-out transform ${
                showFourthButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              행사 일정 추가하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
  

export default SchedulePage;