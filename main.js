// Intro typing & skip
(function(){
  const lines = [
    '> در حال راه‌اندازی SilentKnights...',
    '> بارگذاری ماژول‌ها: [training] [research] [redteam] [blueteam] — موفق',
    '> دسترسی صادر شد [200]',
    'به SilentKnights خوش آمدید — وب سایت مستقلِ امنیتِ سایبریِ افغانستان',
    ''
  ];

  const term = document.getElementById('term');
  const intro = document.getElementById('intro');
  let li = 0, ci = 0, skipped = false;

  function type(){
    if(skipped) return;
    if(li < lines.length){
      const line = lines[li];
      if(ci < line.length){
        term.textContent += line.charAt(ci++);
        setTimeout(type, 18 + Math.random()*20);
      } else {
        term.textContent += '\n';
        li++;ci=0;setTimeout(type, 400);
      }
      term.scrollTop = term.scrollHeight;
    } else {
      setTimeout(closeIntro, 700);
    }
  }
  
  function closeIntro(){
    if(skipped) return; 
    skipped=true;
    intro.classList.add('fade-out');
    setTimeout(()=>{ 
      try{ 
        intro.remove(); 
        document.getElementById('home').focus(); 
      }catch(e){} 
    },650);
  }
  
  document.addEventListener('keydown', (e)=>{ 
    if(e.key==='Enter') closeIntro(); 
    if(e.key==='Escape') closeIntro(); 
  });
  
  intro.addEventListener('click', closeIntro);
  type();
  setTimeout(closeIntro, 7500);
})();

// Active menu highlight on scroll (RTL aware)
(function(){
  const links = Array.from(document.querySelectorAll('nav.menu a'));
  const allLinks = links.concat(Array.from(document.querySelectorAll('#nav-panel nav a')));
  const sections = allLinks.map(a => document.querySelector(a.getAttribute('href')));
  
  function onScroll(){
    const offset = window.scrollY + (parseInt(getComputedStyle(document.documentElement).fontSize) * 6) + 30;
    let idx = 0;
    sections.forEach((sec,i)=>{ 
      if(sec && sec.offsetTop <= offset) idx = i; 
    });
    links.forEach(l=>l.classList.remove('active'));
    if(links[idx]) links[idx].classList.add('active');
  }
  
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

// Mobile nav toggle - COMPLETELY FIXED
(function(){
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('nav-drawer');
  const panel = document.getElementById('nav-panel');
  const closeBtn = document.getElementById('nav-close');

  // Check if all elements exist
  if (!hamburger || !drawer || !panel || !closeBtn) {
    console.error('Mobile nav elements not found!');
    return;
  }

  // Initialize - ensure menu is closed
  drawer.style.display = 'none';
  panel.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');

  function openNav(){
    console.log('Opening mobile menu');
    drawer.style.display = 'block';
    setTimeout(() => {
      panel.classList.add('open');
    }, 10);
    drawer.setAttribute('aria-hidden','false');
    hamburger.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
    
    // Change hamburger to X
    hamburger.innerHTML = '✕';
  }
  
  function closeNav(){
    console.log('Closing mobile menu');
    panel.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    hamburger.setAttribute('aria-expanded','false');
    
    setTimeout(() => { 
      drawer.style.display = 'none'; 
      document.body.style.overflow = '';
    }, 300);
    
    // Change back to hamburger
    hamburger.innerHTML = '☰';
  }
  
  // Event listeners - handle both click and touchstart for mobile
  function toggleNav(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const isOpen = drawer.style.display === 'block' && panel.classList.contains('open');
    
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  }
  
  hamburger.addEventListener('click', toggleNav);
  hamburger.addEventListener('touchend', function(e) {
    e.preventDefault();
    toggleNav();
  });
  
  closeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeNav();
  });
  
  closeBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeNav();
  });
  
  drawer.addEventListener('click', function(e) {
    if (e.target === drawer) {
      closeNav();
    }
  });
  
  // Use event delegation for all links in the panel
  panel.addEventListener('click', function(e) {
    // Check if clicked element is a link
    const link = e.target.closest('a');
    if (!link) return;
    
    // If it's the register button, handle specially
    if (link.classList.contains('mobile-register-btn')) {
      console.log('Register button clicked - navigating');
      e.stopPropagation();
      // Let browser navigate, then close menu
      setTimeout(function() {
        if (panel.classList.contains('open')) {
          closeNav();
        }
      }, 500);
      return;
    }
    
    // If it's a dropdown button, don't close
    if (link.classList.contains('dropdown-btn')) {
      return;
    }
    
    // For other links, close menu after a short delay
    setTimeout(closeNav, 100);
  }, false);
  
  // Escape key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      closeNav();
    }
  });

  // Debug info
  console.log('Mobile nav initialized successfully:', {
    hamburger: !!hamburger,
    drawer: !!drawer,
    panel: !!panel,
    closeBtn: !!closeBtn
  });
})();

// Dropdown functionality - FIXED
(function(){
  const dropdownBtn = document.getElementById('exam-dropdown');
  const dropdownContent = document.getElementById('exam-dropdown-content');
  const dropdownBtnMobile = document.getElementById('exam-dropdown-mobile');
  const dropdownContentMobile = document.getElementById('exam-dropdown-content-mobile');

  function toggleDropdown(btn, content) {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isExpanded);
    btn.classList.toggle('active');
    
    if (content.classList.contains('show')) {
      content.classList.remove('show');
    } else {
      content.classList.add('show');
    }
  }

  // Desktop dropdown
  if (dropdownBtn && dropdownContent) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(dropdownBtn, dropdownContent);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
        dropdownBtn.setAttribute('aria-expanded', 'false');
        dropdownBtn.classList.remove('active');
        dropdownContent.classList.remove('show');
      }
    });
  }

  // Mobile dropdown - FIXED
  if (dropdownBtnMobile && dropdownContentMobile) {
    dropdownBtnMobile.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      toggleDropdown(dropdownBtnMobile, dropdownContentMobile);
    });

    // Close mobile dropdown when clicking on links
    const mobileDropdownLinks = dropdownContentMobile.querySelectorAll('a');
    mobileDropdownLinks.forEach(link => {
      link.addEventListener('click', () => {
        dropdownBtnMobile.setAttribute('aria-expanded', 'false');
        dropdownBtnMobile.classList.remove('active');
        dropdownContentMobile.classList.remove('show');
      });
    });
    
    // Close mobile dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownBtnMobile.contains(e.target) && !dropdownContentMobile.contains(e.target)) {
        dropdownBtnMobile.setAttribute('aria-expanded', 'false');
        dropdownBtnMobile.classList.remove('active');
        dropdownContentMobile.classList.remove('show');
      }
    });
  }
})();

// Contact form handling
(function(){
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // Remove the inline onsubmit handler first
    contactForm.onsubmit = null;
    
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      
      // Simple validation
      const inputs = this.querySelectorAll('input[required], textarea[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#E31E27';
        } else {
          input.style.borderColor = '';
        }
      });
      
      if (isValid) {
        // Show success message
        alert('ممنون — پیام شما دریافت شد. ما در اسرع وقت پاسخ می‌دهیم.');
        this.reset();
      } else {
        alert('لطفاً تمام فیلدهای ضروری را پر کنید.');
      }
    });
    
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      input.addEventListener('input', function() {
        if (this.value.trim()) {
          this.style.borderColor = '';
        }
      });
    });
  }
})();

// Enhanced smooth scrolling for anchor links
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without page reload
        history.pushState(null, null, targetId);
      }
    });
  });
})();

// Enhanced loading animation for cards
(function(){
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      }
    });
  }, observerOptions);
  
  // Observe cards for animation
  document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    observer.observe(card);
  });
})();

// Page load enhancements
document.addEventListener('DOMContentLoaded', function() {
  // Add loaded class for CSS transitions
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
  
  // Preload critical images
  const criticalImages = ['logo.png'];
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
  
  console.log('Silent Knights website loaded successfully');
});
