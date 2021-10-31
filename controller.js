window.onload = () => 
{
  const navMenu = document.querySelector('.nav-menu');
  const navItems = document.querySelectorAll('.nav-item');
  const hamburger = document.querySelector('.nav-toggle');
  const toggle = e => e.classList.toggle('is-active');
  const toggleNav = ({ target }) => Array.from(navMenu.classList).includes('is-active') ? toggle(navMenu) : null;
  hamburger.addEventListener('click', () => toggle(navMenu, 'is-active'));
  Array.from(navItems).forEach(e => e.addEventListener('click', toggleNav));
}

document.addEventListener("DOMContentLoaded", function()
{
  window.addEventListener('scroll', function() 
  {
      if (window.scrollY > 50) 
      {
        document.getElementById('cl').classList.add('fixed-top');
        // add padding top to show content behind navbar
        navbar_height = document.querySelector('.navbar').offsetHeight;
        document.body.style.paddingTop = navbar_height + 'px';
      } 
      else 
      {
        document.getElementById('cl').classList.remove('fixed-top');
          // remove padding top from body
        document.body.style.paddingTop = '0';
      } 
    });
  }); 

