// app-firebase.js - VERSIÓN CON HERO COMPLETO Y BACKGROUND

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
    
    // HERO
    if (siteData.hero) {
        console.log('🏠 Loading Hero section...');
        loadHero();
    }
    
    // About
    if (siteData.about) {
        loadAbout();
    // Areas
    if (siteData.areas && siteData.areas.length > 0) {
        console.log('🎯 Loading Areas with', siteData.areas.length, 'specialties');
        loadAreas();
    }
    
    // FAQ
    if (siteData.faq && siteData.faq.length > 0) {
        console.log('📝 Loading FAQ with', siteData.faq.length, 'questions');
        loadFAQ();
    }
    
    console.log('✅ All data applied to page');
}

// ==========================================
// HERO FUNCTIONS - ACTUALIZADO
// ==========================================

function loadHero() {
    console.log('🏠 loadHero() called');
    console.log('Hero data:', siteData.hero);
    
    const hero = siteData.hero;
    const heroSection = document.getElementById('inicio');
    
    if (!heroSection) {
        console.log('❌ Hero section not found');
        return;
    }
    
    // Etiqueta superior
    const label = document.querySelector('.hero-label, .section-tag');
    if (label && hero.label) {
        label.textContent = hero.label;
        label.className = 'section-tag hero-label'; // Asegurar ambas clases
        console.log('✅ Hero label updated:', hero.label);
    }
    
    // Título principal
    const title = document.querySelector('.hero-title, #inicio h1');
    if (title && hero.title) {
        title.textContent = hero.title;
        title.className = 'hero-title'; // Asegurar la clase
        console.log('✅ Hero title updated:', hero.title);
    }
    
    // Subtítulo
    const subtitle = document.querySelector('.hero-subtitle, #inicio p');
    if (subtitle && hero.subtitle) {
        subtitle.textContent = hero.subtitle;
        subtitle.className = 'hero-subtitle'; // Asegurar la clase
        console.log('✅ Hero subtitle updated:', hero.subtitle);
    }
    
    // Botones
    const buttons = document.querySelectorAll('#inicio .btn-primary, #inicio .btn-secondary');
    if (buttons.length >= 2 && hero.btnPrimary && hero.btnSecondary) {
        buttons[0].textContent = hero.btnPrimary;
        buttons[0].className = 'btn-primary btn-hero-primary';
        buttons[1].textContent = hero.btnSecondary;
        buttons[1].className = 'btn-secondary btn-hero-secondary';
        console.log('✅ Hero buttons updated');
    }
    
    // Imagen de fondo - MEJORADO
    if (hero.backgroundImage) {
        // Agregar clase para indicar que hay background
        heroSection.classList.add('has-background');
        
        // Aplicar la imagen
        heroSection.style.backgroundImage = `url(${hero.backgroundImage})`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
        heroSection.style.backgroundRepeat = 'no-repeat';
        
        console.log('✅ Hero background image updated:', hero.backgroundImage);
    } else {
        // Si no hay imagen, usar gradiente por defecto
        heroSection.classList.remove('has-background');
        heroSection.style.backgroundImage = '';
        heroSection.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        console.log('✅ Hero using default gradient');
    }
    
    console.log('✅ Hero section loaded successfully');
}

// ==========================================
// ABOUT FUNCTIONS
// ==========================================

function loadAbout() {
    if (!siteData.about) return;
    
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
    const image = document.querySelector('#about-image');
    if (image && about.image) {
        image.style.backgroundImage = `url(${about.image})`;
        console.log('✅ About image loaded:', about.image);
    }
    
    console.log('✅ About section loaded');
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
    
    // Close all
    document.querySelectorAll('.faq-answer').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.faq-icon').forEach(item => {
        item.textContent = '+';
    });
    
    // Open this one if it wasn't open
    if (!isOpen) {
        answer.classList.add('active');
        icon.textContent = '−';
    }
}

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Page loaded, initializing Firebase...');
    initFirebase();
});
// ==========================================
// AREAS DE TRABAJO FUNCTIONS
// ==========================================

function loadAreas() {
    console.log('🎯 loadAreas() called');
    
    if (!siteData.areas || siteData.areas.length === 0) {
        console.log('❌ No areas data');
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
    
    // Cerrar todas las demás
    document.querySelectorAll('.area-card').forEach(c => {
        c.classList.remove('expanded');
    });
    
    // Abrir esta si no estaba abierta
    if (!isExpanded) {
        card.classList.add('expanded');
    }
}
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
