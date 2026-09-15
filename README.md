# 데이컬러 (DAYCOLOR)

타이핑 없이 주제와 항목을 선택해 하루를 색으로 기록하는 모바일 웹앱 MVP입니다.

## MVP 기능

- 날짜별 컬러 타임라인
- 기본 8개 주제와 선택형 기록
- 사진·메모 선택 입력
- 기록 수정·삭제
- 하루의 여러 기록을 층으로 쌓는 월간 팔레트
- 월간 주제 통계
- 사용자 주제·색상·선택 항목 추가 및 편집
- Firebase Google 로그인·Firestore 동기화·Storage 사진 업로드 준비

## Firebase 연결

1. Firebase에서 웹 앱을 만들고 Authentication의 Google 로그인을 활성화합니다.
2. Firestore Database와 Storage를 생성합니다.
3. `firebase-config.js.example` 내용을 참고해 `firebase-config.js`에 연결값을 입력합니다.
4. Authentication의 승인된 도메인에 `eunneun.github.io`를 추가합니다.

Firebase 연결 전에는 기록이 브라우저의 localStorage에 저장됩니다.

## 배포

`main` 브랜치에 반영하면 GitHub Actions가 GitHub Pages로 자동 배포합니다.
