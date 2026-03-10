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

  // References to core site sections for access control.  When a user is
  // not logged in, these sections will be hidden so that the platform
  // requires authentication before viewing content.  Once logged in,
  // they are displayed again.  Additional sections can be added here if
  // new content areas are introduced.
  const heroSection = document.querySelector('.hero');
  const scheduleSection = document.getElementById('schedule');
  const aboutSection = document.getElementById('about');
  const contactSection = document.getElementById('contact');
  const videosSection = document.getElementById('videos');
  const navElement = document.querySelector('nav');

  // Reference to the account section (floating panel) and its toggle link
  const accountSection = document.getElementById('account');
  const accountLink = document.getElementById('account-link');

  // Toggle visibility of the floating account panel when clicking the Account link in the nav.
  if (accountLink) {
    accountLink.addEventListener('click', (e) => {
      // Prevent default anchor navigation (which would attempt to scroll)
      e.preventDefault();
      // Toggle the "visible" class on the account section
      accountSection.classList.toggle('visible');
    });
  }

  /*
   * Load recorded videos for the currently logged‑in user.  Each user
   * has their own list of uploaded or recorded videos stored under
   * the key `recordedVideos_USERNAME` in localStorage.  When no
   * videos exist for the user, a message is shown.  If the user is
   * not logged in, no videos will be shown and the message will
   * instruct them to log in or create an account.
   */
  function loadRecordedVideos() {
    const currentUser = localStorage.getItem('currentUser');
    // Clear container each time to avoid duplicates
    recordedVideosContainer.innerHTML = '';
    if (!currentUser) {
      noVideosMessage.textContent = 'Please log in to view your recorded videos.';
      noVideosMessage.style.display = 'block';
      return;
    }
    const key = `recordedVideos_${currentUser}`;
    const recorded = JSON.parse(localStorage.getItem(key) || '[]');
    if (recorded.length === 0) {
      noVideosMessage.textContent = 'No recordings yet. Upload a video or save a live stream to see it here.';
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
  // Initial loading of recorded videos will happen when the UI is updated.

  // Update the UI based on login state.  When no user is logged in, all
  // content sections are hidden and only the authentication forms are
  // displayed.  After login, the site sections are revealed and the
  // recorded videos for that user are loaded.
  function updateAuthUI() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      // User logged in: show account welcome and enable upload
      loginFormDiv.style.display = 'none';
      signupFormDiv.style.display = 'none';
      logoutSection.style.display = 'block';
      usernameDisplay.textContent = currentUser;
      uploadSection.style.display = 'block';
      // Hide the account panel after login to avoid covering content
      if (accountSection) {
        accountSection.classList.remove('visible');
      }
    } else {
      // Guest: show sign in/up forms and hide upload
      loginFormDiv.style.display = 'block';
      signupFormDiv.style.display = 'block';
      logoutSection.style.display = 'none';
      usernameDisplay.textContent = '';
      uploadSection.style.display = 'none';
      // Ensure the account panel remains open when guests toggle it
    }
    // Always load videos (per-user or empty) and show recorded videos to everyone
    loadRecordedVideos();
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

  // Upload handler.  When uploading a video, it is stored under the
  // current user’s key so that each account maintains its own list
  // of videos.  Guests cannot upload videos.
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
      const key = `recordedVideos_${currentUser}`;
      const recorded = JSON.parse(localStorage.getItem(key) || '[]');
      recorded.push({ name: file.name, dataUrl });
      localStorage.setItem(key, JSON.stringify(recorded));
      uploadInput.value = '';
      uploadMessage.textContent = 'Video uploaded successfully.';
      loadRecordedVideos();
    };
    reader.onerror = function () {
      uploadMessage.textContent = 'Error reading the video file.';
    };
    reader.readAsDataURL(file);
  });

  /*
   * Floating live video logic
   * When the user scrolls beyond the hero section, the live video
   * container will shrink and dock to the bottom right corner of the
   * viewport. When the hero section is visible, the video returns to
   * its original size and position. This provides a picture‑in‑picture
   * effect similar to video players on popular streaming sites.
   */
  const liveVideoContainer = document.getElementById('live-video-container');
  const heroSectionElement = document.getElementById('live');
  function handleFloatingVideo() {
    if (!liveVideoContainer || !heroSectionElement) return;
    const rect = heroSectionElement.getBoundingClientRect();
    if (rect.bottom <= 0) {
      liveVideoContainer.classList.add('floating');
    } else {
      liveVideoContainer.classList.remove('floating');
    }
  }
  // Run on scroll and on page load in case the page is opened scrolled down
  window.addEventListener('scroll', handleFloatingVideo);
  handleFloatingVideo();
});