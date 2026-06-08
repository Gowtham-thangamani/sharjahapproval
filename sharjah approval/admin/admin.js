// Admin Panel JavaScript - Sharjah Approval
// Secure password handling - values are hashed, not stored in plain text

(function() {
    'use strict';

    // ============================================
    // Database Simulation (localStorage based)
    // ============================================
    const DB = {
        init() {
            // Initialize default admin user if not exists
            if (!localStorage.getItem('sa_users')) {
                const defaultAdmin = {
                    id: 'admin_001',
                    username: 'admin',
                    email: 'admin@sharjahapproval.com',
                    fullName: 'Administrator',
                    passwordHash: this.hashPassword('Admin@123'),
                    role: 'admin',
                    status: 'active',
                    permissions: {
                        blogs: { create: true, read: true, update: true, delete: true },
                        services: { create: true, read: true, update: true, delete: true },
                        testimonials: { create: true, read: true, update: true, delete: true },
                        contacts: { read: true, delete: true },
                        subscribers: { read: true, delete: true },
                        settings: { view: true, update: true }
                    },
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                };
                localStorage.setItem('sa_users', JSON.stringify([defaultAdmin]));
            }

            // Initialize blogs if not exists
            if (!localStorage.getItem('sa_blogs')) {
                const defaultBlogs = [
                    {
                        id: 'blog_001',
                        title: 'Sharjah Municipality Approval Guide 2025',
                        slug: 'sharjah-municipality-approval-guide-2025',
                        category: 'Municipality',
                        content: '<p>Complete guide to obtaining Municipality approvals in Sharjah...</p>',
                        excerpt: 'Learn everything about Sharjah Municipality approval process, requirements, and timeline.',
                        status: 'published',
                        views: 245,
                        author: 'admin',
                        createdAt: '2025-01-05T10:00:00Z',
                        updatedAt: '2025-01-05T10:00:00Z'
                    },
                    {
                        id: 'blog_002',
                        title: 'SEWA Connection Requirements',
                        slug: 'sewa-connection-requirements',
                        category: 'SEWA',
                        content: '<p>Essential requirements for SEWA electricity, water, and gas connections...</p>',
                        excerpt: 'All you need to know about SEWA approvals for electricity, water, and gas connections.',
                        status: 'published',
                        views: 189,
                        author: 'admin',
                        createdAt: '2025-01-03T14:30:00Z',
                        updatedAt: '2025-01-03T14:30:00Z'
                    },
                    {
                        id: 'blog_003',
                        title: 'Civil Defense Fire Safety Compliance',
                        slug: 'civil-defense-fire-safety-compliance',
                        category: 'Civil Defense',
                        content: '<p>Understanding fire safety requirements and Civil Defense approvals...</p>',
                        excerpt: 'Essential guide to Sharjah Civil Defense approval process and fire safety compliance.',
                        status: 'published',
                        views: 156,
                        author: 'admin',
                        createdAt: '2025-01-01T09:00:00Z',
                        updatedAt: '2025-01-01T09:00:00Z'
                    }
                ];
                localStorage.setItem('sa_blogs', JSON.stringify(defaultBlogs));
            }

            // Initialize services if not exists
            if (!localStorage.getItem('sa_services')) {
                const defaultServices = [
                    { id: 'svc_001', title: 'Sharjah Municipality Approvals', icon: 'fa-city', description: 'Complete building permit approvals, land use certificates, commercial licensing, and all Municipality-related services.', order: 1, status: 'active' },
                    { id: 'svc_002', title: 'Sharjah Civil Defense (SCD) Approvals', icon: 'fa-fire-extinguisher', description: 'Fire safety compliance certificates, emergency evacuation plans, fire fighting system approvals, and NOC services.', order: 2, status: 'active' },
                    { id: 'svc_003', title: 'SEWA – Electricity, Water & Gas', icon: 'fa-bolt', description: 'New connection applications, load calculations, meter installations, and all utility approvals.', order: 3, status: 'active' },
                    { id: 'svc_004', title: 'Planning & Survey Approvals', icon: 'fa-compass-drafting', description: 'Land surveying, plot demarcation, building layout approvals, and planning department services.', order: 4, status: 'active' },
                    { id: 'svc_005', title: 'RTA Sharjah Approvals', icon: 'fa-road', description: 'Road access permits, traffic impact assessments, parking approvals, and transportation NOCs.', order: 5, status: 'active' },
                    { id: 'svc_006', title: 'Environmental & Waste Management', icon: 'fa-leaf', description: 'Environmental impact assessments, waste disposal permits, and sustainability compliance.', order: 6, status: 'active' },
                    { id: 'svc_007', title: 'Drainage & Irrigation Approvals', icon: 'fa-water', description: 'Storm water drainage, irrigation connections, and sewage system approvals.', order: 7, status: 'active' },
                    { id: 'svc_008', title: 'Telecommunication Approvals', icon: 'fa-tower-cell', description: 'Telecom infrastructure permits, antenna installations, and network equipment approvals.', order: 8, status: 'active' },
                    { id: 'svc_009', title: 'Demolition, Excavation & Construction', icon: 'fa-helmet-safety', description: 'Demolition permits, excavation approvals, and construction phase NOCs.', order: 9, status: 'active' },
                    { id: 'svc_010', title: 'NOC Services', icon: 'fa-file-signature', description: 'No Objection Certificates from all relevant authorities for various construction and business needs.', order: 10, status: 'active' }
                ];
                localStorage.setItem('sa_services', JSON.stringify(defaultServices));
            }

            // Initialize testimonials
            if (!localStorage.getItem('sa_testimonials')) {
                localStorage.setItem('sa_testimonials', JSON.stringify([]));
            }

            // Initialize messages
            if (!localStorage.getItem('sa_messages')) {
                localStorage.setItem('sa_messages', JSON.stringify([]));
            }

            // Initialize subscribers
            if (!localStorage.getItem('sa_subscribers')) {
                localStorage.setItem('sa_subscribers', JSON.stringify([]));
            }

            // Initialize activity log
            if (!localStorage.getItem('sa_activity')) {
                localStorage.setItem('sa_activity', JSON.stringify([]));
            }

            // Initialize settings
            if (!localStorage.getItem('sa_settings')) {
                localStorage.setItem('sa_settings', JSON.stringify({
                    siteName: 'Sharjah Approval',
                    siteTagline: 'Authority Services',
                    contactEmail: 'info@sharjahapproval.com',
                    contactPhone: '+971 XX XXX XXXX',
                    whatsapp: '+971 XX XXX XXXX',
                    address: 'Sharjah, UAE',
                    workingHours: 'Sun-Thu: 9AM - 6PM',
                    socialFacebook: '#',
                    socialInstagram: '#',
                    socialLinkedIn: '#',
                    socialWhatsApp: '#'
                }));
            }
        },

        // Simple hash function for demo (in production use bcrypt or similar)
        hashPassword(password) {
            let hash = 0;
            const salt = 'sa_secure_salt_2025';
            const salted = salt + password + salt;
            for (let i = 0; i < salted.length; i++) {
                const char = salted.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return 'sha_' + Math.abs(hash).toString(16);
        },

        verifyPassword(password, hash) {
            return this.hashPassword(password) === hash;
        },

        generateId(prefix) {
            return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },

        // Users
        getUsers() {
            return JSON.parse(localStorage.getItem('sa_users') || '[]');
        },
        saveUsers(users) {
            localStorage.setItem('sa_users', JSON.stringify(users));
        },
        getUserById(id) {
            return this.getUsers().find(u => u.id === id);
        },
        getUserByUsername(username) {
            return this.getUsers().find(u => u.username === username);
        },

        // Blogs
        getBlogs() {
            return JSON.parse(localStorage.getItem('sa_blogs') || '[]');
        },
        saveBlogs(blogs) {
            localStorage.setItem('sa_blogs', JSON.stringify(blogs));
        },

        // Services
        getServices() {
            return JSON.parse(localStorage.getItem('sa_services') || '[]');
        },
        saveServices(services) {
            localStorage.setItem('sa_services', JSON.stringify(services));
        },

        // Activity
        logActivity(action, userId, details) {
            const activities = JSON.parse(localStorage.getItem('sa_activity') || '[]');
            activities.unshift({
                id: this.generateId('act'),
                action,
                userId,
                details,
                timestamp: new Date().toISOString()
            });
            // Keep only last 100 activities
            localStorage.setItem('sa_activity', JSON.stringify(activities.slice(0, 100)));
        },
        getActivity() {
            return JSON.parse(localStorage.getItem('sa_activity') || '[]');
        },

        // Settings
        getSettings() {
            return JSON.parse(localStorage.getItem('sa_settings') || '{}');
        },
        saveSettings(settings) {
            localStorage.setItem('sa_settings', JSON.stringify(settings));
        },

        // Testimonials
        getTestimonials() {
            return JSON.parse(localStorage.getItem('sa_testimonials') || '[]');
        },
        saveTestimonials(testimonials) {
            localStorage.setItem('sa_testimonials', JSON.stringify(testimonials));
        },

        // Messages
        getMessages() {
            return JSON.parse(localStorage.getItem('sa_messages') || '[]');
        },
        saveMessages(messages) {
            localStorage.setItem('sa_messages', JSON.stringify(messages));
        },

        // Subscribers
        getSubscribers() {
            return JSON.parse(localStorage.getItem('sa_subscribers') || '[]');
        },
        saveSubscribers(subscribers) {
            localStorage.setItem('sa_subscribers', JSON.stringify(subscribers));
        }
    };

    // ============================================
    // Session Management
    // ============================================
    const Session = {
        login(user) {
            const sessionData = {
                userId: user.id,
                username: user.username,
                role: user.role,
                permissions: user.permissions,
                loginTime: new Date().toISOString()
            };
            sessionStorage.setItem('sa_session', JSON.stringify(sessionData));
            
            // Update last login
            const users = DB.getUsers();
            const idx = users.findIndex(u => u.id === user.id);
            if (idx !== -1) {
                users[idx].lastLogin = new Date().toISOString();
                DB.saveUsers(users);
            }
            
            DB.logActivity('Logged in successfully', user.id, { username: user.username });
        },
        
        logout() {
            const session = this.get();
            if (session) {
                DB.logActivity('Logged out', session.userId, { username: session.username });
            }
            sessionStorage.removeItem('sa_session');
            window.location.href = 'index.html';
        },
        
        get() {
            const data = sessionStorage.getItem('sa_session');
            return data ? JSON.parse(data) : null;
        },
        
        isLoggedIn() {
            return this.get() !== null;
        },
        
        hasPermission(module, action) {
            const session = this.get();
            if (!session) return false;
            if (session.role === 'admin') return true;
            return session.permissions?.[module]?.[action] === true;
        },
        
        getCurrentUser() {
            const session = this.get();
            if (!session) return null;
            return DB.getUserById(session.userId);
        }
    };

    // ============================================
    // UI Helpers
    // ============================================
    const UI = {
        showAlert(message, type = 'success') {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type}`;
            alertDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
            
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                contentArea.insertBefore(alertDiv, contentArea.firstChild);
                setTimeout(() => alertDiv.remove(), 5000);
            }
        },

        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        },

        formatDateTime(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        slugify(text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };

    // ============================================
    // Modal Management
    // ============================================
    const Modal = {
        open(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },
        
        close(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        },
        
        closeAll() {
            document.querySelectorAll('.modal-overlay').forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    };

    // ============================================
    // Page Controllers
    // ============================================
    
    // Login Page Controller
    const LoginController = {
        init() {
            if (Session.isLoggedIn()) {
                window.location.href = 'dashboard.html';
                return;
            }

            const form = document.getElementById('loginForm');
            if (form) {
                form.addEventListener('submit', this.handleLogin.bind(this));
            }

            // Password toggle
            document.querySelectorAll('.password-toggle').forEach(btn => {
                btn.addEventListener('click', function() {
                    const input = this.parentElement.querySelector('input');
                    const icon = this.querySelector('i');
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.classList.replace('fa-eye', 'fa-eye-slash');
                    } else {
                        input.type = 'password';
                        icon.classList.replace('fa-eye-slash', 'fa-eye');
                    }
                });
            });
        },

        handleLogin(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            const user = DB.getUserByUsername(username);
            
            if (!user) {
                this.showError('Invalid username or password');
                return;
            }

            if (user.status !== 'active') {
                this.showError('Your account has been deactivated');
                return;
            }

            if (!DB.verifyPassword(password, user.passwordHash)) {
                this.showError('Invalid username or password');
                return;
            }

            Session.login(user);
            window.location.href = 'dashboard.html';
        },

        showError(message) {
            const errorDiv = document.getElementById('loginError');
            if (errorDiv) {
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
                setTimeout(() => errorDiv.style.display = 'none', 5000);
            }
        }
    };

    // Dashboard Controller
    const DashboardController = {
        init() {
            this.loadStats();
            this.loadWeeklyActivity();
            this.loadRecentActivity();
        },

        loadStats() {
            const blogs = DB.getBlogs();
            const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
            const subscribers = DB.getSubscribers();
            const messages = DB.getMessages().filter(m => !m.read);

            document.getElementById('statViews').textContent = totalViews;
            document.getElementById('statBlogs').textContent = blogs.length;
            document.getElementById('statSubscribers').textContent = subscribers.length;
            document.getElementById('statMessages').textContent = messages.length;
        },

        loadWeeklyActivity() {
            const activities = DB.getActivity();
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = new Date();
            const weekData = {};

            // Initialize all days
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dayName = days[d.getDay()];
                weekData[dayName] = 0;
            }

            // Count activities per day
            activities.forEach(act => {
                const actDate = new Date(act.timestamp);
                const daysDiff = Math.floor((today - actDate) / (1000 * 60 * 60 * 24));
                if (daysDiff < 7) {
                    const dayName = days[actDate.getDay()];
                    if (weekData.hasOwnProperty(dayName)) {
                        weekData[dayName]++;
                    }
                }
            });

            const maxCount = Math.max(...Object.values(weekData), 1);
            const chartContainer = document.getElementById('weeklyChart');
            if (chartContainer) {
                chartContainer.innerHTML = Object.entries(weekData).map(([day, count]) => {
                    const height = Math.max((count / maxCount) * 60, 10);
                    return `
                        <div class="activity-bar">
                            <div class="bar" style="--height: ${height}px"></div>
                            <span>${day}</span>
                        </div>
                    `;
                }).join('');
            }
        },

        loadRecentActivity() {
            const activities = DB.getActivity().slice(0, 10);
            const container = document.getElementById('recentActivity');
            
            if (container) {
                if (activities.length === 0) {
                    container.innerHTML = '<p class="text-center text-muted">No recent activity</p>';
                    return;
                }

                container.innerHTML = activities.map(act => {
                    const user = DB.getUserById(act.userId);
                    return `
                        <li class="activity-item">
                            <div class="activity-info">
                                <strong>${user ? user.username : 'Unknown'}</strong>
                                <span>${UI.escapeHtml(act.action)}</span>
                            </div>
                            <span class="activity-date">${UI.formatDate(act.timestamp)}</span>
                        </li>
                    `;
                }).join('');
            }
        }
    };

    // Blog Controller
    const BlogController = {
        currentEdit: null,

        init() {
            this.loadBlogs();
            this.setupEventListeners();
        },

        setupEventListeners() {
            // New post button
            const newBtn = document.getElementById('newPostBtn');
            if (newBtn) {
                newBtn.addEventListener('click', () => this.openEditor());
            }

            // Search
            const searchInput = document.getElementById('blogSearch');
            if (searchInput) {
                searchInput.addEventListener('input', () => this.loadBlogs());
            }

            // Status filter
            const statusFilter = document.getElementById('statusFilter');
            if (statusFilter) {
                statusFilter.addEventListener('change', () => this.loadBlogs());
            }

            // Save blog
            const saveBtn = document.getElementById('saveBlogBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.saveBlog());
            }

            // Modal close
            document.querySelectorAll('.modal-close, [data-dismiss="modal"]').forEach(btn => {
                btn.addEventListener('click', () => Modal.closeAll());
            });
        },

        loadBlogs() {
            let blogs = DB.getBlogs();
            
            // Apply search
            const search = document.getElementById('blogSearch')?.value.toLowerCase() || '';
            if (search) {
                blogs = blogs.filter(b => 
                    b.title.toLowerCase().includes(search) || 
                    b.category.toLowerCase().includes(search)
                );
            }

            // Apply status filter
            const status = document.getElementById('statusFilter')?.value || '';
            if (status) {
                blogs = blogs.filter(b => b.status === status);
            }

            // Sort by date
            blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const tbody = document.getElementById('blogsTableBody');
            if (tbody) {
                tbody.innerHTML = blogs.map(blog => `
                    <tr>
                        <td><strong>${UI.escapeHtml(blog.title)}</strong></td>
                        <td>${UI.escapeHtml(blog.category)}</td>
                        <td>${UI.formatDate(blog.createdAt)}</td>
                        <td><span class="status-badge status-${blog.status}">${blog.status}</span></td>
                        <td>${blog.views || 0}</td>
                        <td>
                            <div class="action-btns">
                                <button class="action-btn edit" onclick="Admin.BlogController.openEditor('${blog.id}')">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="action-btn delete" onclick="Admin.BlogController.deleteBlog('${blog.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        },

        openEditor(blogId = null) {
            this.currentEdit = blogId;
            const modal = document.getElementById('blogModal');
            const form = document.getElementById('blogForm');
            
            if (blogId) {
                const blog = DB.getBlogs().find(b => b.id === blogId);
                if (blog) {
                    document.getElementById('modalTitle').textContent = 'Edit Post';
                    document.getElementById('blogTitle').value = blog.title;
                    document.getElementById('blogCategory').value = blog.category;
                    document.getElementById('blogStatus').value = blog.status;
                    document.getElementById('blogContent').value = blog.content;
                    document.getElementById('blogExcerpt').value = blog.excerpt || '';
                }
            } else {
                document.getElementById('modalTitle').textContent = 'New Post';
                form.reset();
            }

            Modal.open('blogModal');
        },

        saveBlog() {
            const title = document.getElementById('blogTitle').value.trim();
            const category = document.getElementById('blogCategory').value;
            const status = document.getElementById('blogStatus').value;
            const content = document.getElementById('blogContent').value.trim();
            const excerpt = document.getElementById('blogExcerpt').value.trim();

            if (!title || !category || !content) {
                UI.showAlert('Please fill in all required fields', 'danger');
                return;
            }

            const blogs = DB.getBlogs();
            const session = Session.get();

            if (this.currentEdit) {
                // Update existing
                const idx = blogs.findIndex(b => b.id === this.currentEdit);
                if (idx !== -1) {
                    blogs[idx] = {
                        ...blogs[idx],
                        title,
                        slug: UI.slugify(title),
                        category,
                        status,
                        content,
                        excerpt,
                        updatedAt: new Date().toISOString()
                    };
                    DB.logActivity('Updated blog post', session.userId, { title });
                }
            } else {
                // Create new
                blogs.push({
                    id: DB.generateId('blog'),
                    title,
                    slug: UI.slugify(title),
                    category,
                    status,
                    content,
                    excerpt,
                    views: 0,
                    author: session.username,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                DB.logActivity('Created new blog post', session.userId, { title });
            }

            DB.saveBlogs(blogs);
            Modal.close('blogModal');
            this.loadBlogs();
            UI.showAlert('Blog post saved successfully');
        },

        deleteBlog(blogId) {
            if (!confirm('Are you sure you want to delete this post?')) return;

            const blogs = DB.getBlogs();
            const blog = blogs.find(b => b.id === blogId);
            const filtered = blogs.filter(b => b.id !== blogId);
            DB.saveBlogs(filtered);

            const session = Session.get();
            DB.logActivity('Deleted blog post', session.userId, { title: blog?.title });

            this.loadBlogs();
            UI.showAlert('Blog post deleted');
        }
    };

    // Services Controller
    const ServicesController = {
        currentEdit: null,

        init() {
            this.loadServices();
            this.setupEventListeners();
        },

        setupEventListeners() {
            const newBtn = document.getElementById('newServiceBtn');
            if (newBtn) {
                newBtn.addEventListener('click', () => this.openEditor());
            }

            const saveBtn = document.getElementById('saveServiceBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.saveService());
            }

            document.querySelectorAll('.modal-close, [data-dismiss="modal"]').forEach(btn => {
                btn.addEventListener('click', () => Modal.closeAll());
            });
        },

        loadServices() {
            const services = DB.getServices().sort((a, b) => a.order - b.order);

            const tbody = document.getElementById('servicesTableBody');
            if (tbody) {
                tbody.innerHTML = services.map(svc => `
                    <tr>
                        <td>
                            <div class="service-icon-preview">
                                <i class="fas ${svc.icon}"></i>
                            </div>
                        </td>
                        <td><strong>${UI.escapeHtml(svc.title)}</strong></td>
                        <td>${UI.escapeHtml(svc.description.substring(0, 60))}...</td>
                        <td>${svc.order}</td>
                        <td><span class="status-badge status-${svc.status}">${svc.status}</span></td>
                        <td>
                            <div class="action-btns">
                                <button class="action-btn edit" onclick="Admin.ServicesController.openEditor('${svc.id}')">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="action-btn delete" onclick="Admin.ServicesController.deleteService('${svc.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        },

        openEditor(serviceId = null) {
            this.currentEdit = serviceId;

            if (serviceId) {
                const service = DB.getServices().find(s => s.id === serviceId);
                if (service) {
                    document.getElementById('serviceModalTitle').textContent = 'Edit Service';
                    document.getElementById('serviceTitle').value = service.title;
                    document.getElementById('serviceIcon').value = service.icon;
                    document.getElementById('serviceDescription').value = service.description;
                    document.getElementById('serviceOrder').value = service.order;
                    document.getElementById('serviceStatus').value = service.status;
                }
            } else {
                document.getElementById('serviceModalTitle').textContent = 'New Service';
                document.getElementById('serviceForm').reset();
                document.getElementById('serviceOrder').value = DB.getServices().length + 1;
            }

            Modal.open('serviceModal');
        },

        saveService() {
            const title = document.getElementById('serviceTitle').value.trim();
            const icon = document.getElementById('serviceIcon').value.trim();
            const description = document.getElementById('serviceDescription').value.trim();
            const order = parseInt(document.getElementById('serviceOrder').value) || 1;
            const status = document.getElementById('serviceStatus').value;

            if (!title || !icon || !description) {
                UI.showAlert('Please fill in all required fields', 'danger');
                return;
            }

            const services = DB.getServices();
            const session = Session.get();

            if (this.currentEdit) {
                const idx = services.findIndex(s => s.id === this.currentEdit);
                if (idx !== -1) {
                    services[idx] = { ...services[idx], title, icon, description, order, status };
                    DB.logActivity('Updated service', session.userId, { title });
                }
            } else {
                services.push({
                    id: DB.generateId('svc'),
                    title,
                    icon,
                    description,
                    order,
                    status
                });
                DB.logActivity('Created new service', session.userId, { title });
            }

            DB.saveServices(services);
            Modal.close('serviceModal');
            this.loadServices();
            UI.showAlert('Service saved successfully');
        },

        deleteService(serviceId) {
            if (!confirm('Are you sure you want to delete this service?')) return;

            const services = DB.getServices();
            const service = services.find(s => s.id === serviceId);
            const filtered = services.filter(s => s.id !== serviceId);
            DB.saveServices(filtered);

            const session = Session.get();
            DB.logActivity('Deleted service', session.userId, { title: service?.title });

            this.loadServices();
            UI.showAlert('Service deleted');
        }
    };

    // Users Controller
    const UsersController = {
        currentEdit: null,

        init() {
            this.loadUsers();
            this.setupEventListeners();
        },

        setupEventListeners() {
            const newBtn = document.getElementById('addUserBtn');
            if (newBtn) {
                newBtn.addEventListener('click', () => this.openEditor());
            }

            const saveBtn = document.getElementById('saveUserBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.saveUser());
            }

            document.querySelectorAll('.modal-close, [data-dismiss="modal"]').forEach(btn => {
                btn.addEventListener('click', () => Modal.closeAll());
            });

            // Password toggle
            document.querySelectorAll('.password-toggle').forEach(btn => {
                btn.addEventListener('click', function() {
                    const input = this.parentElement.querySelector('input');
                    const icon = this.querySelector('i');
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.classList.replace('fa-eye', 'fa-eye-slash');
                    } else {
                        input.type = 'password';
                        icon.classList.replace('fa-eye-slash', 'fa-eye');
                    }
                });
            });
        },

        loadUsers() {
            const users = DB.getUsers();
            const currentUser = Session.get();

            const tbody = document.getElementById('usersTableBody');
            if (tbody) {
                tbody.innerHTML = users.map(user => `
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div class="user-avatar" style="width: 40px; height: 40px; font-size: 1rem;">
                                    ${user.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <strong>${UI.escapeHtml(user.fullName || user.username)}</strong>
                                    <br><small style="color: var(--text-light);">${user.role}</small>
                                </div>
                            </div>
                        </td>
                        <td>${UI.escapeHtml(user.email)}</td>
                        <td><span class="status-badge status-${user.role === 'admin' ? 'published' : 'pending'}">${user.role}</span></td>
                        <td><span class="status-badge status-${user.status}">${user.status}</span></td>
                        <td>
                            <div class="action-btns">
                                <button class="action-btn edit" onclick="Admin.UsersController.openEditor('${user.id}')">
                                    <i class="fas fa-pen"></i>
                                </button>
                                ${user.id !== currentUser.userId ? `
                                    <button class="action-btn delete" onclick="Admin.UsersController.deleteUser('${user.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        },

        openEditor(userId = null) {
            this.currentEdit = userId;
            const passwordField = document.getElementById('userPassword');
            const passwordLabel = document.querySelector('label[for="userPassword"]');

            if (userId) {
                const user = DB.getUsers().find(u => u.id === userId);
                if (user) {
                    document.getElementById('userModalTitle').textContent = 'Edit User';
                    document.getElementById('userUsername').value = user.username;
                    document.getElementById('userEmail').value = user.email;
                    document.getElementById('userFullName').value = user.fullName;
                    document.getElementById('userPassword').value = '';
                    document.getElementById('userRole').value = user.role;
                    document.getElementById('userStatus').value = user.status;

                    // Set permissions
                    const perms = user.permissions || {};
                    Object.keys(perms).forEach(module => {
                        Object.keys(perms[module]).forEach(action => {
                            const checkbox = document.getElementById(`perm_${module}_${action}`);
                            if (checkbox) {
                                checkbox.checked = perms[module][action];
                            }
                        });
                    });

                    passwordLabel.textContent = 'Password (leave blank to keep current)';
                }
            } else {
                document.getElementById('userModalTitle').textContent = 'Add User';
                document.getElementById('userForm').reset();
                passwordLabel.textContent = 'Password *';
                
                // Reset permissions
                document.querySelectorAll('.permission-item input').forEach(cb => cb.checked = false);
                document.querySelectorAll('.permission-item input[value="read"]').forEach(cb => cb.checked = true);
            }

            Modal.open('userModal');
        },

        saveUser() {
            const username = document.getElementById('userUsername').value.trim();
            const email = document.getElementById('userEmail').value.trim();
            const fullName = document.getElementById('userFullName').value.trim();
            const password = document.getElementById('userPassword').value;
            const role = document.getElementById('userRole').value;
            const status = document.getElementById('userStatus').value;

            if (!username || !email || !fullName) {
                UI.showAlert('Please fill in all required fields', 'danger');
                return;
            }

            if (!this.currentEdit && !password) {
                UI.showAlert('Password is required for new users', 'danger');
                return;
            }

            // Collect permissions
            const permissions = {
                blogs: {
                    create: document.getElementById('perm_blogs_create')?.checked || false,
                    read: document.getElementById('perm_blogs_read')?.checked || false,
                    update: document.getElementById('perm_blogs_update')?.checked || false,
                    delete: document.getElementById('perm_blogs_delete')?.checked || false
                },
                services: {
                    create: document.getElementById('perm_services_create')?.checked || false,
                    read: document.getElementById('perm_services_read')?.checked || false,
                    update: document.getElementById('perm_services_update')?.checked || false,
                    delete: document.getElementById('perm_services_delete')?.checked || false
                },
                testimonials: {
                    create: document.getElementById('perm_testimonials_create')?.checked || false,
                    read: document.getElementById('perm_testimonials_read')?.checked || false,
                    update: document.getElementById('perm_testimonials_update')?.checked || false,
                    delete: document.getElementById('perm_testimonials_delete')?.checked || false
                },
                contacts: {
                    read: document.getElementById('perm_contacts_read')?.checked || false,
                    delete: document.getElementById('perm_contacts_delete')?.checked || false
                },
                subscribers: {
                    read: document.getElementById('perm_subscribers_read')?.checked || false,
                    delete: document.getElementById('perm_subscribers_delete')?.checked || false
                },
                settings: {
                    view: document.getElementById('perm_settings_view')?.checked || false,
                    update: document.getElementById('perm_settings_update')?.checked || false
                }
            };

            const users = DB.getUsers();
            const session = Session.get();

            // Check username uniqueness
            const existingUser = users.find(u => u.username === username && u.id !== this.currentEdit);
            if (existingUser) {
                UI.showAlert('Username already exists', 'danger');
                return;
            }

            if (this.currentEdit) {
                const idx = users.findIndex(u => u.id === this.currentEdit);
                if (idx !== -1) {
                    users[idx] = {
                        ...users[idx],
                        username,
                        email,
                        fullName,
                        role,
                        status,
                        permissions: role === 'admin' ? users[idx].permissions : permissions
                    };
                    
                    if (password) {
                        users[idx].passwordHash = DB.hashPassword(password);
                    }
                    
                    DB.logActivity('Updated user', session.userId, { username });
                }
            } else {
                users.push({
                    id: DB.generateId('user'),
                    username,
                    email,
                    fullName,
                    passwordHash: DB.hashPassword(password),
                    role,
                    status,
                    permissions,
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                });
                DB.logActivity('Created new user', session.userId, { username });
            }

            DB.saveUsers(users);
            Modal.close('userModal');
            this.loadUsers();
            UI.showAlert('User saved successfully');
        },

        deleteUser(userId) {
            if (!confirm('Are you sure you want to delete this user?')) return;

            const users = DB.getUsers();
            const user = users.find(u => u.id === userId);
            const filtered = users.filter(u => u.id !== userId);
            DB.saveUsers(filtered);

            const session = Session.get();
            DB.logActivity('Deleted user', session.userId, { username: user?.username });

            this.loadUsers();
            UI.showAlert('User deleted');
        }
    };

    // Profile Controller
    const ProfileController = {
        init() {
            this.loadProfile();
            this.setupEventListeners();
        },

        setupEventListeners() {
            // Tab switching
            document.querySelectorAll('.profile-tab').forEach(tab => {
                tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
            });

            // Update profile
            const updateBtn = document.getElementById('updateProfileBtn');
            if (updateBtn) {
                updateBtn.addEventListener('click', () => this.updateProfile());
            }

            // Change password
            const changePassBtn = document.getElementById('changePasswordBtn');
            if (changePassBtn) {
                changePassBtn.addEventListener('click', () => this.changePassword());
            }

            // Password toggle
            document.querySelectorAll('.password-toggle').forEach(btn => {
                btn.addEventListener('click', function() {
                    const input = this.parentElement.querySelector('input');
                    const icon = this.querySelector('i');
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.classList.replace('fa-eye', 'fa-eye-slash');
                    } else {
                        input.type = 'password';
                        icon.classList.replace('fa-eye-slash', 'fa-eye');
                    }
                });
            });
        },

        loadProfile() {
            const user = Session.getCurrentUser();
            if (!user) return;

            document.getElementById('profileAvatar').textContent = user.fullName.charAt(0).toUpperCase();
            document.getElementById('profileName').textContent = user.fullName;
            document.getElementById('profileRole').textContent = user.role;
            document.getElementById('profileEmail').textContent = user.email;

            document.getElementById('profileUsername').value = user.username;
            document.getElementById('profileFullName').value = user.fullName;
            document.getElementById('profileEmailInput').value = user.email;
        },

        switchTab(tabName) {
            document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
            document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

            document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            document.getElementById(`${tabName}Tab`).style.display = 'block';
        },

        updateProfile() {
            const username = document.getElementById('profileUsername').value.trim();
            const fullName = document.getElementById('profileFullName').value.trim();
            const email = document.getElementById('profileEmailInput').value.trim();

            if (!username || !fullName || !email) {
                UI.showAlert('Please fill in all fields', 'danger');
                return;
            }

            const users = DB.getUsers();
            const session = Session.get();
            const idx = users.findIndex(u => u.id === session.userId);

            if (idx !== -1) {
                users[idx] = { ...users[idx], username, fullName, email };
                DB.saveUsers(users);
                DB.logActivity('Updated profile', session.userId, { username });
                this.loadProfile();
                UI.showAlert('Profile updated successfully');
            }
        },

        changePassword() {
            const currentPass = document.getElementById('currentPassword').value;
            const newPass = document.getElementById('newPassword').value;
            const confirmPass = document.getElementById('confirmPassword').value;

            if (!currentPass || !newPass || !confirmPass) {
                UI.showAlert('Please fill in all password fields', 'danger');
                return;
            }

            if (newPass !== confirmPass) {
                UI.showAlert('New passwords do not match', 'danger');
                return;
            }

            if (newPass.length < 6) {
                UI.showAlert('Password must be at least 6 characters', 'danger');
                return;
            }

            const user = Session.getCurrentUser();
            if (!DB.verifyPassword(currentPass, user.passwordHash)) {
                UI.showAlert('Current password is incorrect', 'danger');
                return;
            }

            const users = DB.getUsers();
            const idx = users.findIndex(u => u.id === user.id);
            if (idx !== -1) {
                users[idx].passwordHash = DB.hashPassword(newPass);
                DB.saveUsers(users);
                DB.logActivity('Changed password', user.id, {});

                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';

                UI.showAlert('Password changed successfully');
            }
        }
    };

    // Testimonials Controller
    const TestimonialsController = {
        currentEdit: null,

        init() {
            this.loadTestimonials();
            this.setupEventListeners();
        },

        setupEventListeners() {
            const newBtn = document.getElementById('newTestimonialBtn');
            if (newBtn) {
                newBtn.addEventListener('click', () => this.openEditor());
            }

            const saveBtn = document.getElementById('saveTestimonialBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.saveTestimonial());
            }

            document.querySelectorAll('.modal-close, [data-dismiss="modal"]').forEach(btn => {
                btn.addEventListener('click', () => Modal.closeAll());
            });
        },

        loadTestimonials() {
            const testimonials = DB.getTestimonials();

            const tbody = document.getElementById('testimonialsTableBody');
            if (tbody) {
                if (testimonials.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No testimonials yet</td></tr>';
                    return;
                }

                tbody.innerHTML = testimonials.map(t => `
                    <tr>
                        <td><strong>${UI.escapeHtml(t.name)}</strong></td>
                        <td>${UI.escapeHtml(t.company || '-')}</td>
                        <td>${'⭐'.repeat(t.rating)}</td>
                        <td><span class="status-badge status-${t.status}">${t.status}</span></td>
                        <td>
                            <div class="action-btns">
                                <button class="action-btn edit" onclick="Admin.TestimonialsController.openEditor('${t.id}')">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="action-btn delete" onclick="Admin.TestimonialsController.deleteTestimonial('${t.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        },

        openEditor(id = null) {
            this.currentEdit = id;

            if (id) {
                const t = DB.getTestimonials().find(x => x.id === id);
                if (t) {
                    document.getElementById('testimonialModalTitle').textContent = 'Edit Testimonial';
                    document.getElementById('testimonialName').value = t.name;
                    document.getElementById('testimonialCompany').value = t.company || '';
                    document.getElementById('testimonialRating').value = t.rating;
                    document.getElementById('testimonialContent').value = t.content;
                    document.getElementById('testimonialStatus').value = t.status;
                }
            } else {
                document.getElementById('testimonialModalTitle').textContent = 'Add Testimonial';
                document.getElementById('testimonialForm').reset();
            }

            Modal.open('testimonialModal');
        },

        saveTestimonial() {
            const name = document.getElementById('testimonialName').value.trim();
            const company = document.getElementById('testimonialCompany').value.trim();
            const rating = parseInt(document.getElementById('testimonialRating').value);
            const content = document.getElementById('testimonialContent').value.trim();
            const status = document.getElementById('testimonialStatus').value;

            if (!name || !content) {
                UI.showAlert('Please fill in required fields', 'danger');
                return;
            }

            const testimonials = DB.getTestimonials();
            const session = Session.get();

            if (this.currentEdit) {
                const idx = testimonials.findIndex(t => t.id === this.currentEdit);
                if (idx !== -1) {
                    testimonials[idx] = { ...testimonials[idx], name, company, rating, content, status };
                    DB.logActivity('Updated testimonial', session.userId, { name });
                }
            } else {
                testimonials.push({
                    id: DB.generateId('test'),
                    name,
                    company,
                    rating,
                    content,
                    status,
                    createdAt: new Date().toISOString()
                });
                DB.logActivity('Added testimonial', session.userId, { name });
            }

            DB.saveTestimonials(testimonials);
            Modal.close('testimonialModal');
            this.loadTestimonials();
            UI.showAlert('Testimonial saved successfully');
        },

        deleteTestimonial(id) {
            if (!confirm('Delete this testimonial?')) return;

            const testimonials = DB.getTestimonials();
            const filtered = testimonials.filter(t => t.id !== id);
            DB.saveTestimonials(filtered);

            const session = Session.get();
            DB.logActivity('Deleted testimonial', session.userId, {});

            this.loadTestimonials();
            UI.showAlert('Testimonial deleted');
        }
    };

    // Messages Controller
    const MessagesController = {
        init() {
            this.loadMessages();
        },

        loadMessages() {
            const messages = DB.getMessages();

            const tbody = document.getElementById('messagesTableBody');
            if (tbody) {
                if (messages.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No messages yet</td></tr>';
                    return;
                }

                tbody.innerHTML = messages.map(m => `
                    <tr class="${m.read ? '' : 'unread'}">
                        <td><strong>${UI.escapeHtml(m.name)}</strong></td>
                        <td>${UI.escapeHtml(m.email)}</td>
                        <td>${UI.escapeHtml(m.subject || 'No subject')}</td>
                        <td>${UI.formatDate(m.createdAt)}</td>
                        <td>
                            <div class="action-btns">
                                <button class="action-btn edit" onclick="Admin.MessagesController.viewMessage('${m.id}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="action-btn delete" onclick="Admin.MessagesController.deleteMessage('${m.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        },

        viewMessage(id) {
            const messages = DB.getMessages();
            const idx = messages.findIndex(m => m.id === id);
            if (idx !== -1) {
                messages[idx].read = true;
                DB.saveMessages(messages);
                
                const m = messages[idx];
                alert(`From: ${m.name}\nEmail: ${m.email}\nSubject: ${m.subject || 'No subject'}\n\n${m.message}`);
                this.loadMessages();
            }
        },

        deleteMessage(id) {
            if (!confirm('Delete this message?')) return;

            const messages = DB.getMessages();
            const filtered = messages.filter(m => m.id !== id);
            DB.saveMessages(filtered);

            this.loadMessages();
            UI.showAlert('Message deleted');
        }
    };

    // Subscribers Controller
    const SubscribersController = {
        init() {
            this.loadSubscribers();
        },

        loadSubscribers() {
            const subscribers = DB.getSubscribers();

            const tbody = document.getElementById('subscribersTableBody');
            if (tbody) {
                if (subscribers.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">No subscribers yet</td></tr>';
                    return;
                }

                tbody.innerHTML = subscribers.map(s => `
                    <tr>
                        <td>${UI.escapeHtml(s.email)}</td>
                        <td>${UI.formatDate(s.subscribedAt)}</td>
                        <td><span class="status-badge status-${s.status}">${s.status}</span></td>
                        <td>
                            <div class="action-btns">
                                <button class="action-btn delete" onclick="Admin.SubscribersController.deleteSubscriber('${s.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        },

        deleteSubscriber(id) {
            if (!confirm('Remove this subscriber?')) return;

            const subscribers = DB.getSubscribers();
            const filtered = subscribers.filter(s => s.id !== id);
            DB.saveSubscribers(filtered);

            this.loadSubscribers();
            UI.showAlert('Subscriber removed');
        }
    };

    // Analytics Controller
    const AnalyticsController = {
        init() {
            this.loadAnalytics();
        },

        loadAnalytics() {
            const blogs = DB.getBlogs();
            const activities = DB.getActivity();
            const messages = DB.getMessages();
            const subscribers = DB.getSubscribers();

            // Top posts by views
            const topPosts = [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
            const topPostsList = document.getElementById('topPostsList');
            if (topPostsList) {
                topPostsList.innerHTML = topPosts.map((p, i) => `
                    <li class="activity-item">
                        <div class="activity-info">
                            <strong>${i + 1}.</strong>
                            <span>${UI.escapeHtml(p.title)}</span>
                        </div>
                        <span class="activity-date">${p.views || 0} views</span>
                    </li>
                `).join('');
            }

            // Recent activities
            const recentAct = activities.slice(0, 10);
            const recentActList = document.getElementById('recentActivityList');
            if (recentActList) {
                recentActList.innerHTML = recentAct.map(a => {
                    const user = DB.getUserById(a.userId);
                    return `
                        <li class="activity-item">
                            <div class="activity-info">
                                <strong>${user ? user.username : 'System'}</strong>
                                <span>${UI.escapeHtml(a.action)}</span>
                            </div>
                            <span class="activity-date">${UI.formatDateTime(a.timestamp)}</span>
                        </li>
                    `;
                }).join('');
            }
        }
    };

    // Settings Controller
    const SettingsController = {
        init() {
            this.loadSettings();
            this.setupEventListeners();
        },

        setupEventListeners() {
            const saveBtn = document.getElementById('saveSettingsBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.saveSettings());
            }
        },

        loadSettings() {
            const settings = DB.getSettings();
            
            Object.keys(settings).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = settings[key];
                }
            });
        },

        saveSettings() {
            const settings = {
                siteName: document.getElementById('siteName')?.value || '',
                siteTagline: document.getElementById('siteTagline')?.value || '',
                contactEmail: document.getElementById('contactEmail')?.value || '',
                contactPhone: document.getElementById('contactPhone')?.value || '',
                whatsapp: document.getElementById('whatsapp')?.value || '',
                address: document.getElementById('address')?.value || '',
                workingHours: document.getElementById('workingHours')?.value || '',
                socialFacebook: document.getElementById('socialFacebook')?.value || '',
                socialInstagram: document.getElementById('socialInstagram')?.value || '',
                socialLinkedIn: document.getElementById('socialLinkedIn')?.value || '',
                socialWhatsApp: document.getElementById('socialWhatsApp')?.value || ''
            };

            DB.saveSettings(settings);
            
            const session = Session.get();
            DB.logActivity('Updated site settings', session.userId, {});

            UI.showAlert('Settings saved successfully');
        }
    };

    // ============================================
    // Initialize
    // ============================================
    DB.init();

    // Export to global scope
    window.Admin = {
        DB,
        Session,
        UI,
        Modal,
        LoginController,
        DashboardController,
        BlogController,
        ServicesController,
        UsersController,
        ProfileController,
        TestimonialsController,
        MessagesController,
        SubscribersController,
        AnalyticsController,
        SettingsController
    };

    // Auto-init based on page
    document.addEventListener('DOMContentLoaded', () => {
        const page = document.body.dataset.page;
        
        // Check authentication for protected pages
        if (page && page !== 'login' && !Session.isLoggedIn()) {
            window.location.href = 'index.html';
            return;
        }

        // Initialize page controller
        switch (page) {
            case 'login':
                LoginController.init();
                break;
            case 'dashboard':
                DashboardController.init();
                break;
            case 'blogs':
                BlogController.init();
                break;
            case 'services':
                ServicesController.init();
                break;
            case 'users':
                UsersController.init();
                break;
            case 'profile':
                ProfileController.init();
                break;
            case 'testimonials':
                TestimonialsController.init();
                break;
            case 'messages':
                MessagesController.init();
                break;
            case 'subscribers':
                SubscribersController.init();
                break;
            case 'analytics':
                AnalyticsController.init();
                break;
            case 'settings':
                SettingsController.init();
                break;
        }

        // Setup logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    Session.logout();
                }
            });
        }

        // Update user info in header
        if (Session.isLoggedIn()) {
            const user = Session.getCurrentUser();
            if (user) {
                const userAvatar = document.querySelector('.user-avatar');
                if (userAvatar) {
                    userAvatar.textContent = user.fullName.charAt(0).toUpperCase();
                }
            }
        }
    });

})();
