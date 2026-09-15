// DayColor Firebase web app configuration
window.DAYCOLOR_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBussL64qEf-3yV1HeUUhibrXQH1z-tPKI",
  authDomain: "daycolor-44bb0.firebaseapp.com",
  projectId: "daycolor-44bb0",
  storageBucket: "daycolor-44bb0.firebasestorage.app",
  messagingSenderId: "444468112714",
  appId: "1:444468112714:web:fd0c293f7e9ae0929a65b3",
  measurementId: "G-PSKNKW6GJ0"
};

// 로그인 후에는 상단 클라우드 동기화 버튼을 숨기고 프로필만 노출합니다.
document.addEventListener('DOMContentLoaded', () => {
  const authBtn = document.getElementById('authBtn');
  const profile = document.getElementById('profile');
  if (!authBtn || !profile) return;

  const syncAuthUi = () => {
    const loggedIn = !profile.classList.contains('hidden');
    authBtn.classList.toggle('hidden', loggedIn);
  };

  syncAuthUi();
  new MutationObserver(syncAuthUi).observe(profile, {
    attributes: true,
    attributeFilter: ['class']
  });
});
