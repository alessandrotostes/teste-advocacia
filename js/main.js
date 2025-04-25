// Fulano Advocacia - JavaScript Principal
// Desenvolvido para site de portfólio de advocacia
// Versão 1.0

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Inicialização de tooltips e popovers do Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Animação de rolagem suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Verifica se o elemento existe
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Calcula a posição de rolagem considerando o menu fixo
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Fecha o menu mobile se estiver aberto
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });

    // Efeito de revelação ao rolar a página
    const revealElements = document.querySelectorAll('.reveal');
    
    function reveal() {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('active');
            }
        }
    }
    
    window.addEventListener('scroll', reveal);
    reveal(); // Executa uma vez ao carregar a página

    // Contador de números para seção de estatísticas
    const counters = document.querySelectorAll('.counter');
    
    function startCounter() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 100;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(startCounter, 30);
            } else {
                counter.innerText = target;
            }
        });
    }
    
    // Inicia o contador quando a seção estiver visível
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounter();
                observer.unobserve(statsSection);
            }
        });
        
        observer.observe(statsSection);
    }

    // Validação de formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Validação de email
            const emailField = contactForm.querySelector('#email');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('is-invalid');
                }
            }
            
            // Validação de telefone
            const phoneField = contactForm.querySelector('#phone');
            if (phoneField && phoneField.value) {
                const phonePattern = /^[\d\s\-\(\)]+$/;
                if (!phonePattern.test(phoneField.value)) {
                    isValid = false;
                    phoneField.classList.add('is-invalid');
                }
            }
            
            if (isValid) {
                // Simulação de envio do formulário
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                
                // Simula uma requisição AJAX
                setTimeout(() => {
                    // Exibe mensagem de sucesso
                    const formContainer = contactForm.parentElement;
                    const successMessage = document.createElement('div');
                    successMessage.className = 'alert alert-success mt-4';
                    successMessage.innerHTML = '<strong>Mensagem enviada com sucesso!</strong> Entraremos em contato em breve.';
                    
                    // Limpa o formulário
                    contactForm.reset();
                    
                    // Adiciona a mensagem de sucesso
                    formContainer.appendChild(successMessage);
                    
                    // Restaura o botão
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                    
                    // Remove a mensagem após alguns segundos
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }, 1500);
            }
        });
        
        // Remove a classe is-invalid quando o usuário começa a digitar
        contactForm.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    }

    // Efeito de parallax para seções com fundo
    function parallaxEffect() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementPosition = element.offsetTop;
            const distance = scrollPosition - elementPosition;
            const speed = element.getAttribute('data-speed') || 0.5;
            
            if (scrollPosition > elementPosition - window.innerHeight && 
                scrollPosition < elementPosition + element.offsetHeight) {
                element.style.backgroundPositionY = `${distance * speed}px`;
            }
        });
    }
    
    window.addEventListener('scroll', parallaxEffect);
    
    // Adiciona classe ativa ao menu quando a seção correspondente está visível
    function activeMenuOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100; // Ajuste para o menu fixo
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove classe ativa de todos os links
                document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Adiciona classe ativa ao link correspondente
                const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
                
                // Para o menu lateral
                document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                const activeSidebarLink = document.querySelector(`.sidebar-nav .nav-link[href="#${sectionId}"]`);
                if (activeSidebarLink) {
                    activeSidebarLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', activeMenuOnScroll);
    
    // Botão "Voltar ao topo"
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Adiciona classe 'scrolled' ao menu quando a página é rolada
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Inicializa o carrossel de depoimentos com intervalo personalizado
    const testimonialCarousel = document.getElementById('testimonialCarousel');
    if (testimonialCarousel) {
        const carousel = new bootstrap.Carousel(testimonialCarousel, {
            interval: 5000,
            wrap: true
        });
    }
    
    // Máscara para campo de telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                // Formato: (XX) XXXXX-XXXX
                if (value.length <= 2) {
                    value = `(${value}`;
                } else if (value.length <= 7) {
                    value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
                } else if (value.length <= 11) {
                    value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
                } else {
                    value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7, 11)}`;
                }
            }
            e.target.value = value;
        });
    }
});
