// app-firebase.js - VERSIÓN COMPLETA CON TODAS LAS SECCIONES

let db;
let siteData = {};

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAXO7GpF5cMkVBF_9QV8w7S-4MKzKD2rEI",
    authDomain: "maria-belen-prieto-web.firebaseapp.com",
    projectId: "maria-belen-prieto-web",
    storageBucket: "maria-belen-prieto-web.firebasestorage.app",
    messagingSenderId: "610348524774",
    appId: "1:610348524774:web:3d4c7e33c2f8e09dc35c2d"
};

// Initialize Firebase
function initFirebase() {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('✅ Firebase initialized');
        loadDataFromFirebase();
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error);
    }
}

// Load data from Firebase
async function loadDataFromFirebase() {
    try {
        const doc = await db.collection('siteData').doc('main').get();
        
        if (doc.exists) {
            siteData = doc.data();
            console.log('✅ Data loaded from Firebase');
            console.log('Hero data:', siteData.hero);
            console.log('About data:', siteData.about);
            console.log('FAQ data:', siteData.faq);
            console.log('Areas data:', siteData.areas);
            
            // Apply all data to the page
            applyAllData();
        } else {
            console.warn('⚠️ No data found in Firebase');
        }
    } catch (error) {
        console.error('❌ Error loading from Firebase:', error);
    }
}

// Apply all data to the page
function applyAllData() {
    console.log('🔄 Applying all data to page...');
// Blog (solo destacados para home)
    loadBlogFeatured();
    
    // HERO
    if (siteData.hero) {
        console.log('🏠 Loading Hero section...');
        loadHero();
    }
    
    // ABOUT
    if (siteData.about) {
        console.log('👤 Loading About section...');
        loadAbout();
    }
    
    // AREAS
    if (siteData.areas && siteData.areas.length > 0) {
        console.log('🎯 Loading Areas with', siteData.areas.length, 'specialties');
        loadAreas();
    }
    
    // FAQ
    if (siteData.faq && siteData.faq.length > 0) {
        console.log('📝 Loading FAQ with', siteData.faq.length, 'questions');
        loadFAQ();
    }

    // Testimonios
    if (siteData.testimonios && siteData.testimonios.length > 0) {
        console.log('⭐ Loading Testimonios with', siteData.testimonios.length, 'reviews');
        loadTestimonios();
    }
    console.log('✅ All data applied to page');
}

// ==========================================
// HERO FUNCTIONS
// ==========================================

function loadHero() {
    const hero = siteData.hero;
    const heroSection = document.getElementById('inicio');
    
    if (!heroSection) {
        console.log('❌ Hero section not found');
        return;
    }
    
    // Etiqueta
    const label = document.querySelector('.hero-label, .section-tag');
    if (label && hero.label) {
        label.textContent = hero.label;
        label.className = 'section-tag hero-label';
    }
    
    // Título
    const title = document.querySelector('.hero-title, #inicio h1');
    if (title && hero.title) {
        title.textContent = hero.title;
        title.className = 'hero-title';
    }
    
    // Subtítulo
    const subtitle = document.querySelector('.hero-subtitle, #inicio p');
    if (subtitle && hero.subtitle) {
        subtitle.textContent = hero.subtitle;
        subtitle.className = 'hero-subtitle';
    }
    
    // Botones
    const buttons = document.querySelectorAll('#inicio .btn-primary, #inicio .btn-secondary');
    if (buttons.length >= 2 && hero.btnPrimary && hero.btnSecondary) {
        buttons[0].textContent = hero.btnPrimary;
        buttons[0].className = 'btn-primary btn-hero-primary';
        buttons[1].textContent = hero.btnSecondary;
        buttons[1].className = 'btn-secondary btn-hero-secondary';
    }
    
    // Imagen de fondo
    if (hero.backgroundImage) {
        heroSection.classList.add('has-background');
        heroSection.style.backgroundImage = `url(${hero.backgroundImage})`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
    }
    
    console.log('✅ Hero section loaded');
}

// ==========================================
// ABOUT FUNCTIONS
// ==========================================

function loadAbout() {
    const about = siteData.about;
    
    // Título
    const title = document.querySelector('#sobre-mi h2, .about-title');
    if (title && about.title) {
        title.textContent = about.title;
    }
    
    // Biografía
    const bio1 = document.querySelector('.about-bio-1');
    const bio2 = document.querySelector('.about-bio-2');
    const bio3 = document.querySelector('.about-bio-3');
    
    if (bio1 && about.bio1) bio1.textContent = about.bio1;
    if (bio2 && about.bio2) bio2.textContent = about.bio2;
    if (bio3 && about.bio3) bio3.textContent = about.bio3;
    
    // Credenciales
    const education = document.querySelector('#about-education');
    const colegiacion = document.querySelector('#about-colegiacion');
    const experience = document.querySelector('#about-experience');
    
    if (education && about.education) education.textContent = about.education;
    if (colegiacion && about.colegiacion) colegiacion.textContent = about.colegiacion;
    if (experience && about.experience) experience.textContent = about.experience;
    
    // Imagen
    const image = document.querySelector('#about-image, .about-image');
    if (image && about.image) {
        image.style.backgroundImage = `url(${about.image})`;
        image.style.backgroundSize = 'cover';
        image.style.backgroundPosition = 'center';
        console.log('✅ About image loaded:', about.image);
    }
    
    console.log('✅ About section loaded');
}

// ==========================================
// AREAS DE TRABAJO FUNCTIONS
// ==========================================

function loadAreas() {
    console.log('🎯 loadAreas() called');
    
    if (!siteData.areas || siteData.areas.length === 0) {
        console.log('❌ No areas data');
        const areasGrid = document.getElementById('areas-grid');
        if (areasGrid) {
            areasGrid.innerHTML = '<p style="text-align: center; color: #999;">No hay especialidades configuradas</p>';
        }
        return;
    }
    
    const areasGrid = document.getElementById('areas-grid');
    if (!areasGrid) {
        console.log('❌ Areas grid not found');
        return;
    }
    
    console.log('✅ Areas grid found');
    console.log('✅ Creating HTML for', siteData.areas.length, 'areas');
    
    areasGrid.innerHTML = siteData.areas.map((area, index) => `
        <div class="area-card" data-index="${index}">
            <div class="area-header" onclick="toggleArea(${index})">
                <div class="area-icon">
                    ${area.image ? 
                        `<img src="${area.image}" alt="${area.name}">` : 
                        area.icon || '🧠'
                    }
                </div>
                <div class="area-header-content">
                    <h3 class="area-name">${area.name}</h3>
                    <p class="area-short-description">${area.shortDescription || area.description.substring(0, 80) + '...'}</p>
                </div>
                <div class="area-toggle">▼</div>
            </div>
            <div class="area-content">
                <div class="area-content-inner">
                    <div class="area-full-description">
                        ${area.fullDescription || area.description}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('✅ Areas HTML created successfully!');
}

function toggleArea(index) {
    const card = document.querySelector(`.area-card[data-index="${index}"]`);
    if (!card) return;
    
    const isExpanded = card.classList.contains('expanded');
    
    // Cerrar todas
    document.querySelectorAll('.area-card').forEach(c => {
        c.classList.remove('expanded');
    });
    
    // Abrir esta si no estaba abierta
    if (!isExpanded) {
        card.classList.add('expanded');
    }
}

// ==========================================
// FAQ FUNCTIONS
// ==========================================

function loadFAQ() {
    console.log('🔍 loadFAQ() called');
    
    if (!siteData.faq || siteData.faq.length === 0) {
        console.log('❌ No FAQ data');
        return;
    }
    
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer) {
        console.log('❌ FAQ container not found');
        return;
    }
    
    console.log('✅ FAQ container found');
    console.log('✅ Creating HTML for', siteData.faq.length, 'questions');
    
    faqContainer.innerHTML = siteData.faq.map((item, index) => `
        <div class="faq-item">
            <button class="faq-question" onclick="toggleFAQ(${index})">
                <span>${item.question}</span>
                <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer" id="faq-answer-${index}">
                <p>${item.answer}</p>
            </div>
        </div>
    `).join('');
    
    console.log('✅ FAQ HTML created successfully!');
}

function toggleFAQ(index) {
    const answer = document.getElementById(`faq-answer-${index}`);
    if (!answer) return;
    
    const button = answer.previousElementSibling;
    const icon = button.querySelector('.faq-icon');
    const isOpen = answer.classList.contains('active');
    
    // Cerrar todas
    document.querySelectorAll('.faq-answer').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.faq-icon').forEach(item => {
        item.textContent = '+';
    });
    
    // Abrir esta si no estaba abierta
    if (!isOpen) {
        answer.classList.add('active');
        icon.textContent = '−';
    }
}
// ==========================================
// TESTIMONIOS FUNCTIONS
// ==========================================

function loadTestimonios() {
    console.log('⭐ loadTestimonios() called');
    
    if (!siteData.testimonios || siteData.testimonios.length === 0) {
        const grid = document.getElementById('testimonios-grid');
        if (grid) {
            grid.innerHTML = '<p style="text-align: center; color: #999;">No hay testimonios disponibles</p>';
        }
        return;
    }
    
    const grid = document.getElementById('testimonios-grid');
    const countEl = document.getElementById('testimonios-count');
    
    if (!grid) {
        console.log('❌ Testimonios grid not found');
        return;
    }
    
    // Actualizar contador
    if (countEl) {
        countEl.textContent = siteData.testimonios.length;
    }
    
    console.log('✅ Creating HTML for', siteData.testimonios.length, 'testimonios');
    
    grid.innerHTML = siteData.testimonios.map((testimonio, index) => {
        // Generar estrellas
        const stars = Array(5).fill(0).map((_, i) => {
            const filled = i < (testimonio.rating || 5);
            return `<span class="star ${filled ? 'filled' : 'empty'}">★</span>`;
        }).join('');
        
        // Obtener inicial del nombre
        const inicial = testimonio.nombre ? testimonio.nombre.charAt(0).toUpperCase() : 'A';
        
        // Formatear fecha
        const fecha = testimonio.fecha ? new Date(testimonio.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : '';
        
        return `
            <div class="testimonio-card">
                <div class="testimonio-header">
                    <div class="testimonio-avatar">
                        ${testimonio.foto ? 
                            `<img src="${testimonio.foto}" alt="${testimonio.nombre}">` : 
                            inicial
                        }
                    </div>
                    <div class="testimonio-info">
                        <div class="testimonio-nombre">${testimonio.nombre}</div>
                        ${fecha ? `<div class="testimonio-fecha">${fecha}</div>` : ''}
                    </div>
                </div>
                <div class="testimonio-rating">
                    ${stars}
                </div>
                <div class="testimonio-texto">
                    ${testimonio.texto}
                </div>
            </div>
        `;
    }).join('');
    
    console.log('✅ Testimonios HTML created successfully!');
}

// ==========================================
// FIN TESTIMONIOS FUNCTIONS
// ==========================================

// ==========================================
// BLOG FUNCTIONS - HOME (Featured)
// ==========================================

async function loadBlogFeatured() {
    console.log('=== BLOG DEBUG START ===');
    
    const container = document.getElementById('blog-featured');
    console.log('Container found:', container);
    
    if (!container) {
        console.error('ERROR: blog-featured container not found in HTML');
        return;
    }
    
    // Mostrar mensaje de carga
    container.innerHTML = '<p style="color: blue; text-align: center;">🔄 Cargando artículos desde Firebase...</p>';
    
    try {
        console.log('Connecting to Firebase blog collection...');
        
        // Obtener artículos de la colección "blog"
        const snapshot = await db.collection('blog').limit(3).get();
        
        console.log('Snapshot size:', snapshot.size);
        console.log('Is empty:', snapshot.empty);
        
        if (snapshot.empty) {
            container.innerHTML = '<p style="color: red; text-align: center;">⚠️ Firebase funciona pero NO HAY ARTÍCULOS en la colección "blog"</p>';
            return;
        }
        
        // Si hay artículos, mostrar alerta
        alert('¡ÉXITO! Se encontraron ' + snapshot.size + ' artículos');
        
        // Crear HTML para cada artículo
        let html = '';
        
        snapshot.docs.forEach((doc, index) => {
            const article = doc.data();
            const articleId = doc.id;
            
            console.log('Article ' + index + ':', article);
            
            // Formatear fecha
            let fecha = article.date || 'Sin fecha';
            
            // Crear extracto
            const excerpt = article.excerpt || 'Sin descripción';
            
            // Imagen
            const image = article.image || 'https://via.placeholder.com/400x250/C4A574/ffffff?text=Blog';
            
            html += `
                <article class="blog-article" style="border: 2px solid #C4A574; padding: 20px; margin: 10px; border-radius: 10px;">
                    <div style="width: 100%; height: 200px; background-image: url('${image}'); background-size: cover; background-position: center; border-radius: 8px; margin-bottom: 15px;"></div>
                    <div style="background: #C4A574; color: white; display: inline-block; padding: 5px 15px; border-radius: 15px; font-size: 0.8rem; margin-bottom: 10px;">
                        ${article.category || 'General'}
                    </div>
                    <div style="margin-bottom: 10px; color: #999;">
                        📅 ${fecha}
                    </div>
                    <h3 style="font-size: 1.4rem; margin-bottom: 15px; color: #333;">
                        ${article.title || 'Sin título'}
                    </h3>
                    <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
                        ${excerpt}
                    </p>
                    <a href="blog.html?post=${articleId}" style="color: #C4A574; font-weight: 600; text-decoration: none;">
                        Leer más →
                    </a>
                </article>
            `;
        });
        
        container.innerHTML = html;
        console.log('✅ Blog HTML created successfully');
        
    } catch (error) {
        console.error('ERROR loading blog:', error);
        container.innerHTML = `
            <div style="color: red; padding: 20px; border: 2px solid red; border-radius: 10px;">
                <h3>❌ ERROR:</h3>
                <p><strong>Mensaje:</strong> ${error.message}</p>
                <p><strong>Código:</strong> ${error.code || 'N/A'}</p>
            </div>
        `;
        alert('ERROR al cargar blog: ' + error.message);
    }
    
    console.log('=== BLOG DEBUG END ===');
}

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Page loaded, initializing Firebase...');
    initFirebase();
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    });
