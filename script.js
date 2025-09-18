// Ayur Sutra Healthcare Management System
// Main JavaScript Application

class AyurSutraApp {
    constructor() {
        this.state = {
            isLoggedIn: false,
            currentUser: null,
            activeTab: 'dashboard',
            userRole: 'patient',
            isLoading: true,
            showSplash: true
        };

        this.elements = {};
        this.sosClickCount = 0;
        this.sosClickTimer = null;
        
        this.init();
    }

    // Initialize the application
    init() {
        this.cacheElements();
        this.bindEvents();
        this.startLoadingSequence();
        this.initSosFeature();
        this.loadUserData();
    }

    // Cache DOM elements for better performance
    cacheElements() {
        this.elements = {
            loadingSplash: document.getElementById('loadingSplash'),
            loginScreen: document.getElementById('loginScreen'),
            mainApp: document.getElementById('mainApp'),
            roleButtons: document.querySelectorAll('.role-btn'),
            navItems: document.querySelectorAll('.nav-item'),
            screens: document.querySelectorAll('.screen'),
            profileAvatar: document.getElementById('profileAvatar'),
            userName: document.getElementById('userName'),
            avatarText: document.getElementById('avatarText'),
            profileName: document.getElementById('profileName'),
            profileRole: document.getElementById('profileRole'),
            profileInitials: document.getElementById('profileInitials'),
            logoutBtn: document.getElementById('logoutBtn'),
            actionButtons: document.querySelectorAll('.action-btn'),
            searchInput: document.querySelector('.search-bar input'),
            filterButtons: document.querySelectorAll('.filter-btn'),
            bookButtons: document.querySelectorAll('.book-btn'),
            sosButton: document.querySelector('.sos-button')
        };
    }

    // Bind event listeners
    bindEvents() {
        // Role selection
        this.elements.roleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleRoleSelection(e));
        });

        // Navigation
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Profile interactions
        if (this.elements.profileAvatar) {
            this.elements.profileAvatar.addEventListener('click', () => this.navigateToProfile());
        }

        // Logout
        if (this.elements.logoutBtn) {
            this.elements.logoutBtn.addEventListener('click', () => this.logout());
        }

        // Quick actions
        this.elements.actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e));
        });

        // Search functionality
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        // Filter buttons
        this.elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Book appointment buttons
        this.elements.bookButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleBookAppointment(e));
        });

        // SOS button
        if (this.elements.sosButton) {
            this.elements.sosButton.addEventListener('click', () => this.triggerSOS());
        }

        // Global keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyboardEvents(e));

        // Window events
        window.addEventListener('beforeunload', () => this.saveUserData());
        window.addEventListener('resize', () => this.handleResize());
    }

    // Loading sequence management
    startLoadingSequence() {
        // Simulate app initialization
        setTimeout(() => {
            this.state.isLoading = false;
            setTimeout(() => {
                this.hideSplashScreen();
            }, 500);
        }, 2500);
    }

    hideSplashScreen() {
        this.state.showSplash = false;
        this.elements.loadingSplash.style.opacity = '0';
        this.elements.loadingSplash.style.transform = 'scale(0.95)';
        this.elements.loadingSplash.style.filter = 'blur(10px)';
        
        setTimeout(() => {
            this.elements.loadingSplash.classList.add('hidden');
            this.showLoginScreen();
        }, 800);
    }

    showLoginScreen() {
        this.elements.loginScreen.classList.remove('hidden');
        this.elements.loginScreen.style.opacity = '0';
        this.elements.loginScreen.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            this.elements.loginScreen.style.opacity = '1';
            this.elements.loginScreen.style.transform = 'scale(1)';
            this.elements.loginScreen.style.transition = 'all 0.5s ease-in-out';
        }, 50);
    }

    // Handle role selection and login
    handleRoleSelection(e) {
        const role = e.currentTarget.dataset.role;
        this.login(role);
    }

    login(role) {
        this.state.userRole = role;
        this.state.isLoggedIn = true;
        this.state.currentUser = this.createUserProfile(role);
        
        // Hide login screen with animation
        this.elements.loginScreen.style.opacity = '0';
        this.elements.loginScreen.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.elements.loginScreen.classList.add('hidden');
            this.showMainApp();
        }, 500);
    }

    showMainApp() {
        this.elements.mainApp.classList.remove('hidden');
        this.elements.mainApp.style.opacity = '0';
        this.elements.mainApp.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            this.elements.mainApp.style.opacity = '1';
            this.elements.mainApp.style.transform = 'scale(1)';
            this.elements.mainApp.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        }, 50);

        this.updateUserInterface();
        this.navigateToTab('dashboard');
        this.saveUserData();
    }

    createUserProfile(role) {
        const profiles = {
            patient: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                avatar: 'JD',
                role: 'Patient'
            },
            doctor: {
                name: 'Dr. Sarah Wilson',
                email: 'dr.wilson@hospital.com',
                phone: '+1 (555) 987-6543',
                avatar: 'SW',
                role: 'Doctor'
            },
            admin: {
                name: 'Admin User',
                email: 'admin@ayursutra.com',
                phone: '+1 (555) 555-0000',
                avatar: 'AU',
                role: 'Administrator'
            }
        };

        return profiles[role] || profiles.patient;
    }

    updateUserInterface() {
        const user = this.state.currentUser;
        
        if (this.elements.userName) {
            this.elements.userName.textContent = user.name.split(' ')[0];
        }
        
        if (this.elements.avatarText) {
            this.elements.avatarText.textContent = user.avatar;
        }
        
        if (this.elements.profileName) {
            this.elements.profileName.textContent = user.name;
        }
        
        if (this.elements.profileRole) {
            this.elements.profileRole.textContent = user.role;
        }
        
        if (this.elements.profileInitials) {
            this.elements.profileInitials.textContent = user.avatar;
        }

        // Update navigation based on user role
        this.updateNavigationForRole();
    }

    updateNavigationForRole() {
        const role = this.state.userRole;
        const navItems = this.elements.navItems;
        
        // Show/hide navigation items based on role
        navItems.forEach(item => {
            const tab = item.dataset.tab;
            
            if (role === 'doctor') {
                // Doctors see patients instead of doctors
                if (tab === 'doctors') {
                    item.dataset.tab = 'patients';
                    item.querySelector('.nav-icon').textContent = '👥';
                    item.querySelector('.nav-label').textContent = 'Patients';
                }
            } else if (role === 'admin') {
                // Admins see both doctors and patients
                if (tab === 'tips') {
                    item.dataset.tab = 'reports';
                    item.querySelector('.nav-icon').textContent = '📊';
                    item.querySelector('.nav-label').textContent = 'Reports';
                }
            }
        });
    }

    // Navigation handling
    handleNavigation(e) {
        const tab = e.currentTarget.dataset.tab;
        this.navigateToTab(tab);
    }

    navigateToTab(tab) {
        // Update active nav item
        this.elements.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tab === tab) {
                item.classList.add('active');
            }
        });

        // Show active screen
        this.elements.screens.forEach(screen => {
            screen.classList.remove('active');
            if (screen.id === tab) {
                screen.classList.add('active');
            }
        });

        this.state.activeTab = tab;
        this.animateScreenTransition();
    }

    navigateToProfile() {
        this.navigateToTab('profile');
    }

    animateScreenTransition() {
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen) {
            activeScreen.style.opacity = '0';
            activeScreen.style.transform = 'translateY(15px) scale(0.98)';
            
            setTimeout(() => {
                activeScreen.style.opacity = '1';
                activeScreen.style.transform = 'translateY(0) scale(1)';
                activeScreen.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
            }, 50);
        }
    }

    // Quick actions handling
    handleQuickAction(e) {
        const action = e.currentTarget.dataset.action;
        
        switch (action) {
            case 'schedule':
                this.navigateToTab('schedule');
                break;
            case 'doctors':
                this.navigateToTab('doctors');
                break;
            case 'tips':
                this.navigateToTab('tips');
                break;
            case 'reports':
                this.navigateToTab('reports');
                break;
            default:
                this.showNotification('Feature coming soon!', 'info');
        }
    }

    // Search functionality
    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        const doctorCards = document.querySelectorAll('.doctor-card');
        
        doctorCards.forEach(card => {
            const doctorName = card.querySelector('h3').textContent.toLowerCase();
            const specialty = card.querySelector('p').textContent.toLowerCase();
            
            if (doctorName.includes(query) || specialty.includes(query)) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0.3';
                card.style.transform = 'scale(0.95)';
            }
        });
    }

    // Filter handling
    handleFilter(e) {
        const filterType = e.currentTarget.textContent.toLowerCase();
        
        // Update active filter
        this.elements.filterButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        
        // Filter logic (simplified for demo)
        const doctorCards = document.querySelectorAll('.doctor-card');
        
        doctorCards.forEach(card => {
            if (filterType === 'all') {
                card.style.display = 'block';
            } else {
                const specialty = card.querySelector('p').textContent.toLowerCase();
                card.style.display = specialty.includes(filterType) ? 'block' : 'none';
            }
        });
    }

    // Book appointment handling
    handleBookAppointment(e) {
        const doctorCard = e.currentTarget.closest('.doctor-card');
        const doctorName = doctorCard.querySelector('h3').textContent;
        
        this.showNotification(`Booking appointment with ${doctorName}...`, 'success');
        
        // Simulate booking process
        setTimeout(() => {
            this.showNotification(`Appointment booked successfully with ${doctorName}!`, 'success');
        }, 2000);
    }

    // SOS Emergency Feature
    initSosFeature() {
        let volumeDownCount = 0;
        let lastVolumePress = 0;

        // Listen for 'V' key presses (simulating volume button)
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'v') {
                const now = Date.now();
                
                if (now - lastVolumePress < 500) {
                    volumeDownCount++;
                    if (volumeDownCount >= 2) {
                        this.triggerSOS();
                        volumeDownCount = 0;
                    }
                } else {
                    volumeDownCount = 1;
                }
                lastVolumePress = now;
            }
        });
    }

    triggerSOS() {
        this.showSOSAlert();
        this.playSosSound();
        this.sendSOSAlert();
    }

    showSOSAlert() {
        // Create SOS overlay
        const sosOverlay = document.createElement('div');
        sosOverlay.className = 'sos-overlay';
        sosOverlay.innerHTML = `
            <div class="sos-container">
                <div class="sos-background"></div>
                <div class="sos-card">
                    <div class="sos-icon-large">🆘</div>
                    <h1 class="sos-title">EMERGENCY ALERT</h1>
                    <div class="sos-divider"></div>
                    <div class="sos-content-text">
                        <strong>Alert dispatched to:</strong><br/>
                        🩺 Dr. Priya Sharma<br/>
                        🚑 Emergency Services<br/>
                        📞 Primary Contact<br/>
                        📍 Location shared
                    </div>
                    <div class="sos-status">
                        Help is on the way
                    </div>
                    <button class="sos-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Dismiss
                    </button>
                </div>
            </div>
        `;
        
        // Add SOS styles
        const style = document.createElement('style');
        style.textContent = `
            .sos-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #ef4444 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                font-family: inherit;
                padding: 1rem;
                animation: sosAlert 0.5s ease-out;
            }
            
            @keyframes sosAlert {
                0% { opacity: 0; transform: scale(0.8); }
                100% { opacity: 1; transform: scale(1); }
            }
            
            .sos-container {
                position: relative;
                width: 100%;
                max-width: 400px;
                text-align: center;
            }
            
            .sos-background {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at center, rgba(239,68,68,0.3) 0%, transparent 70%);
                animation: sosFlash 0.8s ease-in-out infinite;
            }
            
            .sos-card {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 16px;
                padding: 2rem 1.5rem;
                position: relative;
                z-index: 2;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            }
            
            .sos-icon-large {
                font-size: 4rem;
                margin-bottom: 1rem;
                animation: sosShake 0.8s ease-in-out infinite;
                filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
            }
            
            .sos-title {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0 0 1rem 0;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            
            .sos-divider {
                width: 60px;
                height: 2px;
                background: white;
                margin: 0 auto 1.5rem auto;
                opacity: 0.8;
                animation: sosGlow 1.5s ease-in-out infinite;
            }
            
            .sos-content-text {
                font-size: 0.9rem;
                line-height: 1.6;
                opacity: 0.95;
                margin-bottom: 1.5rem;
            }
            
            .sos-status {
                padding: 0.75rem;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                font-size: 0.85rem;
                color: rgba(255,255,255,0.9);
                margin-bottom: 1rem;
            }
            
            .sos-close {
                background: rgba(255,255,255,0.2);
                color: white;
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 8px;
                padding: 0.5rem 1rem;
                cursor: pointer;
                font-size: 0.875rem;
                transition: all 0.3s ease;
            }
            
            .sos-close:hover {
                background: rgba(255,255,255,0.3);
            }
            
            @keyframes sosFlash {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.6; }
            }
            
            @keyframes sosShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }
            
            @keyframes sosGlow {
                0%, 100% { opacity: 0.5; transform: scaleX(0.8); }
                50% { opacity: 1; transform: scaleX(1.2); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(sosOverlay);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(sosOverlay)) {
                sosOverlay.style.opacity = '0';
                sosOverlay.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    document.body.removeChild(sosOverlay);
                    document.head.removeChild(style);
                }, 500);
            }
        }, 10000);
    }

    playSosSound() {
        // Create audio context for SOS sound (simplified)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    sendSOSAlert() {
        // Simulate sending SOS alert to emergency contacts
        console.log('🚨 SOS Alert Sent:', {
            user: this.state.currentUser,
            timestamp: new Date().toISOString(),
            location: 'User Location',
            emergencyContacts: ['Dr. Priya Sharma', 'Emergency Services', 'Primary Contact']
        });
        
        this.showNotification('Emergency alert sent successfully!', 'success');
    }

    // Keyboard event handling
    handleKeyboardEvents(e) {
        // Global keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.navigateToTab('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    this.navigateToTab('doctors');
                    break;
                case '3':
                    e.preventDefault();
                    this.navigateToTab('schedule');
                    break;
                case '4':
                    e.preventDefault();
                    this.navigateToTab('tips');
                    break;
                case '5':
                    e.preventDefault();
                    this.navigateToTab('profile');
                    break;
            }
        }
    }

    // Responsive handling
    handleResize() {
        // Update responsive behavior
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Mobile-specific adjustments
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                </span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add notification styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 2rem;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 12px;
                padding: 1rem 1.5rem;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                animation: notificationSlide 0.3s ease-out;
                max-width: 90vw;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            
            .notification-info {
                border-left: 4px solid #3b82f6;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-icon {
                font-size: 1.125rem;
            }
            
            .notification-message {
                font-weight: 500;
                color: #1e293b;
            }
            
            @keyframes notificationSlide {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                100% { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Auto-remove notification
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }, 300);
        }, 4000);
    }

    // Data persistence
    saveUserData() {
        if (this.state.isLoggedIn) {
            localStorage.setItem('ayurSutraUser', JSON.stringify({
                currentUser: this.state.currentUser,
                userRole: this.state.userRole,
                activeTab: this.state.activeTab
            }));
        }
    }

    loadUserData() {
        const savedData = localStorage.getItem('ayurSutraUser');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                // Auto-login could be implemented here if desired
                console.log('Previous session data found:', data);
            } catch (error) {
                console.log('Error loading user data:', error);
            }
        }
    }

    logout() {
        this.state.isLoggedIn = false;
        this.state.currentUser = null;
        this.state.activeTab = 'dashboard';
        
        localStorage.removeItem('ayurSutraUser');
        
        // Reset navigation
        this.elements.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tab === 'dashboard') {
                item.classList.add('active');
            }
        });
        
        // Show login screen
        this.elements.mainApp.classList.add('hidden');
        this.showLoginScreen();
        
        this.showNotification('Logged out successfully!', 'info');
    }

    // Health data simulation
    generateHealthData() {
        return {
            heartRate: Math.floor(Math.random() * 40) + 60,
            steps: Math.floor(Math.random() * 5000) + 5000,
            sleep: (Math.random() * 3 + 6).toFixed(1) + 'h',
            medications: Math.floor(Math.random() * 3) + 1
        };
    }

    updateHealthStats() {
        const data = this.generateHealthData();
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach((card, index) => {
            const value = card.querySelector('.stat-value');
            switch (index) {
                case 0:
                    value.textContent = data.heartRate;
                    break;
                case 1:
                    value.textContent = data.steps.toLocaleString();
                    break;
                case 2:
                    value.textContent = data.sleep;
                    break;
                case 3:
                    value.textContent = `${data.medications}/3`;
                    break;
            }
        });
    }

    // Animation utilities
    animateElement(element, animation) {
        element.style.animation = animation;
        element.addEventListener('animationend', () => {
            element.style.animation = '';
        }, { once: true });
    }

    // Initialize periodic updates
    startPeriodicUpdates() {
        // Update health stats every 30 seconds
        setInterval(() => {
            if (this.state.isLoggedIn && this.state.activeTab === 'dashboard') {
                this.updateHealthStats();
            }
        }, 30000);
        
        // Save user data every 5 minutes
        setInterval(() => {
            if (this.state.isLoggedIn) {
                this.saveUserData();
            }
        }, 300000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ayurSutraApp = new AyurSutraApp();
    
    // Start periodic updates
    window.ayurSutraApp.startPeriodicUpdates();
    
    // Add some enhanced interactivity
    addEnhancedInteractions();
});

// Enhanced interactions
function addEnhancedInteractions() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.stat-card, .doctor-card, .tip-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button, .role-btn, .action-btn, .nav-item');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            // Add ripple animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ripple {
                    to { transform: scale(2); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
                document.head.removeChild(style);
            }, 600);
        });
    });
    
    // Add smooth scrolling for mobile
    if (window.innerWidth < 768) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Add progressive web app features
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            console.log('Service Worker registration failed');
        });
    }
}

// Utility functions
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AyurSutraApp;
}
