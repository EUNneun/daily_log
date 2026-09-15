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

document.addEventListener('DOMContentLoaded', async () => {
  const authBtn = document.getElementById('authBtn');
  const profile = document.getElementById('profile');
  const syncStatus = document.getElementById('syncStatus');
  if (!authBtn || !profile) return;

  const style = document.createElement('style');
  style.textContent = `
    #profile{display:none!important}
    .color-count{border:0;border-radius:18px;background:#eef8f6;color:#2F9C95;padding:8px 12px;font-size:13px;font-weight:750;white-space:nowrap}
    .color-count b{font-size:15px;font-weight:850}
  `;
  document.head.appendChild(style);

  let badge = document.getElementById('colorCountBadge');
  if (!badge) {
    badge = document.createElement('button');
    badge.id = 'colorCountBadge';
    badge.type = 'button';
    badge.className = 'color-count hidden';
    badge.setAttribute('aria-label', 'Google 로그인 상태 및 누적 컬러 수');
    authBtn.insertAdjacentElement('afterend', badge);
  }

  const getCount = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('daycolor-v1'));
      return Array.isArray(saved?.records) ? saved.records.length : 0;
    } catch { return 0; }
  };
  const showLoggedIn = user => {
    authBtn.classList.add('hidden');
    badge.classList.remove('hidden');
    badge.innerHTML = `누적컬러 <b>${getCount()}</b>개`;
    if (syncStatus) syncStatus.textContent = `Google 로그인됨 · ${user?.email || ''}`;
  };
  const showLoggedOut = () => {
    authBtn.classList.remove('hidden');
    badge.classList.add('hidden');
    if (syncStatus) syncStatus.textContent = 'Google로 동기화하면 여러 기기에서 같은 기록을 볼 수 있습니다. 로그인 전에는 이 브라우저에 저장됩니다.';
  };

  try {
    const [{ initializeApp, getApps, getApp }, { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence }]
      = await Promise.all([
        import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js')
      ]);

    const app = getApps().length ? getApp() : initializeApp(window.DAYCOLOR_FIREBASE_CONFIG);
    const auth = getAuth(app);
    await setPersistence(auth, browserLocalPersistence);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    onAuthStateChanged(auth, user => user ? showLoggedIn(user) : showLoggedOut());

    authBtn.addEventListener('click', async event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      try {
        const result = await signInWithPopup(auth, provider);
        if (result?.user) {
          showLoggedIn(result.user);
          localStorage.setItem('daycolor-auth-ok', result.user.uid);
        } else {
          throw new Error('no-user-returned');
        }
      } catch (error) {
        console.error('Google login failed', error);
        const code = error?.code || error?.message || 'unknown-error';
        if (syncStatus) syncStatus.textContent = `Google 로그인 실패 · ${code}`;
        alert(`Google 로그인에 실패했습니다.\n${code}`);
      }
    }, true);

    badge.addEventListener('click', async () => {
      if (confirm('Google 계정 동기화를 종료할까요?')) {
        await signOut(auth);
        localStorage.removeItem('daycolor-auth-ok');
      }
    });
  } catch (error) {
    console.error('Firebase auth bootstrap failed', error);
    if (syncStatus) syncStatus.textContent = `Google 로그인 초기화 실패 · ${error?.code || error?.message || 'unknown-error'}`;
  }

  const recordList = document.getElementById('recordList');
  if (recordList) new MutationObserver(() => {
    if (!badge.classList.contains('hidden')) badge.innerHTML = `누적컬러 <b>${getCount()}</b>개`;
  }).observe(recordList, { childList: true, subtree: true });
});
