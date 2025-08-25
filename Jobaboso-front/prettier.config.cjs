module.exports = {
  tailwindConfig: './tailwind.config.js',
  semi: true, // 세미콜론 붙이기
  singleQuote: true, // 따옴표 대신 홑따옴표
  tabWidth: 2, // 들여쓰기 공백 수
  useTabs: false, // 탭 대신 스페이스
  trailingComma: 'es5', // 마지막 쉼표 (ES5 기준)
  printWidth: 100, // 줄 바꿈 기준 너비
  bracketSpacing: true, // 중괄호 안 공백 { foo: bar }
  arrowParens: 'always',
  plugins: ['prettier-plugin-tailwindcss'], // Tailwind 클래스 정렬
  endOfLine: 'lf',
};
