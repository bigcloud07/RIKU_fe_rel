/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src 폴더 내 모든 JS/TS 파일
    "./index.html",                // Vite의 기본 HTML 파일 포함
    "./node_modules/swiper/**/*.{js,ts,jsx,tsx}", // ✅ Swiper 모듈 포함
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-up": {
          //랭킹 페이지에서 y축 방향으로 아래에서 위로 떠오르는 것을 표현하기 위한 keyframes
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          //마이페이지에서 로딩 완료 시에 컴포넌트들을 서서히 보이게 하기 위한 keyframes
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-in-out forwards",
      },
      // animation-delay 추가 (Tailwind가 인식하도록 설정)
      animationDelay: {
        300: "0.3s",
        600: "0.6s",
        1000: "1s",
      },
      colors: {
        // 커스텀 색상 설정
        kuDarkGreen: "#366943",
        kuCoolGray: "#B2B3B4",
        kuRed: "#D7260D",
        kuGreen: "#65B749",
        kuDarkGray: "#686F75",
        kuLightGreen: "#C6F059",
        kuWarmGray: "#B7CCAA",
        kuBlack: "#000000",
        kuBlue: "#7CA6D8",
        kuBeige: "#F0F4DD",
        whiteSmoke: "#F5F5F5",
        kuViolet: "#B686C2",
        kuLightGray: "#ECEBE4",
        kuWhite: "#FFFFFF",
        kuOrange: "#DEA93D",
        whiteSmoke: "#F5F5F5",
      },
      clipPath: {
        triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
      },
      fontFamily: {
        sans: ['"Apple SD Gothic Neo"', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const animationDelay = theme("animationDelay");
      const utilities = Object.fromEntries(
        Object.entries(animationDelay).map(([key, value]) => [
          `.animation-delay-${key}`,
          { "animation-delay": value },
        ])
      );

      addUtilities(utilities, ["responsive", "hover"]);
    },
  ],
};
