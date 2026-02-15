// app-firebase.js - COMPLETO CON TODO (FAQ incluido)

let db;
let siteData = {};

// Firebase configuration - REEMPLAZA CON TU CONFIGURACIÓN
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
            console.log('FAQ data:', siteData.faq);
            
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
    
    // Hero
    if (siteData.hero) {
        const heroLabel = document.querySelector('#inicio .hero-label');
        const heroTitle = document.querySelector('#inicio .hero-title');
        const heroSubtitle = document.querySelector('#inicio .hero-subtitle');
        
        if (heroLabel) heroLabel.textContent = siteData.hero.label || '';
        if (heroTitle) heroTitle.textContent = siteData.hero.title || '';
        if (heroSubtitle) heroSubtitle.textContent = siteData.hero.subtitle || '';
    }
    
    // About
    if (siteData.about) {
        const aboutTitle = document.querySelector('#sobre-mi h2');
        const aboutBio1 = document.querySelector('#sobre-mi .bio-1');
        const aboutBio2 = document.querySelector('#sobre-mi .bio-2');
        const aboutBio3 = document.querySelector('#sobre-mi .bio-3');
        
        if (aboutTitle) aboutTitle.textContent = siteData.about.title || '';
        if (aboutBio1) aboutBio1.textContent = siteData.about.bio1 || '';
        if (aboutBio2) aboutBio2.textContent = siteData.about.bio2 || '';
        if (aboutBio3) aboutBio3.textContent = siteData.about.bio3 || '';
    }
    
    // FAQ - IMPORTANTE
    if (siteData.faq && siteData.faq.length > 0) {
        console.log('📝 Loading FAQ with', siteData.faq.length, 'questions');
        loadFAQ();
    } else {
        console.log('⚠️ No FAQ data found');
    }
    
    console.log('✅ All data applied to page');
}

// ==========================================
// FAQ FUNCTIONS
// ==========================================

function loadFAQ() {
    console.log('🔍 loadFAQ() called');
    console.log('FAQ data:', siteData.faq);
    
    if (!siteData.faq || siteData.faq.length === 0) {
        console.log('❌ No FAQ data');
        return;
    }
    
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer) {
        console.log('❌ FAQ container not found in HTML');
        console.log('Looking for element with class .faq-container');
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
    console.log('✅ FAQ is now visible on the page');
}

function toggleFAQ(index) {
    const answer = document.getElementById(`faq-answer-${index}`);
    if (!answer) {
        console.log('Answer element not found for index:', index);
        return;
    }
    
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
// END FAQ FUNCTIONS
// ==========================================

// Initialize on page load
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
