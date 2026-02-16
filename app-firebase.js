// app-firebase.js - VERSIÓN COMPLETA Y FUNCIONAL

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
        console.log('📡 Loading from Firebase...');
        const doc = await db.collection('siteData').doc('main').get();
        
        if (doc.exists) {
            siteData = doc.data();
            console.log('✅ Data loaded from Firebase');
            applyAllData();
        } else {
            console.warn('⚠️ No data found');
        }
    } catch (error) {
        console.error('❌ Error loading:', error);
    }
}

// Apply all data
function applyAllData() {
    console.log('🔄 Applying all data...');
    
    if (siteData.hero) loadHero();
    if (siteData.about) loadAbout();
    if (siteData.areas) loadAreas();
    if (siteData.faq) loadFAQ();
    if (siteData.testimonios) loadTestimonios();
    
    console.log('✅ All data applied');
}

// ==========================================
// HERO
// ==========================================
function loadHero() {
    const hero = siteData.hero;
    const section = document.getElementById('inicio');
    if (!section || !hero) return;
    
    const label = document.querySelector('.hero-label, .section-tag');
    const title = document.querySelector('.hero-title, #inicio h1');
    const subtitle = document.querySelector('.hero-subtitle, #inicio p');
    const buttons = document.querySelectorAll('#inicio .btn-primary, #inicio .btn-secondary');
    
    if (label && hero.label) label.textContent = hero.label;
    if (title && hero.title) title.textContent = hero.title;
    if (subtitle && hero.subtitle) subtitle.textContent = hero.subtitle;
    
    if (buttons.length >= 2) {
        if (hero.btnPrimary) buttons[0].textContent = hero.btnPrimary;
        if (hero.btnSecondary) buttons[1].textContent = hero.btnSecondary;
    }
    
    if (hero.backgroundImage) {
        section.style.backgroundImage = `url(${hero.backgroundImage})`;
        section.style.backgroundSize = 'cover';
        section.style.backgroundPosition = 'center';
    }
    
    console.log('✅ Hero loaded');
}

// ==========================================
// ABOUT
// ==========================================
function loadAbout() {
    const about = siteData.about;
    if (!about) return;
    
    const title = document.querySelector('#sobre-mi h2, .about-title');
    if (title && about.title) title.textContent = about.title;
    
    const bio1 = document.querySelector('.about-bio-1');
    const bio2 = document.querySelector('.about-bio-2');
    const bio3 = document.querySelector('.about-bio-3');
    
    if (bio1 && about.bio1) bio1.textContent = about.bio1;
    if (bio2 && about.bio2) bio2.textContent = about.bio2;
    if (bio3 && about.bio3) bio3.textContent = about.bio3;
    
    const education = document.querySelector('#about-education');
    const colegiacion = document.querySelector('#about-colegiacion');
    const experience = document.querySelector('#about-experience');
    
    if (education && about.education) education.textContent = about.education;
    if (colegiacion && about.colegiacion) colegiacion.textContent = about.colegiacion;
    if (experience && about.experience) experience.textContent = about.experience;
    
    const image = document.querySelector('#about-image, .about-image');
    if (image && about.image) {
        image.style.backgroundImage = `url(${about.image})`;
        image.style.backgroundSize = 'cover';
        image.style.backgroundPosition = 'center';
        console.log('✅ About image loaded');
    }
    
    console.log('✅ About loaded');
}

// ==========================================
// AREAS
// ==========================================
function loadAreas() {
    const areas = siteData.areas;
    if (!areas || areas.length === 0) return;
    
    const grid = document.getElementById('areas-grid');
    if (!grid) return;
    
    grid.innerHTML = areas.map((area, index) => `
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
                    <p class="area-short-description">${area.shortDescription || ''}</p>
                </div>
                <div class="area-toggle">▼</div>
            </div>
            <div class="area-content">
                <div class="area-content-inner">
                    <div class="area-full-description">
                        ${area.fullDescription || area.description || ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('✅ Areas loaded');
}

function toggleArea(index) {
    const card = document.querySelector(`.area-card[data-index="${index}"]`);
    if (!card) return;
    
    const isExpanded = card.classList.contains('expanded');
    
    document.querySelectorAll('.area-card').forEach(c => c.classList.remove('expanded'));
    
    if (!isExpanded) {
        card.classList.add('expanded');
    }
}

// ==========================================
// FAQ
// ==========================================
function loadFAQ() {
    const faq = siteData.faq;
    if (!faq || faq.length === 0) return;
    
    const container = document.querySelector('.faq-container');
    if (!container) return;
    
    container.innerHTML = faq.map((item, index) => `
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
    
    console.log('✅ FAQ loaded');
}

function toggleFAQ(index) {
    const answer = document.getElementById(`faq-answer-${index}`);
    if (!answer) return;
    
    const button = answer.previousElementSibling;
    const icon = button.querySelector('.faq-icon');
    const isOpen = answer.classList.contains('active');
    
    document.querySelectorAll('.faq-answer').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.faq-icon').forEach(item => item.textContent = '+');
    
    if (!isOpen) {
        answer.classList.add('active');
        icon.textContent = '−';
    }
}

// ==========================================
// TESTIMONIOS
// ==========================================
function loadTestimonios() {
    const testimonios = siteData.testimonios;
    if (!testimonios || testimonios.length === 0) return;
    
    const grid = document.getElementById('testimonios-grid');
    const count = document.getElementById('testimonios-count');
    
    if (!grid) return;
    
    if (count) count.textContent = testimonios.length;
    
    grid.innerHTML = testimonios.map((testimonio) => {
        const stars = Array(5).fill(0).map((_, i) => {
            const filled = i < (testimonio.rating || 5);
            return `<span class="star ${filled ? 'filled' : 'empty'}">★</span>`;
        }).join('');
        
        const inicial = testimonio.nombre ? testimonio.nombre.charAt(0).toUpperCase() : 'A';
        
        let fecha = '';
        if (testimonio.fecha) {
            try {
                fecha = new Date(testimonio.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (e) {
                fecha = testimonio.fecha;
            }
        }
        
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
                <div class="testimonio-rating">${stars}</div>
                <div class="testimonio-texto">${testimonio.texto}</div>
            </div>
        `;
    }).join('');
    
    console.log('✅ Testimonios loaded');
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Page loaded, initializing...');
    initFirebase();
});

// Mobile menu
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});
