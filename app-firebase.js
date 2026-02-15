// app-firebase.js - Lee datos de Firebase en tiempo real

// Firebase configuration will be loaded from the same config as admin
let db;
let siteData = {};

// Initialize Firebase
function initFirebase() {
    const config = {
        // PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE
        // La misma que usaste en el admin
        apiKey: "AIzaSyCEj1oELDai-n2yIJCPuQzb8K8hHEAa7d4",
  authDomain: "maria-belen-prieto-web.firebaseapp.com",
  projectId: "maria-belen-prieto-web",
  storageBucket: "maria-belen-prieto-web.firebasestorage.app",
  messagingSenderId: "61304026951",
  appId: "1:61304026951:web:5a41d8182127ae07577e62",
    };
    
    try {
        firebase.initializeApp(config);
        db = firebase.firestore();
        console.log('✅ Firebase initialized');
        loadDataFromFirebase();
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        // Fallback to data.json if Firebase fails
        loadDataFromJSON();
    }
}

// Load data from Firebase
async function loadDataFromFirebase() {
    try {
        // Get main site data
        const doc = await db.collection('siteData').doc('main').get();
        
        if (doc.exists) {
            siteData = doc.data();
            console.log('✅ Data loaded from Firebase');
            
            // Load blog posts
            const blogSnapshot = await db.collection('blog').orderBy('date', 'desc').get();
            siteData.blog = blogSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // Apply all data to the page
            applyAllData();
        } else {
            console.warn('No data found in Firebase, using defaults');
            loadDefaults();
        }
    } catch (error) {
        console.error('Error loading from Firebase:', error);
        loadDataFromJSON(); // Fallback
    }
}

// Fallback: Load from data.json
async function loadDataFromJSON() {
    try {
        const response = await fetch('data.json');
        if (response.ok) {
            siteData = await response.json();
            console.log('✅ Data loaded from data.json (fallback)');
            applyAllData();
        } else {
            loadDefaults();
        }
    } catch (error) {
        console.error('Error loading data.json:', error);
        loadDefaults();
    }
}

// Load default data
function loadDefaults() {
    siteData = {
        hero: {
            label: 'Psicología Clínica',
            title: 'Un espacio seguro para tu bienestar emocional',
            subtitle: 'Acompañamiento profesional en terapia individual, de pareja y familiar. Presencial y online.',
            btnPrimary: 'Primera Consulta Gratuita',
            btnSecondary: 'Conocer Más',
            backgroundImage: ''
        },
        about: {
            title: 'Comprometida con tu proceso de cambio',
            bio1: '',
            bio2: '',
            bio3: '',
            education: '',
            colegiacion: '',
            experience: '',
            image: ''
        },
        approach: {
            title: 'Terapia centrada en la persona',
            description: '',
            quote: '',
            pillars: []
        },
        tourette: {
            title: '',
            description1: '',
            description2: '',
            stat1Number: '',
            stat1Label: '',
            stat2Number: '',
            stat2Label: '',
            mainUrl: '',
            secondaryUrl: '',
            btnPrimary: '',
            btnSecondary: '',
            logo: ''
        },
        config: {
            name: 'María Belén Prieto',
            email: '',
            phone: '',
            whatsapp: '',
            address: '',
            docfavUrl: '',
            instagram: '',
            linkedin: '',
            facebook: '',
            youtube: ''
        },
        blog: []
    };
    applyAllData();
}

// Apply all data to the page
function applyAllData() {
    // Hero
    if (siteData.hero) {
        const heroLabel = document.getElementById('hero-label');
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const heroBtn1 = document.querySelector('#inicio .btn-hero-primary');
        const heroBtn2 = document.querySelector('#inicio .btn-hero-secondary');
        const heroBackground = document.getElementById('hero-background');
        
        if (heroLabel) heroLabel.textContent = siteData.hero.label;
        if (heroTitle) heroTitle.textContent = siteData.hero.title;
        if (heroSubtitle) heroSubtitle.textContent = siteData.hero.subtitle;
        if (heroBtn1) heroBtn1.textContent = siteData.hero.btnPrimary;
        if (heroBtn2) heroBtn2.textContent = siteData.hero.btnSecondary;
        
        // Apply background image
        if (heroBackground && siteData.hero.backgroundImage) {
            heroBackground.style.backgroundImage = `url(${siteData.hero.backgroundImage})`;
        }
    }
    
    // About
    if (siteData.about) {
        const aboutTitle = document.getElementById('about-title');
        const aboutBio1 = document.getElementById('about-bio1');
        const aboutBio2 = document.getElementById('about-bio2');
        const aboutBio3 = document.getElementById('about-bio3');
        const aboutEducation = document.getElementById('about-education');
        const aboutColegiacion = document.getElementById('about-colegiacion');
        const aboutExperience = document.getElementById('about-experience');
        const aboutImage = document.getElementById('about-image');
        
        if (aboutTitle) aboutTitle.textContent = siteData.about.title;
        if (aboutBio1) aboutBio1.textContent = siteData.about.bio1;
        if (aboutBio2) aboutBio2.textContent = siteData.about.bio2;
        if (aboutBio3) aboutBio3.textContent = siteData.about.bio3;
        if (aboutEducation) aboutEducation.textContent = siteData.about.education;
        if (aboutColegiacion) aboutColegiacion.textContent = siteData.about.colegiacion;
        if (aboutExperience) aboutExperience.textContent = siteData.about.experience;
        
        // Apply about image
        if (aboutImage && siteData.about.image) {
            aboutImage.style.backgroundImage = `url(${siteData.about.image})`;
        }
    }
    
    // Approach
    if (siteData.approach) {
        const approachTitle = document.querySelector('#enfoque h2');
        const approachDescription = document.querySelector('#enfoque .approach-description');
        const approachQuote = document.querySelector('#enfoque .approach-quote');
        
        if (approachTitle) approachTitle.textContent = siteData.approach.title;
        if (approachDescription) approachDescription.innerHTML = siteData.approach.description;
        if (approachQuote) approachQuote.textContent = siteData.approach.quote;
        
        // Apply pillars
        if (siteData.approach.pillars && siteData.approach.pillars.length > 0) {
            const pillarsContainer = document.querySelector('.pillars-grid');
            if (pillarsContainer) {
                pillarsContainer.innerHTML = siteData.approach.pillars.map(pillar => `
                    <div class="pillar-item">
                        <div class="pillar-number">${pillar.number}</div>
                        <h4>${pillar.title}</h4>
                        <p>${pillar.description}</p>
                    </div>
                `).join('');
            }
        }
    }
    
    // Voces del Tourette
    if (siteData.tourette) {
        const touretteTitle = document.querySelector('#voces-tourette h2');
        const touretteDesc1 = document.querySelector('#voces-tourette .tourette-desc-1');
        const touretteDesc2 = document.querySelector('#voces-tourette .tourette-desc-2');
        const touretteStat1Num = document.querySelector('#voces-tourette .stat-1-number');
        const touretteStat1Label = document.querySelector('#voces-tourette .stat-1-label');
        const touretteStat2Num = document.querySelector('#voces-tourette .stat-2-number');
        const touretteStat2Label = document.querySelector('#voces-tourette .stat-2-label');
        const touretteBtn1 = document.querySelector('#voces-tourette .tourette-btn-primary');
        const touretteBtn2 = document.querySelector('#voces-tourette .tourette-btn-secondary');
        const touretteLogo = document.querySelector('#voces-tourette .tourette-logo');
        
        if (touretteTitle) touretteTitle.textContent = siteData.tourette.title;
        if (touretteDesc1) touretteDesc1.textContent = siteData.tourette.description1;
        if (touretteDesc2) touretteDesc2.textContent = siteData.tourette.description2;
        if (touretteStat1Num) touretteStat1Num.textContent = siteData.tourette.stat1Number;
        if (touretteStat1Label) touretteStat1Label.textContent = siteData.tourette.stat1Label;
        if (touretteStat2Num) touretteStat2Num.textContent = siteData.tourette.stat2Number;
        if (touretteStat2Label) touretteStat2Label.textContent = siteData.tourette.stat2Label;
        
        if (touretteBtn1) {
            touretteBtn1.textContent = siteData.tourette.btnPrimary;
            touretteBtn1.href = siteData.tourette.mainUrl;
        }
        if (touretteBtn2) {
            touretteBtn2.textContent = siteData.tourette.btnSecondary;
            touretteBtn2.href = siteData.tourette.secondaryUrl;
        }
        
        if (touretteLogo && siteData.tourette.logo) {
            touretteLogo.style.backgroundImage = `url(${siteData.tourette.logo})`;
        }
    }
    
    // Config (WhatsApp, social links, etc.)
    if (siteData.config) {
        // WhatsApp floating button
        const whatsappFloat = document.getElementById('whatsapp-float');
        if (whatsappFloat && siteData.config.whatsapp) {
            whatsappFloat.href = `https://wa.me/${siteData.config.whatsapp}`;
        }
        
        // Contact info
        const contactEmail = document.querySelector('#contacto .contact-email');
        const contactPhone = document.querySelector('#contacto .contact-phone');
        const contactAddress = document.querySelector('#contacto .contact-address');
        
        if (contactEmail) contactEmail.textContent = siteData.config.email;
        if (contactPhone) contactPhone.textContent = siteData.config.phone;
        if (contactAddress) contactAddress.textContent = siteData.config.address;
        
        // Social links
        const instagramLink = document.querySelector('a[aria-label="Instagram"]');
        const linkedinLink = document.querySelector('a[aria-label="LinkedIn"]');
        const facebookLink = document.querySelector('a[aria-label="Facebook"]');
        const youtubeLink = document.querySelector('a[aria-label="YouTube"]');
        
        if (instagramLink && siteData.config.instagram) instagramLink.href = siteData.config.instagram;
        if (linkedinLink && siteData.config.linkedin) linkedinLink.href = siteData.config.linkedin;
        if (facebookLink && siteData.config.facebook) facebookLink.href = siteData.config.facebook;
        if (youtubeLink && siteData.config.youtube) youtubeLink.href = siteData.config.youtube;
        
        // Docfav
        loadDocfav();
    }
    
    // Blog
    if (siteData.blog && siteData.blog.length > 0) {
        loadBlog();
    }
    
    console.log('✅ All data applied to page');
}

// Load Docfav widget
function loadDocfav() {
    const docfavContainer = document.getElementById('docfav-widget');
    if (!docfavContainer) return;
    
    const docfavUrl = siteData.config?.docfavUrl;
    
    if (docfavUrl) {
        docfavContainer.innerHTML = `
            <a href="${docfavUrl}" target="_blank" class="btn-docfav">
                📅 Reservar Cita en Docfav
            </a>
        `;
    }
}

// Load blog posts
function loadBlog() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;
    
    // Show featured post first, then recent posts
    const featured = siteData.blog.find(post => post.featured);
    const recent = siteData.blog.filter(post => !post.featured).slice(0, 5);
    
    const posts = featured ? [featured, ...recent] : recent;
    
    blogGrid.innerHTML = posts.map(post => `
        <article class="blog-card ${post.featured ? 'featured' : ''}">
            ${post.image ? `
                <div class="blog-image" style="background-image: url(${post.image})"></div>
            ` : `
                <div class="blog-image-placeholder"></div>
            `}
            <div class="blog-content">
                ${post.featured ? '<span class="blog-featured-badge">⭐ Destacado</span>' : ''}
                <span class="blog-date">${new Date(post.date).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</span>
                <h3>${post.title}</h3>
                <div class="blog-excerpt">${getExcerpt(post.content)}</div>
                <a href="#" onclick="showBlogPost('${post.id}'); return false;" class="blog-link">
                    Leer más →
                </a>
            </div>
        </article>
    `).join('');
}

// Get excerpt from content
function getExcerpt(content) {
    const stripped = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return stripped.substring(0, 150) + (stripped.length > 150 ? '...' : '');
}

// Show full blog post in modal
function showBlogPost(id) {
    const post = siteData.blog.find(p => p.id === id);
    if (!post) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    modal.innerHTML = `
        <div class="blog-modal-content">
            <button class="blog-modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-modal-image">` : ''}
            <h1>${post.title}</h1>
            <p class="blog-modal-date">${new Date(post.date).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</p>
            <div class="blog-modal-body">${post.content}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// Listen for real-time updates
function listenForUpdates() {
    if (!db) return;
    
    // Listen to main site data changes
    db.collection('siteData').doc('main').onSnapshot((doc) => {
        if (doc.exists) {
            siteData = { ...siteData, ...doc.data() };
            applyAllData();
            console.log('🔄 Data updated from Firebase');
        }
    });
    
    // Listen to blog posts changes
    db.collection('blog').orderBy('date', 'desc').onSnapshot((snapshot) => {
        siteData.blog = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        loadBlog();
        console.log('🔄 Blog updated from Firebase');
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    
    // Start listening for real-time updates after initial load
    setTimeout(() => {
        listenForUpdates();
    }, 1000);
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
