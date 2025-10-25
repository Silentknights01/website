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
      if(skipped) return; skipped=true;
      intro.classList.add('fade-out');
      setTimeout(()=>{ try{ intro.remove(); document.getElementById('home').focus(); }catch(e){} },650);
    }
    document.addEventListener('keydown', (e)=>{ if(e.key==='Enter') closeIntro(); if(e.key==='Escape') closeIntro(); });
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
      sections.forEach((sec,i)=>{ if(sec && sec.offsetTop <= offset) idx = i; });
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

    let isOpen = false;

    function openNav(){
      if(isOpen) return;
      isOpen = true;
      drawer.style.display = 'block';
      setTimeout(() => {
        panel.classList.add('open');
      }, 10);
      drawer.setAttribute('aria-hidden','false');
      hamburger.setAttribute('aria-expanded','true');
      document.body.style.overflow = 'hidden';
    }
    
    function closeNav(){
      if(!isOpen) return;
      isOpen = false;
      panel.classList.remove('open');
      drawer.setAttribute('aria-hidden','true');
      hamburger.setAttribute('aria-expanded','false');
      
      setTimeout(() => { 
        drawer.style.display = 'none'; 
        document.body.style.overflow = '';
      }, 300);
    }
    
    // Event listeners
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      if(isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });
    
    closeBtn.addEventListener('click', closeNav);
    
    drawer.addEventListener('click', function(e) {
      if(e.target === drawer) {
        closeNav();
      }
    });
    
    // Close on link click
    const panelLinks = panel.querySelectorAll('a');
    panelLinks.forEach(link => {
      link.addEventListener('click', closeNav);
    });
    
    // Escape key to close
    document.addEventListener('keydown', function(e) {
      if(e.key === 'Escape' && isOpen) {
        closeNav();
      }
    });
  })();

  // Dropdown functionality - FIXED FOR MOBILE
  (function(){
    const dropdownBtn = document.getElementById('exam-dropdown');
    const dropdownContent = document.getElementById('exam-dropdown-content');
    const dropdownBtnMobile = document.getElementById('exam-dropdown-mobile');
    const dropdownContentMobile = document.getElementById('exam-dropdown-content-mobile');

    function toggleDropdown(btn, content) {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isExpanded);
      btn.classList.toggle('active');
      
      if(content.classList.contains('show')) {
        content.classList.remove('show');
      } else {
        content.classList.add('show');
      }
    }

    // Desktop dropdown
    if(dropdownBtn && dropdownContent) {
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
    if(dropdownBtnMobile && dropdownContentMobile) {
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
    }
  })();

  // Form handling with validation
  (function(){
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
      contactForm.addEventListener('submit', function(e){
        e.preventDefault();
        
        // Simple validation
        const inputs = this.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
          if(!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#E31E27';
          } else {
            input.style.borderColor = '';
          }
        });
        
        if(isValid) {
          // Show success message
          alert('ممنون — پیام شما دریافت شد. ما در اسرع وقت پاسخ می‌دهیم.');
          this.reset();
        } else {
          alert('لطفاً تمام فیلدهای ضروری را پر کنید.');
        }
      });
    }
  })();

  // Smooth scrolling for anchor links
  (function(){
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
          const navHeight = document.querySelector('.nav').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  })();

  // Add loading animation for cards
  (function(){
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    // Observe cards for animation
    document.querySelectorAll('.card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  })();