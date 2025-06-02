//랭킹 페이지에서 보여줄 간단한 회원 정보에 관한 SimpleUserInfo interface
export interface SimpleUserInfo {
  userId: number;
  userName: string;
  userProfileImg: string | null; // 우선은 File이 아닌 string(URL)로 가정
  totalPoints: number;
}
