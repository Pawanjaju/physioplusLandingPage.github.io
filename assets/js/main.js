/**
* Template Name: Bootslander - v4.7.0
* Template URL: https://bootstrapmade.com/bootslander-free-bootstrap-landing-page-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 20
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Initiate gallery lightbox 
   */
  const galleryLightbox = GLightbox({
    selector: '.gallery-lightbox'
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Chatbot widget
   */
  const chatbot = select('#chatbot')
  const chatbotToggle = select('#chatbot-toggle')
  const chatbotClose = select('#chatbot-close')
  const chatbotPanel = select('#chatbot-panel')
  const chatbotForm = select('#chatbot-form')
  const chatbotInput = select('#chatbot-text')
  const chatbotMessages = select('#chatbot-messages')

  const setChatOpen = (isOpen) => {
    if (!chatbot) return
    chatbot.classList.toggle('open', isOpen)
    if (chatbotToggle) {
      chatbotToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
    }
    if (isOpen && chatbotInput) {
      setTimeout(() => chatbotInput.focus(), 50)
    }
  }

  const addMessage = (text, who) => {
    if (!chatbotMessages) return
    const msg = document.createElement('div')
    msg.className = `chatbot-message ${who}`
    const bubble = document.createElement('div')
    bubble.className = 'bubble'
    bubble.textContent = text
    msg.appendChild(bubble)
    chatbotMessages.appendChild(msg)
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight
  }

  const getReply = (message) => {
    const text = message.toLowerCase()
    if (text.includes('appointment') || text.includes('book') || text.includes('booking')) {
      return 'You can book an appointment from the Book Your Appointment buttons, or share your name and preferred time and we will follow up.'
    }
    if (text.includes('price') || text.includes('pricing') || text.includes('cost') || text.includes('fee')) {
      return 'Pricing can vary by condition and session type. Share your concern and we can guide you to the right plan.'
    }
    if (text.includes('online') || text.includes('tele') || text.includes('video')) {
      return 'Online sessions are done over secure video calls. You only need a phone or laptop with a camera and internet.'
    }
    if (text.includes('location') || text.includes('address') || text.includes('where')) {
      return 'We are located in Solapur, Maharashtra. You can find the full address in the Contact section below.'
    }
    if (text.includes('phone') || text.includes('call') || text.includes('contact')) {
      return 'You can call us at +91 74475 54567. We are happy to help.'
    }
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      return 'Hi there! How can I help today?'
    }
    return 'Thanks for your message. Tell me a bit more and I will guide you.'
  }

  if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
      const isOpen = chatbot && chatbot.classList.contains('open')
      setChatOpen(!isOpen)
    })
  }

  if (chatbotClose) {
    chatbotClose.addEventListener('click', () => setChatOpen(false))
  }

  if (chatbotPanel) {
    chatbotPanel.addEventListener('click', (event) => event.stopPropagation())
  }

  document.addEventListener('click', (event) => {
    if (!chatbot) return
    if (!chatbot.contains(event.target)) {
      setChatOpen(false)
    }
  })

  if (chatbotForm) {
    chatbotForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const value = chatbotInput ? chatbotInput.value.trim() : ''
      if (!value) return
      addMessage(value, 'user')
      if (chatbotInput) chatbotInput.value = ''
      setChatOpen(true)
      setTimeout(() => {
        addMessage(getReply(value), 'bot')
      }, 400)
    })
  }

})()
