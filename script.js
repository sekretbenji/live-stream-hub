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
});