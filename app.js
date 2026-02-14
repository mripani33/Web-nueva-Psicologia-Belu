// Load and Apply Data from data.json
let siteData = null;

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            console.warn('data.json not found, using defaults');
            loadDefaults();
            return;
        }
        siteData = await response.json();
        applyAllData();
    } catch (error) {
        console.error('Error loading data:', error);
        loadDefaults();
    }
}

function loadDefaults() {
    siteData = {
        hero: {
            title: 'Un espacio seguro para tu bienestar emocional',
            subtitle: 'Acompañamiento profesional en terapia individual, de pareja y familiar. Presencial y online.',
            label: 'Psicología Clínica',
            btnPrimary: 'Primera Consulta Gratuita',
            btnSecondary: 'Conocer Más',
            backgroundImage: ''
        },
        about: {
            title: 'Comprometida con tu proceso de cambio',
            bio1: 'Soy psicóloga clínica colegiada con vocación de ayudar a las personas a encontrar su bienestar emocional.',
            bio2: 'Mi enfoque es humanista e integrativo, adaptándome a las necesidades únicas de cada persona.',
            bio3: 'Creo en el potencial de cambio de cada individuo y en la importancia de crear un espacio terapéutico seguro.',
            education: 'Licenciada en Psicología',
            colegiacion: 'XXXXX',
            experience: 'Más de X años de práctica clínica',
            image: ''
        },
        areas: [],
        approach: {
            title: 'Terapia centrada en la persona',
            description: '<p>Mi enfoque terapéutico es humanista e integrativo, lo que significa que adapto las técnicas y estrategias a las necesidades únicas de cada persona.</p><p>Creo firmemente en el potencial de cambio de cada individuo y en la importancia de crear un espacio terapéutico seguro, empático y libre de juicios.</p>',
            quote: 'El proceso terapéutico es un camino de autodescubrimiento donde aprenderás a reconocer tus fortalezas y a gestionar tus dificultades de manera más saludable.'
        },
        education: [],
        testimonials: [],
        blog: [],
        resources: [],
        faq: [],
        config: {
            name: 'María Belén Prieto',
            email: 'contacto@mariabelenprieto.com',
            whatsapp: '34XXXXXXXXX',
            phone: '+34 XXX XXX XXX',
            address: 'Madrid, España',
            docfavUrl: '',
            docfavWidget: '',
            instagram: '',
            linkedin: '',
            facebook: '',
            youtube: '',
            metaDescription: 'Psicóloga clínica especializada en terapia individual, de pareja y familiar. Atención presencial y online.',
            analytics: ''
        }
    };
    applyAllData();
}

function applyAllData() {
    applyHero();
    applyAbout();
    applyAreas();
    applyApproach();
    applyEducation();
    applyTestimonials();
    applyBlog();
    applyResources();
    applyFAQ();
    applyContact();
    applyConfig();
    initializeInteractions();
}

// Hero Section
function applyHero() {
    const { hero } = siteData;
    document.getElementById('hero-label').textContent = hero.label || 'Psicología Clínica';
    document.getElementById('hero-title').textContent = hero.title;
    document.getElementById('hero-subtitle').textContent = hero.subtitle;
    document.getElementById('hero-btn-1').textContent = hero.btnPrimary;
    document.getElementById('hero-btn-2').textContent = hero.btnSecondary;
    
    if (hero.backgroundImage) {
        document.getElementById('hero-background').style.backgroundImage = `url(${hero.backgroundImage})`;
    }
}

// About Section
function applyAbout() {
    const { about } = siteData;
    document.getElementById('about-title').textContent = about.title;
    document.getElementById('about-bio1').textContent = about.bio1;
    document.getElementById('about-bio2').textContent = about.bio2;
    if (about.bio3) {
        document.getElementById('about-bio3').textContent = about.bio3;
    }
    document.getElementById('about-education').textContent = about.education;
    document.getElementById('about-colegiacion').textContent = about.colegiacion;
    document.getElementById('about-experience').textContent = about.experience || 'Más de X años de práctica clínica';
    
    if (about.image) {
        const aboutImage = document.querySelector('.about-image-placeholder');
        aboutImage.style.backgroundImage = `url(${about.image})`;
        aboutImage.style.backgroundSize = 'cover';
        aboutImage.style.backgroundPosition = 'center';
    }
}

// Areas of Work
function applyAreas() {
    const { areas } = siteData;
    const areasGrid = document.getElementById('areas-grid');
    
    if (!areas || areas.length === 0) {
        areasGrid.innerHTML = `
            <div class="area-card">
                <div class="area-icon">💭</div>
                <h3>Terapia Individual</h3>
                <p>Acompañamiento personalizado para trabajar ansiedad, depresión, autoestima y crecimiento personal.</p>
            </div>
            <div class="area-card">
                <div class="area-icon">💑</div>
                <h3>Terapia de Pareja</h3>
                <p>Mejora la comunicación y fortalece la conexión emocional en tu relación.</p>
            </div>
            <div class="area-card">
                <div class="area-icon">👨‍👩‍👧</div>
                <h3>Terapia Familiar</h3>
                <p>Resolución de conflictos familiares y mejora de la dinámica del hogar.</p>
            </div>
        `;
        return;
    }
    
    areasGrid.innerHTML = areas.map(area => `
        <div class="area-card">
            <div class="area-icon">${area.icon || '✨'}</div>
            <h3>${area.name}</h3>
            <p>${area.description}</p>
        </div>
    `).join('');
}

// Approach Section
function applyApproach() {
    const { approach, config } = siteData;
    if (approach) {
        if (approach.title) {
            document.getElementById('approach-title').textContent = approach.title;
        }
        if (approach.description) {
            document.getElementById('approach-description').innerHTML = approach.description;
        }
        if (approach.quote) {
            document.getElementById('approach-quote').textContent = approach.quote;
        }
    }
    document.getElementById('config-name-quote').textContent = config.name;
}

// Education Timeline
function applyEducation() {
    const { education } = siteData;
    const timeline = document.getElementById('education-timeline');
    
    if (!education || education.length === 0) {
        timeline.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <span class="timeline-year">2020</span>
                    <h3>Formación especializada</h3>
                    <p>Agrega tu formación desde el panel de administración.</p>
                </div>
                <div style="flex: 1;"></div>
            </div>
        `;
        return;
    }
    
    timeline.innerHTML = education.map(item => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <span class="timeline-year">${item.year}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
            <div style="flex: 1;"></div>
        </div>
    `).join('');
}

// Testimonials
function applyTestimonials() {
    const { testimonials } = siteData;
    const slider = document.getElementById('testimonials-slider');
    
    if (!testimonials || testimonials.length === 0) {
        slider.innerHTML = `
            <div class="testimonial-card">
                <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
                <p class="testimonial-quote">"Un espacio de confianza donde pude trabajar mis emociones. Muy recomendable."</p>
                <div class="testimonial-author">
                    <div class="author-avatar">A</div>
                    <div class="author-info">
                        <h4>Anónimo</h4>
                        <p>Paciente</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    slider.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-stars">${'⭐'.repeat(t.rating || 5)}</div>
            <p class="testimonial-quote">"${t.text}"</p>
            <div class="testimonial-author">
                <div class="author-avatar">${t.name.charAt(0)}</div>
                <div class="author-info">
                    <h4>${t.name}</h4>
                    <p>${t.role || 'Paciente'}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Blog Section
function applyBlog() {
    const { blog } = siteData;
    const featuredContainer = document.getElementById('blog-featured');
    const blogGrid = document.getElementById('blog-grid');
    
    if (!blog || blog.length === 0) {
        featuredContainer.innerHTML = '';
        blogGrid.innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-light);">
                Próximamente artículos y recursos para tu bienestar.
            </p>
        `;
        return;
    }
    
    // Featured article (first one)
    const featured = blog[0];
    featuredContainer.innerHTML = `
        <div class="featured-article">
            <div class="featured-image" style="${featured.image ? `background-image: url(${featured.image})` : ''}"></div>
            <div class="featured-content">
                <span class="featured-tag">Destacado</span>
                <h2>${featured.title}</h2>
                <p class="featured-excerpt">${featured.content.substring(0, 200)}...</p>
                <div class="featured-meta">
                    <span>📅 ${featured.date}</span>
                    <span>⏱️ ${Math.ceil(featured.content.length / 1000)} min lectura</span>
                </div>
                <a href="#" class="btn-read-more" onclick="showFullArticle(${featured.id}); return false;">Leer artículo completo</a>
            </div>
        </div>
    `;
    
    // Other articles
    const otherArticles = blog.slice(1, 4); // Show 3 more
    if (otherArticles.length > 0) {
        blogGrid.innerHTML = otherArticles.map(post => `
            <div class="blog-card">
                <div class="blog-image" style="${post.image ? `background-image: url(${post.image})` : ''}"></div>
                <div class="blog-card-content">
                    <div class="blog-date">${post.date}</div>
                    <h3>${post.title}</h3>
                    <p class="blog-excerpt">${post.content.substring(0, 120)}...</p>
                    <a href="#" class="blog-link" onclick="showFullArticle(${post.id}); return false;">Leer más →</a>
                </div>
            </div>
        `).join('');
    } else {
        blogGrid.innerHTML = '';
    }
}

function showFullArticle(id) {
    const article = siteData.blog.find(a => a.id === id);
    if (article) {
        alert(`${article.title}\n\n${article.content}\n\n[En producción, esto abriría la página completa del artículo]`);
    }
}

// Resources
function applyResources() {
    const { resources } = siteData;
    const grid = document.getElementById('resources-grid');
    
    if (!resources || resources.length === 0) {
        grid.innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-light);">
                Recursos descargables próximamente.
            </p>
        `;
        return;
    }
    
    const iconMap = { pdf: '📄', audio: '🎵', video: '🎬' };
    
    grid.innerHTML = resources.map(r => `
        <div class="resource-card">
            <div class="resource-icon">${iconMap[r.type] || '📄'}</div>
            <h3>${r.title}</h3>
            <p>${r.description}</p>
            <a href="${r.file}" class="resource-download" download>Descargar ${r.type.toUpperCase()}</a>
        </div>
    `).join('');
}

// FAQ
function applyFAQ() {
    const { faq } = siteData;
    const accordion = document.getElementById('faq-accordion');
    
    if (!faq || faq.length === 0) {
        accordion.innerHTML = `
            <div class="faq-item">
                <button class="faq-question">¿Cómo es la primera sesión?</button>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        La primera sesión es un espacio de conocimiento mutuo donde podrás contarme qué te trae a consulta y evaluaremos juntos cómo puedo ayudarte.
                    </div>
                </div>
            </div>
            <div class="faq-item">
                <button class="faq-question">¿Cuánto dura una sesión?</button>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        Cada sesión tiene una duración aproximada de 50-60 minutos.
                    </div>
                </div>
            </div>
        `;
    } else {
        accordion.innerHTML = faq.map(item => `
            <div class="faq-item">
                <button class="faq-question">${item.question}</button>
                <div class="faq-answer">
                    <div class="faq-answer-content">${item.answer}</div>
                </div>
            </div>
        `).join('');
    }
    
    // Initialize FAQ accordion
    initializeFAQ();
}

// Contact & Config
function applyContact() {
    const { config } = siteData;
    
    document.getElementById('contact-email').href = `mailto:${config.email}`;
    document.getElementById('contact-email').textContent = config.email;
    document.getElementById('contact-phone').textContent = config.phone;
    document.getElementById('contact-address').textContent = config.address || 'Madrid, España';
    
    // DOCFAV Integration
    const calendarDiv = document.getElementById('calendar-integration');
    if (config.docfavUrl || config.docfavWidget) {
        if (config.docfavWidget) {
            calendarDiv.innerHTML = config.docfavWidget;
        } else {
            calendarDiv.innerHTML = `
                <iframe src="${config.docfavUrl}" 
                        style="width:100%;min-height:600px;border:none;border-radius:8px;"
                        title="Reservar cita"></iframe>
            `;
        }
    }
}

function applyConfig() {
    const { config } = siteData;
    
    // Update all name references
    document.getElementById('nav-logo').textContent = config.name;
    document.getElementById('footer-name').textContent = config.name;
    document.getElementById('footer-copy').textContent = config.name;
    document.getElementById('page-title').textContent = `${config.name} - Psicóloga Clínica`;
    
    // WhatsApp
    document.getElementById('whatsapp-float').href = `https://wa.me/${config.whatsapp}`;
    
    // Meta description
    if (config.metaDescription) {
        document.getElementById('meta-desc').setAttribute('content', config.metaDescription);
    }
    
    // Social links
    const socialDiv = document.getElementById('footer-social');
    let socialHTML = '';
    if (config.instagram) socialHTML += `<a href="${config.instagram}" target="_blank" aria-label="Instagram">IG</a>`;
    if (config.linkedin) socialHTML += `<a href="${config.linkedin}" target="_blank" aria-label="LinkedIn">LI</a>`;
    if (config.facebook) socialHTML += `<a href="${config.facebook}" target="_blank" aria-label="Facebook">FB</a>`;
    if (config.youtube) socialHTML += `<a href="${config.youtube}" target="_blank" aria-label="YouTube">YT</a>`;
    
    if (socialHTML) {
        socialDiv.innerHTML = socialHTML;
    }
    
    // Analytics
    if (config.analytics && config.analytics.startsWith('G-')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.analytics}`;
        document.head.appendChild(script);
        
        const script2 = document.createElement('script');
        script2.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${config.analytics}');
        `;
        document.head.appendChild(script2);
    }
}

// Interactive Elements
function initializeInteractions() {
    // Mobile menu
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    const nav = document.getElementById('main-nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Scroll reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    setTimeout(() => {
        document.querySelectorAll('.area-card, .modality-card, .testimonial-card, .blog-card, .resource-card, .timeline-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }, 100);
}

function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', function() {
            const wasActive = this.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.faq-question').forEach(btn => {
                btn.classList.remove('active');
                btn.nextElementSibling.classList.remove('active');
            });
            
            // Open clicked if it wasn't active
            if (!wasActive) {
                this.classList.add('active');
                this.nextElementSibling.classList.add('active');
            }
        });
    });
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadData);
// Funcionalidad para Áreas Clickeables con Modal Detallado

// Datos detallados de cada área (se puede cargar desde data.json también)
const areasDetailed = {
    1: {
        icon: "🧘",
        title: "Ansiedad y Estrés",
        subtitle: "Recupera la calma y aprende a gestionar la ansiedad de manera efectiva",
        description: "La ansiedad es una de las consultas más frecuentes en psicología. Juntos trabajaremos para que comprendas el origen de tu ansiedad y desarrolles herramientas prácticas para gestionarla.",
        sections: [
            {
                title: "¿Cómo te ayudo?",
                content: "Mediante técnicas de terapia cognitivo-conductual, mindfulness y relajación, aprenderás a identificar los pensamientos que generan ansiedad y a modificarlos. También trabajaremos en técnicas de respiración y gestión emocional."
            },
            {
                title: "Síntomas que trabajamos",
                list: [
                    "Preocupación excesiva y pensamientos rumiativos",
                    "Tensión muscular y síntomas físicos",
                    "Ataques de pánico",
                    "Dificultad para relajarte o descansar",
                    "Evitación de situaciones que generan ansiedad",
                    "Problemas de sueño relacionados con preocupaciones"
                ]
            },
            {
                title: "Resultados esperados",
                content: "Con el tratamiento adecuado, podrás reducir significativamente los síntomas de ansiedad, mejorar tu calidad de vida y desarrollar recursos para enfrentar situaciones estresantes de manera saludable."
            }
        ]
    },
    2: {
        icon: "🌱",
        title: "Depresión y Estado de Ánimo",
        subtitle: "Encuentra el camino de regreso a una vida plena y significativa",
        description: "La depresión puede hacer que todo se sienta pesado y sin sentido. En terapia trabajaremos para recuperar tu motivación, energía y capacidad de disfrutar la vida.",
        sections: [
            {
                title: "¿Cómo te ayudo?",
                content: "Utilizando terapia humanista e integrativa, exploraremos las causas de tu malestar y trabajaremos en activar conductas positivas, modificar pensamientos negativos y reconectar con lo que te da sentido."
            },
            {
                title: "Síntomas que trabajamos",
                list: [
                    "Tristeza persistente o sensación de vacío",
                    "Pérdida de interés en actividades que antes disfrutabas",
                    "Fatiga y falta de energía",
                    "Cambios en el apetito o el sueño",
                    "Dificultad para concentrarte",
                    "Pensamientos negativos sobre ti mismo",
                    "Aislamiento social"
                ]
            },
            {
                title: "Resultados esperados",
                content: "La terapia te ayudará a recuperar tu energía vital, mejorar tu estado de ánimo, reconectar con tus valores y encontrar nuevamente sentido y propósito en tu vida."
            }
        ]
    },
    3: {
        icon: "💑",
        title: "Terapia de Pareja",
        subtitle: "Mejora la comunicación y fortalece el vínculo con tu pareja",
        description: "Las relaciones pasan por diferentes etapas y a veces necesitamos ayuda profesional para superar crisis, mejorar la comunicación o fortalecer la conexión emocional.",
        sections: [
            {
                title: "¿Cómo te ayudo?",
                content: "Trabajaremos en un espacio seguro donde ambos puedan expresarse libremente. Aprenderán técnicas de comunicación efectiva, resolución de conflictos y fortalecimiento del vínculo emocional."
            },
            {
                title: "Situaciones que trabajamos",
                list: [
                    "Crisis de pareja y problemas de comunicación",
                    "Conflictos recurrentes y discusiones constantes",
                    "Infidelidad y reconstrucción de la confianza",
                    "Diferencias en la crianza de los hijos",
                    "Problemas de intimidad emocional o física",
                    "Toma de decisiones importantes (matrimonio, hijos, mudanzas)",
                    "Diferencias en valores o proyectos de vida"
                ]
            },
            {
                title: "Resultados esperados",
                content: "Las parejas que completan el proceso terapéutico logran comunicarse mejor, resolver conflictos de manera constructiva y recuperar la conexión emocional que los unió inicialmente."
            }
        ]
    },
    4: {
        icon: "✨",
        title: "Autoestima y Crecimiento Personal",
        subtitle: "Desarrolla una relación más sana y compasiva contigo mismo",
        description: "La autoestima es la base del bienestar emocional. Trabajaremos en fortalecer tu amor propio, confianza y capacidad para alcanzar tus objetivos.",
        sections: [
            {
                title: "¿Cómo te ayudo?",
                content: "Mediante ejercicios de autoconocimiento, reestructuración cognitiva y desarrollo de habilidades, aprenderás a valorarte, establecer límites saludables y perseguir tus metas con confianza."
            },
            {
                title: "Aspectos que trabajamos",
                list: [
                    "Autocrítica excesiva y diálogo interno negativo",
                    "Dificultad para establecer límites",
                    "Inseguridad y miedo al rechazo",
                    "Comparación constante con los demás",
                    "Perfeccionismo y miedo al fracaso",
                    "Dependencia emocional",
                    "Dificultad para tomar decisiones"
                ]
            },
            {
                title: "Resultados esperados",
                content: "Desarrollarás una autoimagen más positiva, aumentarás tu confianza, aprenderás a establecer límites saludables y te sentirás más capaz de alcanzar tus objetivos personales y profesionales."
            }
        ]
    },
    5: {
        icon: "🕊️",
        title: "Duelo y Pérdidas",
        subtitle: "Acompañamiento en momentos de pérdida y transformación",
        description: "El duelo es un proceso natural pero doloroso. Te acompaño en este camino para que puedas procesar la pérdida de manera saludable y encontrar un nuevo equilibrio.",
        sections: [
            {
                title: "¿Cómo te ayudo?",
                content: "Ofrezco un espacio seguro y empático donde puedes expresar tu dolor sin juicios. Trabajaremos a tu ritmo en las diferentes etapas del duelo, honrando tu proceso único."
            },
            {
                title: "Tipos de duelo que acompaño",
                list: [
                    "Pérdida de seres queridos",
                    "Rupturas de pareja o divorcios",
                    "Pérdida de empleo o cambios profesionales",
                    "Mudanzas o cambios de vida significativos",
                    "Duelo anticipado (enfermedades terminales)",
                    "Pérdidas gestacionales o infertilidad",
                    "Duelo complicado o prolongado"
                ]
            },
            {
                title: "Resultados esperados",
                content: "Aunque el dolor de la pérdida nunca desaparece completamente, la terapia te ayudará a procesarlo de manera saludable, encontrar significado y continuar con tu vida honrando lo que perdiste."
            }
        ]
    },
    6: {
        icon: "👨‍👩‍👧",
        title: "Terapia Familiar",
        subtitle: "Mejora la dinámica familiar y fortalece los vínculos",
        description: "Los conflictos familiares afectan a todos los miembros. Trabajaremos juntos para mejorar la comunicación, resolver problemas y crear un ambiente familiar más saludable.",
        sections: [
            {
                title: "¿Cómo te ayudo?",
                content: "Desde un enfoque sistémico, trabajaremos con todos los miembros de la familia para comprender las dinámicas relacionales, mejorar la comunicación y encontrar soluciones que beneficien a todos."
            },
            {
                title: "Situaciones que trabajamos",
                list: [
                    "Conflictos entre padres e hijos adolescentes",
                    "Problemas de comportamiento en niños",
                    "Divorcio y familias reconstituidas",
                    "Dificultades en la comunicación familiar",
                    "Roles familiares disfuncionales",
                    "Conflictos intergeneracionales",
                    "Adaptación a cambios familiares (nacimientos, mudanzas)"
                ]
            },
            {
                title: "Resultados esperados",
                content: "Las familias aprenden a comunicarse de manera más efectiva, resuelven conflictos de forma constructiva y crean un ambiente familiar más armónico y de apoyo mutuo."
            }
        ]
    }
};

// Función para abrir modal de área
function openAreaModal(areaId) {
    const area = areasDetailed[areaId];
    if (!area) return;
    
    // Crear modal si no existe
    let modal = document.getElementById('area-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'area-modal';
        modal.className = 'area-modal';
        document.body.appendChild(modal);
    }
    
    // Construir contenido
    let sectionsHTML = '';
    area.sections.forEach(section => {
        let contentHTML = '';
        if (section.content) {
            contentHTML = `<p>${section.content}</p>`;
        }
        if (section.list) {
            contentHTML += '<ul>' + section.list.map(item => `<li>${item}</li>`).join('') + '</ul>';
        }
        
        sectionsHTML += `
            <div class="area-modal-section">
                <h3>${section.title}</h3>
                ${contentHTML}
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div class="area-modal-content">
            <div class="area-modal-header">
                <button class="area-modal-close" onclick="closeAreaModal()">&times;</button>
                <div class="area-modal-icon">${area.icon}</div>
                <h2 class="area-modal-title">${area.title}</h2>
                <p class="area-modal-subtitle">${area.subtitle}</p>
            </div>
            <div class="area-modal-body">
                <div class="area-modal-section">
                    <p>${area.description}</p>
                </div>
                ${sectionsHTML}
            </div>
            <div class="area-modal-footer">
                <a href="#contacto" class="area-modal-cta" onclick="closeAreaModal()">
                    Reservar Primera Consulta Gratuita
                </a>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Click fuera del modal para cerrar
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeAreaModal();
        }
    };
}

// Función para cerrar modal
function closeAreaModal() {
    const modal = document.getElementById('area-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Cerrar modal con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAreaModal();
    }
});

// Hacer las áreas clickeables cuando se cargan
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que se carguen las áreas
    setTimeout(function() {
        const areaCards = document.querySelectorAll('.area-card');
        areaCards.forEach((card, index) => {
            const areaId = index + 1;
            card.style.cursor = 'pointer';
            card.onclick = function() {
                openAreaModal(areaId);
            };
            
            // Agregar indicador visual
            const footer = document.createElement('div');
            footer.className = 'area-card-footer';
            footer.innerHTML = `
                <span class="area-learn-more">
                    Conocer más →
                </span>
            `;
            card.appendChild(footer);
        });
    }, 500);
});
