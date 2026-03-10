/*
 * Custom JavaScript for Live Stream Hub.
 *
 * Currently this script handles toggling the navigation
 * menu on small screens. It can be expanded later to
 * include additional interactivity or fetch dynamic data.
 */

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('nav ul');

  // Toggle navigation visibility on small screens
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  /*
   * Authentication and video upload logic.
   * Users are stored in localStorage in a simple object keyed by username.
   * Passwords are stored in plain text for demonstration purposes only.
   */
  const loginFormDiv = document.getElementById('login-form');
  const signupFormDiv = document.getElementById('signup-form');
  const logoutSection = document.getElementById('logout-section');
  const usernameDisplay = document.getElementById('username-display');

  const loginUsernameInput = document.getElementById('login-username');
  const loginPasswordInput = document.getElementById('login-password');
  const loginBtn = document.getElementById('login-btn');
  const loginMessage = document.getElementById('login-message');

  const signupUsernameInput = document.getElementById('signup-username');
  const signupPasswordInput = document.getElementById('signup-password');
  const signupBtn = document.getElementById('signup-btn');
  const signupMessage = document.getElementById('signup-message');

  const logoutBtn = document.getElementById('logout-btn');

  const uploadSection = document.getElementById('upload');
  const uploadInput = document.getElementById('video-file');
  const uploadBtn = document.getElementById('upload-btn');
  const uploadMessage = document.getElementById('upload-message');

  const recordedVideosContainer = document.getElementById('recorded-videos-container');
  const noVideosMessage = document.getElementById('no-videos-message');

  // Load recorded videos from localStorage and render them
  function loadRecordedVideos() {
    const recorded = JSON.parse(localStorage.getItem('recordedVideos') || '[]');
    recordedVideosContainer.innerHTML = '';
    if (recorded.length === 0) {
      noVideosMessage.style.display = 'block';
    } else {
      noVideosMessage.style.display = 'none';
      recorded.forEach(video => {
        const vidEl = document.createElement('video');
        vidEl.controls = true;
        vidEl.src = video.dataUrl;
        vidEl.title = video.name;
        recordedVideosContainer.appendChild(vidEl);
      });
    }
  }
  loadRecordedVideos();

  // Update the UI based on login state
  function updateAuthUI() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      loginFormDiv.style.display = 'none';
      signupFormDiv.style.display = 'none';
      logoutSection.style.display = 'block';
      usernameDisplay.textContent = currentUser;
      uploadSection.style.display = 'block';
    } else {
      loginFormDiv.style.display = 'block';
      signupFormDiv.style.display = 'block';
      logoutSection.style.display = 'none';
      usernameDisplay.textContent = '';
      uploadSection.style.display = 'none';
    }
  }
  updateAuthUI();

  // Sign up handler
  signupBtn.addEventListener('click', () => {
    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value;
    signupMessage.textContent = '';
    if (!username || !password) {
      signupMessage.textContent = 'Please enter a username and password.';
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
      signupMessage.textContent = 'Username already exists. Please choose another one.';
      return;
    }
    // Store the new user (note: no hashing for demonstration purposes)
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', username);
    // Clear inputs and update UI
    signupUsernameInput.value = '';
    signupPasswordInput.value = '';
    signupMessage.textContent = 'Account created! You are now logged in.';
    updateAuthUI();
  });

  // Login handler
  loginBtn.addEventListener('click', () => {
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value;
    loginMessage.textContent = '';
    if (!username || !password) {
      loginMessage.textContent = 'Please enter your username and password.';
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[username] || users[username] !== password) {
      loginMessage.textContent = 'Invalid username or password.';
      return;
    }
    localStorage.setItem('currentUser', username);
    loginUsernameInput.value = '';
    loginPasswordInput.value = '';
    loginMessage.textContent = 'Logged in successfully.';
    updateAuthUI();
  });

  // Logout handler
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    updateAuthUI();
  });

  // Upload handler
  uploadBtn.addEventListener('click', () => {
    uploadMessage.textContent = '';
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      uploadMessage.textContent = 'You must be logged in to upload videos.';
      return;
    }
    const file = uploadInput.files[0];
    if (!file) {
      uploadMessage.textContent = 'Please choose a video file.';
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      const dataUrl = e.target.result;
      const recorded = JSON.parse(localStorage.getItem('recordedVideos') || '[]');
      recorded.push({ name: file.name, dataUrl });
      localStorage.setItem('recordedVideos', JSON.stringify(recorded));
      uploadInput.value = '';
      uploadMessage.textContent = 'Video uploaded successfully.';
      loadRecordedVideos();
    };
    reader.onerror = function () {
      uploadMessage.textContent = 'Error reading the video file.';
    };
    reader.readAsDataURL(file);
  });
});