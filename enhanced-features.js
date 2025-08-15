// Enhanced Features for Netflix-Style Portfolio
// Features: Advanced Filtering, Interactive Timeline, Magnetic Cursor

document.addEventListener('DOMContentLoaded', function() {
    
    // Add enhanced CSS styles
    const enhancedStyles = `
        <style>
        /* Advanced Project Controls */
        .projects-controls {
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.8s ease-out;
        }
        
        .projects-controls.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .filter-tag {
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            background: rgba(31, 41, 55, 0.6);
            border: 1px solid rgba(75, 85, 99, 0.4);
            color: #e5e7eb;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
            -webkit-user-select: none;
            position: relative;
            overflow: hidden;
        }
        
        .filter-tag::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.6s ease;
        }
        
        .filter-tag:hover::before {
            left: 100%;
        }
        
        .filter-tag:hover {
            background: rgba(55, 65, 81, 0.7);
            border-color: rgba(229, 9, 20, 0.4);
            color: #fff;
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(229, 9, 20, 0.2);
        }
        
        .filter-tag.active {
            background: linear-gradient(135deg, #E50914, #dc2626);
            border-color: rgba(229, 9, 20, 0.8);
            color: #fff;
            box-shadow: 0 8px 20px rgba(229, 9, 20, 0.25), 0 0 0 1px rgba(229, 9, 20, 0.3);
            transform: scale(1.05);
        }
        
        /* Magnetic Cursor Effect */
        .magnetic-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #E50914, #dc2626);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            opacity: 0;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 20px rgba(229, 9, 20, 0.6);
        }
        
        .magnetic-cursor.active {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.5);
        }
        
        .magnetic-element {
            transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* Interactive Timeline Enhancements */
        .timeline-zoom-controls {
            position: absolute;
            top: 1rem;
            right: 1rem;
            display: flex;
            gap: 0.5rem;
            z-index: 20;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        }
        
        .timeline-container:hover .timeline-zoom-controls {
            opacity: 1;
            transform: translateY(0);
        }
        
        .zoom-btn {
            width: 40px;
            height: 40px;
            background: rgba(31, 41, 55, 0.8);
            border: 1px solid rgba(75, 85, 99, 0.4);
            border-radius: 50%;
            color: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        
        .zoom-btn:hover {
            background: rgba(229, 9, 20, 0.8);
            border-color: rgba(229, 9, 20, 1);
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(229, 9, 20, 0.4);
        }
        
        .timeline-draggable {
            cursor: grab;
            user-select: none;
            -webkit-user-select: none;
        }
        
        .timeline-draggable.dragging {
            cursor: grabbing;
        }
        
        .timeline-container.zoomed {
            transform-origin: center;
        }
        
        /* Search and Filter Animations */
        .project-card-hidden {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .project-card-visible {
            opacity: 1;
            transform: scale(1) translateY(0);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .no-results {
            text-align: center;
            padding: 4rem 2rem;
            color: #9ca3af;
        }
        
        .no-results i {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
        </style>
    `;
    
    // Inject styles
    document.head.insertAdjacentHTML('beforeend', enhancedStyles);
    
    // Add magnetic cursor to body
    const magneticCursor = document.createElement('div');
    magneticCursor.className = 'magnetic-cursor';
    document.body.appendChild(magneticCursor);
    
    // Add enhanced project controls
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        const projectsTitle = projectsSection.querySelector('h3');
        const projectsGrid = projectsSection.querySelector('.grid');
        
        if (projectsTitle && projectsGrid) {
            // Change grid ID for easier targeting
            projectsGrid.id = 'projects-grid';
            
            const enhancedControls = `
                <div class="projects-controls mb-8 opacity-0 transform translate-y-4 transition-all duration-800 ease-out">
                    <!-- Search Bar -->
                    <div class="search-container relative mb-6">
                        <div class="relative max-w-md mx-auto">
                            <input 
                                type="text" 
                                id="project-search" 
                                placeholder="Search projects, technologies..." 
                                class="w-full px-4 py-3 pl-12 pr-4 bg-gray-800/50 border border-gray-600/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm"
                            >
                            <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300"></i>
                            <button id="clear-search" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-300 opacity-0 pointer-events-none">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Advanced Filters -->
                    <div class="filters-container">
                        <div class="flex flex-wrap justify-center gap-3 mb-4">
                            <span class="filter-tag active" data-filter="all">All Projects</span>
                            <span class="filter-tag" data-filter="robotics">Robotics</span>
                            <span class="filter-tag" data-filter="data">Data Science</span>
                            <span class="filter-tag" data-filter="web">Web Development</span>
                            <span class="filter-tag" data-filter="ai">AI/ML</span>
                            <span class="filter-tag" data-filter="iot">IoT</span>
                        </div>
                        
                        <!-- Sort Options -->
                        <div class="sort-container flex justify-center items-center gap-4 text-sm">
                            <span class="text-gray-400">Sort by:</span>
                            <select id="project-sort" class="bg-gray-800/50 border border-gray-600/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all duration-300">
                                <option value="default">Featured</option>
                                <option value="name">Name</option>
                                <option value="tech">Technology</option>
                                <option value="recent">Most Recent</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Results Counter -->
                    <div class="results-counter text-center mt-4">
                        <span id="results-count" class="text-gray-400 text-sm">Showing <span class="text-white font-semibold">8</span> projects</span>
                    </div>
                </div>
            `;
            
            projectsTitle.insertAdjacentHTML('afterend', enhancedControls);
        }
    }
    
    // Initialize enhanced features
    initializeEnhancedFeatures();
});

function initializeEnhancedFeatures() {
    // --- Advanced Project Filtering and Search ---
    const projectSearch = document.getElementById('project-search');
    const clearSearch = document.getElementById('clear-search');
    const projectSort = document.getElementById('project-sort');
    const resultsCount = document.getElementById('results-count');
    const projectsGrid = document.getElementById('projects-grid');
    const filterTags = document.querySelectorAll('.filter-tag');
    const projectsControls = document.querySelector('.projects-controls');
    
    let allProjects = [];
    let filteredProjects = [];
    let currentFilter = 'all';
    
    // Initialize projects data
    const initializeProjects = () => {
        const projectCards = document.querySelectorAll('.thumbnail-card');
        allProjects = Array.from(projectCards).map((card, index) => ({
            element: card,
            title: card.dataset.title || '',
            tech: card.dataset.tech || '',
            desc: card.dataset.desc || '',
            category: getProjectCategory(card.dataset.title, card.dataset.tech),
            index: index
        }));
        filteredProjects = [...allProjects];
        updateResultsCount();
    };
    
    // Categorize projects based on title and tech
    const getProjectCategory = (title, tech) => {
        const titleLower = title.toLowerCase();
        const techLower = tech.toLowerCase();
        
        if (titleLower.includes('robot') || titleLower.includes('apg') || techLower.includes('arduino') || techLower.includes('iot')) {
            return 'robotics';
        }
        if (titleLower.includes('data') || titleLower.includes('dashboard') || titleLower.includes('tableau') || techLower.includes('python')) {
            return 'data';
        }
        if (titleLower.includes('website') || titleLower.includes('web') || techLower.includes('html') || techLower.includes('javascript')) {
            return 'web';
        }
        if (titleLower.includes('ai') || titleLower.includes('ml') || titleLower.includes('prediction') || techLower.includes('machine learning')) {
            return 'ai';
        }
        return 'other';
    };
    
    // Search functionality
    const performSearch = (query) => {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm === '') {
            clearSearch.style.opacity = '0';
            clearSearch.style.pointerEvents = 'none';
            filteredProjects = allProjects.filter(project => 
                currentFilter === 'all' || project.category === currentFilter
            );
        } else {
            clearSearch.style.opacity = '1';
            clearSearch.style.pointerEvents = 'auto';
            filteredProjects = allProjects.filter(project => {
                const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                                    project.tech.toLowerCase().includes(searchTerm) ||
                                    project.desc.toLowerCase().includes(searchTerm);
                const matchesFilter = currentFilter === 'all' || project.category === currentFilter;
                return matchesSearch && matchesFilter;
            });
        }
        
        renderProjects();
        updateResultsCount();
    };
    
    // Filter functionality
    const applyFilter = (filter) => {
        currentFilter = filter;
        filterTags.forEach(tag => {
            tag.classList.toggle('active', tag.dataset.filter === filter);
        });
        
        const searchTerm = projectSearch ? projectSearch.value.toLowerCase().trim() : '';
        if (searchTerm === '') {
            filteredProjects = allProjects.filter(project => 
                filter === 'all' || project.category === filter
            );
        } else {
            filteredProjects = allProjects.filter(project => {
                const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                                    project.tech.toLowerCase().includes(searchTerm) ||
                                    project.desc.toLowerCase().includes(searchTerm);
                const matchesFilter = filter === 'all' || project.category === filter;
                return matchesSearch && matchesFilter;
            });
        }
        
        renderProjects();
        updateResultsCount();
    };
    
    // Sort functionality
    const sortProjects = (sortBy) => {
        switch (sortBy) {
            case 'name':
                filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'tech':
                filteredProjects.sort((a, b) => a.tech.localeCompare(b.tech));
                break;
            case 'recent':
                filteredProjects.sort((a, b) => b.index - a.index);
                break;
            default:
                filteredProjects.sort((a, b) => a.index - b.index);
        }
        renderProjects();
    };
    
    // Render projects with animations
    const renderProjects = () => {
        // Hide all projects first
        allProjects.forEach(project => {
            project.element.classList.add('project-card-hidden');
            project.element.classList.remove('project-card-visible');
        });
        
        setTimeout(() => {
            // Show filtered projects
            filteredProjects.forEach((project, index) => {
                setTimeout(() => {
                    project.element.classList.remove('project-card-hidden');
                    project.element.classList.add('project-card-visible');
                }, index * 100);
            });
            
            // Handle no results
            if (filteredProjects.length === 0) {
                showNoResults();
            } else {
                hideNoResults();
            }
        }, 200);
    };
    
    // Show no results message
    const showNoResults = () => {
        let noResultsEl = document.querySelector('.no-results');
        if (!noResultsEl) {
            noResultsEl = document.createElement('div');
            noResultsEl.className = 'no-results';
            noResultsEl.innerHTML = `
                <i class="fas fa-search"></i>
                <h3 class="text-xl font-bold mb-2">No projects found</h3>
                <p>Try adjusting your search or filter criteria</p>
            `;
            if (projectsGrid) {
                projectsGrid.appendChild(noResultsEl);
            }
        }
        noResultsEl.style.display = 'block';
    };
    
    // Hide no results message
    const hideNoResults = () => {
        const noResultsEl = document.querySelector('.no-results');
        if (noResultsEl) {
            noResultsEl.style.display = 'none';
        }
    };
    
    // Update results counter
    const updateResultsCount = () => {
        if (resultsCount) {
            const count = filteredProjects.length;
            const countSpan = resultsCount.querySelector('span');
            if (countSpan) {
                countSpan.textContent = count;
            }
        }
    };
    
    // Event listeners for project controls
    if (projectSearch) {
        projectSearch.addEventListener('input', (e) => performSearch(e.target.value));
    }
    
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            if (projectSearch) {
                projectSearch.value = '';
                performSearch('');
            }
        });
    }
    
    if (projectSort) {
        projectSort.addEventListener('change', (e) => sortProjects(e.target.value));
    }
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => applyFilter(tag.dataset.filter));
    });
    
    // Show project controls when projects section is visible
    const projectsSection = document.getElementById('projects');
    if (projectsSection && projectsControls) {
        const projectsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        projectsControls.classList.add('visible');
                    }, 300);
                }
            });
        }, { threshold: 0.3 });
        projectsObserver.observe(projectsSection);
    }
    
    // Initialize projects
    initializeProjects();
    
    // --- Magnetic Cursor Effect ---
    const magneticCursor = document.querySelector('.magnetic-cursor');
    const magneticElements = document.querySelectorAll('.thumbnail-card, .filter-tag, .zoom-btn, .btn-primary, .btn-secondary');
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animate cursor
    const animateCursor = () => {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        if (magneticCursor) {
            magneticCursor.style.left = cursorX + 'px';
            magneticCursor.style.top = cursorY + 'px';
        }
        
        requestAnimationFrame(animateCursor);
    };
    
    // Start cursor animation
    animateCursor();
    
    // Magnetic effect for elements
    magneticElements.forEach(element => {
        element.classList.add('magnetic-element');
        
        element.addEventListener('mouseenter', () => {
            if (magneticCursor) {
                magneticCursor.classList.add('active');
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (magneticCursor) {
                magneticCursor.classList.remove('active');
            }
            element.style.transform = '';
        });
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    // --- Interactive Timeline Enhancements ---
    const timelineContainer = document.getElementById('timeline-container');
    let isTimelineDragging = false;
    let timelineStartX = 0;
    let timelineScrollLeft = 0;
    let timelineZoom = 1;
    
    // Add zoom controls to timeline
    if (timelineContainer) {
        const zoomControls = document.createElement('div');
        zoomControls.className = 'timeline-zoom-controls';
        zoomControls.innerHTML = `
            <button class="zoom-btn" id="zoom-in" title="Zoom In">
                <i class="fas fa-plus"></i>
            </button>
            <button class="zoom-btn" id="zoom-out" title="Zoom Out">
                <i class="fas fa-minus"></i>
            </button>
            <button class="zoom-btn" id="zoom-reset" title="Reset Zoom">
                <i class="fas fa-expand-arrows-alt"></i>
            </button>
        `;
        timelineContainer.appendChild(zoomControls);
        
        // Zoom functionality
        document.getElementById('zoom-in').addEventListener('click', () => {
            timelineZoom = Math.min(timelineZoom * 1.2, 3);
            applyTimelineZoom();
        });
        
        document.getElementById('zoom-out').addEventListener('click', () => {
            timelineZoom = Math.max(timelineZoom / 1.2, 0.5);
            applyTimelineZoom();
        });
        
        document.getElementById('zoom-reset').addEventListener('click', () => {
            timelineZoom = 1;
            applyTimelineZoom();
        });
        
        // Apply zoom
        const applyTimelineZoom = () => {
            timelineContainer.style.transform = `scale(${timelineZoom})`;
            timelineContainer.classList.toggle('zoomed', timelineZoom !== 1);
        };
        
        // Make timeline draggable
        timelineContainer.classList.add('timeline-draggable');
        
        timelineContainer.addEventListener('mousedown', (e) => {
            if (e.target.closest('.zoom-btn')) return;
            isTimelineDragging = true;
            timelineContainer.classList.add('dragging');
            timelineStartX = e.pageX - timelineContainer.offsetLeft;
            timelineScrollLeft = timelineContainer.scrollLeft;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isTimelineDragging) return;
            e.preventDefault();
            const x = e.pageX - timelineContainer.offsetLeft;
            const walk = (x - timelineStartX) * 2;
            timelineContainer.scrollLeft = timelineScrollLeft - walk;
        });
        
        document.addEventListener('mouseup', () => {
            isTimelineDragging = false;
            timelineContainer.classList.remove('dragging');
        });
    }
}