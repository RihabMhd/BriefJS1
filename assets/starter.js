/**
 * Job Listings Application - Complete Implementation
 * 
 * This is a complete job listings management application with detailed comments.
 * All TODO sections are preserved with step-by-step implementation.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------
    // --- GLOBAL VARIABLES ---
    // ------------------------------------

    /** @type {Array} All job listings loaded from data.json */
    let allJobs = [];

    /** @type {Array} Currently active manual filters (tags clicked by user) */
    let manualFilters = [];

    /** @type {Object} User profile data with name, position and skills */
    let userProfile = { name: '', position: '', skills: [] };

    /** @type {Array} Array of favorite job IDs stored as integers */
    let favoriteJobIds = [];

    // LocalStorage keys - using constants to avoid typos
    const PROFILE_STORAGE_KEY = 'jobAppUserProfile';
    const FAVORITES_STORAGE_KEY = 'jobAppFavorites';
    const ALL_JOBS_KEY = 'jobAppAllJobs';

    // DOM Elements - Main containers
    const jobListingsContainer = document.getElementById('job-listings-container');
    const filterTagsContainer = document.getElementById('filter-tags-container');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const searchInput = document.getElementById('search-input');
    const statsCounter = document.getElementById('stats-counter');
    const filterBar = document.getElementById('filter-bar');

    // DOM Elements - Profile
    const profileForm = document.getElementById('profile-form');
    const profileNameInput = document.getElementById('profile-name');
    const profilePositionInput = document.getElementById('profile-position');
    const skillInput = document.getElementById('skill-input');
    const profileSkillsList = document.getElementById('profile-skills-list');

    // DOM Elements - Tabs
    const tabsNav = document.querySelector('.tabs-nav');
    const tabContents = document.querySelectorAll('.tab-content');

    // DOM Elements - Favorites
    const favoriteJobsContainer = document.getElementById('favorite-jobs-container');
    const favoritesCount = document.getElementById('favorites-count');

    // DOM Elements - Job Management
    const manageJobsList = document.getElementById('manage-jobs-list');
    const addNewJobBtn = document.getElementById('add-new-job-btn');

    // DOM Elements - View Modal
    const viewModal = document.getElementById('job-modal');
    const viewModalCloseBtn = document.getElementById('modal-close-btn-view');

    // DOM Elements - Manage Modal
    const manageModal = document.getElementById('manage-job-modal');
    const manageModalCloseBtn = document.getElementById('modal-close-btn-manage');
    const manageModalTitle = document.getElementById('manage-modal-title');
    const manageJobForm = document.getElementById('manage-job-form');

    // DOM Elements - Manage Form Fields
    const jobIdInput = document.getElementById('job-id-input');
    const jobCompanyInput = document.getElementById('job-company');
    const jobPositionInput = document.getElementById('job-position');
    const jobLogoInput = document.getElementById('job-logo');
    const jobContractInput = document.getElementById('job-contract');
    const jobLocationInput = document.getElementById('job-location');
    const jobRoleInput = document.getElementById('job-role');
    const jobLevelInput = document.getElementById('job-level');
    const jobSkillsInput = document.getElementById('job-skills');
    const jobDescriptionInput = document.getElementById('job-description');

    // ------------------------------------
    // --- DATA MANAGEMENT ---
    // ------------------------------------

    /**
     * Loads job listings from data.json file
     * If localStorage has saved jobs, use those instead for persistence
     * @async
     * @function loadAllJobs
     * @returns {Promise<void>}
     */
    const loadAllJobs = async () => {
        // TODO: Implement data loading logic
        // 1. Check if jobs exist in localStorage
        // 2. If not, fetch from data.json
        // 3. Save to localStorage for persistence
        // 4. Handle errors appropriately

        try {
            const cachedJobs = localStorage.getItem(ALL_JOBS_KEY);

            if (cachedJobs) {
                allJobs = JSON.parse(cachedJobs);
                console.log('Loaded jobs from cache:', allJobs.length);
                return;
            }

            console.log('No cached data found, fetching from file...');
            const response = await fetch('./assets/data/data.json');

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            allJobs = await response.json();
            allJobs = allJobs.map(job => ({
                ...job,
                id: typeof job.id === 'number' ? job.id : parseInt(job.id)
            }));

            saveAllJobs();
            console.log(`Fetched and saved ${allJobs.length} jobs to localStorage`);

        } catch (error) {
            console.error("Error loading data.json:", error);
            jobListingsContainer.innerHTML = '<p class="job-listings__empty">Erreur de chargement des données.</p>';
            allJobs = [];
        }
    };

    /**
     * Saves all jobs to localStorage
     * @function saveAllJobs
     */
    const saveAllJobs = () => {
        // TODO: Implement localStorage save functionality
        try {
            localStorage.setItem(ALL_JOBS_KEY, JSON.stringify(allJobs));
            console.log(`Saved ${allJobs.length} jobs to localStorage`);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            alert('Erreur lors de la sauvegarde des données');
        }
    };

    // ------------------------------------//
    // --------- FORM VALIDATION ----------//
    // ------------------------------------//

    /**
     * Shows error message for a form field
     * @function showError
     * @param {HTMLElement} input - The input element
     * @param {string} message - Error message to display
     */
    const showError = (input, message) => {
        // TODO: Implement error display logic
        // 1. Add error class to input
        // 2. Find error span element
        // 3. Display error message

        input.classList.add('has-error');

        const errorSpan = input.nextElementSibling;

        if (errorSpan && errorSpan.classList.contains('form-error')) {
            errorSpan.style.display = "block";
            errorSpan.textContent = message;
        }
    };

    /**
     * Clears all errors from a form
     * @function clearErrors
     * @param {HTMLElement} form - The form element
     */
    const clearErrors = (form) => {
        // TODO: Implement error clearing logic
        // 1. Remove error classes from inputs
        // 2. Clear error messages

        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.classList.remove('has-error');

            const err = input.nextElementSibling;

            if (err && err.classList.contains('form-error')) {
                err.style.display = "none";
                err.textContent = '';
            }
        });
    };

    /**
     * Validates the profile form
     * @function validateProfileForm
     * @returns {boolean} True if valid, false otherwise
     */
    const validateProfileForm = () => {
        // TODO: Implement profile form validation
        // 1. Check required fields
        // 2. Show errors if invalid
        // 3. Return validation result

        let isValid = true;

        const name = profileNameInput.value.trim();
        const position = profilePositionInput.value.trim();

        if (!name) {
            showError(profileNameInput, 'Le nom complet est requis');
            isValid = false;
        } else if (name.length < 3) {
            showError(profileNameInput, 'Le nom doit contenir au moins 3 caractères');
            isValid = false;
        }

        if (!position) {
            showError(profilePositionInput, 'Le poste souhaité est requis');
            isValid = false;
        } else if (position.length < 3) {
            showError(profilePositionInput, 'Le poste doit contenir au moins 3 caractères');
            isValid = false;
        }

        return isValid;
    };

    /**
     * Validates the job management form
     * @function validateJobForm
     * @returns {boolean} True if valid, false otherwise
     */
    const validateJobForm = () => {
        // TODO: Implement job form validation
        // 1. Validate all required fields
        // 2. Validate URL format for logo
        // 3. Show appropriate error messages

        let isValid = true;

        const company = jobCompanyInput.value.trim();
        const position = jobPositionInput.value.trim();
        const contract = jobContractInput.value.trim();
        const location = jobLocationInput.value.trim();
        const role = jobRoleInput.value.trim();
        const level = jobLevelInput.value.trim();
        const skills = jobSkillsInput.value.trim();
        const description = jobDescriptionInput.value.trim();

        if (!company) {
            showError(jobCompanyInput, "Le nom de l'entreprise est requis");
            isValid = false;
        }

        if (!position) {
            showError(jobPositionInput, 'Le poste est requis');
            isValid = false;
        }

        if (!contract) {
            showError(jobContractInput, 'Le type de contrat est requis');
            isValid = false;
        }

        if (!location) {
            showError(jobLocationInput, 'La localisation est requise');
            isValid = false;
        }

        if (!role) {
            showError(jobRoleInput, 'Le rôle est requis');
            isValid = false;
        }

        if (!level) {
            showError(jobLevelInput, 'Le niveau est requis');
            isValid = false;
        }

        if (!skills) {
            showError(jobSkillsInput, 'Au moins une compétence est requise');
            isValid = false;
        }

        if (!description) {
            showError(jobDescriptionInput, 'La description est requise');
            isValid = false;
        }

        return isValid;
    };

    // ------------------------------------
    // --- PROFILE MANAGEMENT ---
    // ------------------------------------

    /**
     * Saves user profile to localStorage
     * @function saveProfile
     */
    const saveProfile = () => {
        // TODO: Implement profile saving
        try {
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
            console.log('Profile saved:', userProfile);
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    /**
     * Loads user profile from localStorage
     * @function loadProfile
     */
    const loadProfile = () => {
        // TODO: Implement profile loading
        try {
            const saved = localStorage.getItem(PROFILE_STORAGE_KEY);

            if (saved) {
                userProfile = JSON.parse(saved);
                console.log('Profile loaded:', userProfile);
            } else {
                console.log('No saved profile found');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            userProfile = { name: '', position: '', skills: [] };
        }
    };

    /**
     * Renders profile skills list
     * @function renderProfileSkills
     */
    const renderProfileSkills = () => {
        // TODO: Implement skills rendering
        // Use this HTML template for each skill:
        // `<li class="profile-skill-tag" data-skill="${skill}">
        //     <span>${skill}</span>
        //     <button class="profile-skill-remove" aria-label="Remove skill ${skill}">✕</button>
        //  </li>`

        profileSkillsList.innerHTML = '';

        if (!userProfile.skills || userProfile.skills.length === 0) {
            profileSkillsList.innerHTML = '<li class="empty-message">Aucune compétence ajoutée</li>';
            return;
        }

        userProfile.skills.forEach(skill => {
            const skillItem = document.createElement('li');
            skillItem.className = 'profile-skill-tag';
            skillItem.dataset.skill = skill;

            skillItem.innerHTML = `
                <span>${skill}</span>
                <button class="profile-skill-remove" aria-label="Remove skill ${skill}">✕</button>
            `;

            const removeBtn = skillItem.querySelector('.profile-skill-remove');
            removeBtn.addEventListener('click', () => {
                userProfile.skills = userProfile.skills.filter(s => s !== skill);
                saveProfile();
                renderProfileSkills();
                applyAllFilters();
            });

            profileSkillsList.appendChild(skillItem);
        });
    };

    /**
     * Renders profile form with saved data
     * @function renderProfileForm
     */
    const renderProfileForm = () => {
        // TODO: Populate form fields with saved profile data

        if (profileNameInput) {
            profileNameInput.value = userProfile.name || '';
        }

        if (profilePositionInput) {
            profilePositionInput.value = userProfile.position || '';
        }

        renderProfileSkills();
    };

    /**
     * Handles profile form submission
     * @function handleProfileSave
     * @param {Event} e - Form submit event
     */
    const handleProfileSave = (e) => {
        // TODO: Implement profile save logic
        // 1. Prevent default form submission
        // 2. Validate form
        // 3. Save profile data
        // 4. Update filters if needed

        e.preventDefault();

        clearErrors(profileForm);

        if (!validateProfileForm()) return;

        userProfile.name = profileNameInput.value.trim();
        userProfile.position = profilePositionInput.value.trim();

        saveProfile();
        renderProfileSkills();
        applyAllFilters();
        alert('Profil enregistré avec succès !');
    };

    /**
     * Handles adding new skills
     * @function handleSkillAdd
     * @param {KeyboardEvent} e - Keydown event
     */
    const handleSkillAdd = (e) => {
        // TODO: Implement skill addition on Enter key
        // 1. Check if Enter key was pressed
        // 2. Get skill value
        // 3. Add to profile if not duplicate
        // 4. Re-render skills and apply filters

        if (e.key !== 'Enter') return;
        e.preventDefault();

        const skill = skillInput.value.trim();
        if (!skill) return;

        if (userProfile.skills.includes(skill)) {
            alert('Cette compétence existe déjà !');
            return;
        }

        userProfile.skills.push(skill);

        saveProfile();
        renderProfileSkills();
        skillInput.value = '';
        applyAllFilters();
    };

    // ------------------------------------
    // --- FAVORITES MANAGEMENT ---
    // ------------------------------------

    /**
     * Saves favorites to localStorage
     * @function saveFavorites
     */
    const saveFavorites = () => {
        // TODO: Implement favorites saving
        try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteJobIds));
            console.log('Favorites saved:', favoriteJobIds);
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    /**
     * Loads favorites from localStorage
     * @function loadFavorites
     */
    const loadFavorites = () => {
        // TODO: Implement favorites loading
        try {
            const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
            if (saved) {
                favoriteJobIds = JSON.parse(saved);
                // Ensure all IDs are numbers for consistent comparison
                // Filter out any null, undefined, or NaN values
                favoriteJobIds = favoriteJobIds
                    .map(id => typeof id === 'number' ? id : parseInt(id))
                    .filter(id => !isNaN(id) && id !== null && id !== undefined);

                // Save cleaned array back to localStorage
                saveFavorites();
                console.log('Favorites loaded and cleaned:', favoriteJobIds);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            favoriteJobIds = [];
        }
    };

    /**
     * Updates favorites count display
     * @function renderFavoritesCount
     */
    const renderFavoritesCount = () => {
        // TODO: Implement favorites count update
        if (favoritesCount) {
            favoritesCount.textContent = `(${favoriteJobIds.length})`;
        }
    };

    /**
     * Renders favorite jobs in favorites tab
     * @function renderFavoriteJobs
     */
    const renderFavoriteJobs = () => {
        // TODO: Implement favorites rendering
        // 1. Filter jobs by favorite IDs
        // 2. Use createJobCardHTML for each job
        // 3. Show empty message if no favorites

        const favoriteJobs = allJobs.filter(job => favoriteJobIds.includes(job.id));

        if (favoriteJobs.length === 0) {
            favoriteJobsContainer.innerHTML = '<p class="job-listings__empty">Aucune offre favorite pour le moment.</p>';
            return;
        }

        favoriteJobsContainer.innerHTML = favoriteJobs.map(createJobCardHTML).join('');
    };

    /**
     * Toggles job favorite status
     * @function toggleFavorite
     * @param {number} jobId - Job ID to toggle
     */
    const toggleFavorite = (jobId) => {
        // TODO: Implement favorite toggle
        // 1. Check if job is already favorite
        // 2. Add or remove from favorites array
        // 3. Save to localStorage
        // 4. Update UI

        // Ensure jobId is a number for consistent comparison
        const numericId = typeof jobId === 'number' ? jobId : parseInt(jobId);

        // Validate the ID
        if (isNaN(numericId) || numericId === null || numericId === undefined) {
            console.error('Invalid job ID:', jobId);
            return;
        }

        const index = favoriteJobIds.indexOf(numericId);

        if (index > -1) {
            // Remove from favorites
            favoriteJobIds.splice(index, 1);
            console.log(`Removed job ${numericId} from favorites`);
        } else {
            // Add to favorites
            favoriteJobIds.push(numericId);
            console.log(`Added job ${numericId} to favorites`);
        }

        saveFavorites();
        renderFavoritesCount();

        const activeTab = document.querySelector('.tab-item--active');
        if (activeTab && activeTab.dataset.tab === 'favorites') {
            renderFavoriteJobs();
        } else {
            applyAllFilters();
        }
    };

    // ------------------------------------
    // --- TAB NAVIGATION ---
    // ------------------------------------

    /**
     * Sets up tab navigation functionality
     * @function setupTabs
     */
    const setupTabs = () => {
        // TODO: Implement tab switching logic

        if (!tabsNav) return;

        tabsNav.addEventListener('click', (e) => {
            const clickedTab = e.target.closest('.tab-item');
            if (!clickedTab) return;

            tabsNav.querySelectorAll('.tab-item').forEach(tab =>
                tab.classList.remove('tab-item--active')
            );

            clickedTab.classList.add('tab-item--active');
            const tabId = clickedTab.dataset.tab;

            tabContents.forEach(content => {
                content.classList.toggle('tab-content--active', content.id === `tab-${tabId}`);
            });

            if (tabId === 'favorites') renderFavoriteJobs();
            if (tabId === 'manage') renderManageList();
        });
    };

    // ------------------------------------
    // --- MODAL MANAGEMENT ---
    // ------------------------------------

    /**
     * Opens job details modal
     * @function openViewModal
     * @param {number} jobId - Job ID to display
     */
    const openViewModal = (jobId) => {
        // TODO: Implement modal opening logic

        const job = allJobs.find(j => j.id === jobId);
        if (!job) return;

        document.getElementById('modal-logo').src = job.logo || `https://api.dicebear.com/8.x/initials/svg?seed=${job.company}`;
        document.getElementById('modal-position').textContent = job.position;
        document.getElementById('modal-company').textContent = job.company;
        document.getElementById('modal-description').textContent = job.description;
        document.getElementById('modal-meta').innerHTML = `
            <li>${job.postedAt}</li>
            <li>${job.contract}</li>
            <li>${job.location}</li>
        `;

        const tags = [job.role, job.level, ...(job.skills || [])];
        document.getElementById('modal-tags').innerHTML = tags
            .map(tag => `<span class="job-card__tag">${tag}</span>`)
            .join('');

        viewModal.style.display = 'flex';
    };

    /**
     * Closes job details modal
     * @function closeViewModal
     */
    const closeViewModal = () => {
        viewModal.style.display = 'none';
    };

    /**
     * Opens job management modal (add/edit)
     * @function openManageModal
     * @param {number|null} jobId - Job ID to edit, null for new job
     */
    const openManageModal = (jobId = null) => {
        // TODO: Implement modal opening with pre-filled data for editing

        clearErrors(manageJobForm);

        if (jobId) {
            const job = allJobs.find(j => j.id === jobId);
            if (!job) return;

            manageModalTitle.textContent = "Modifier l'offre";

            jobIdInput.value = job.id;
            jobCompanyInput.value = job.company;
            jobPositionInput.value = job.position;
            jobLogoInput.value = job.logo || '';
            jobContractInput.value = job.contract;
            jobLocationInput.value = job.location;
            jobRoleInput.value = job.role;
            jobLevelInput.value = job.level;
            jobSkillsInput.value = (job.skills || []).join(', ');
            jobDescriptionInput.value = job.description;
        } else {
            manageModalTitle.textContent = 'Ajouter une offre';
            manageJobForm.reset();
            jobIdInput.value = '';
        }

        manageModal.style.display = 'flex';
    };

    /**
     * Closes job management modal
     * @function closeManageModal
     */
    const closeManageModal = () => {
        manageModal.style.display = 'none';
    };

    // ------------------------------------
    // --- JOB MANAGEMENT (CRUD) ---
    // ------------------------------------

    /**
     * Renders job management list
     * @function renderManageList
     */
    const renderManageList = () => {
        // TODO: Implement manage list rendering
        // Use this HTML template for each job:
        // `<li class="manage-job-item" data-job-id="${job.id}">
        //     <img src="${job.logo}" alt="" class="job-card__logo" style="position: static; width: 48px; height: 48px; border-radius: 5px;">
        //     <div class="manage-job-item__info">
        //         <h4>${job.position}</h4>
        //         <p>${job.company} - ${job.location}</p>
        //     </div>
        //     <div class="manage-job-item__actions">
        //         <button class="btn btn--secondary btn-edit">Modifier</button>
        //         <button class="btn btn--danger btn-delete">Supprimer</button>
        //     </div>
        //  </li>`

        if (allJobs.length === 0) {
            manageJobsList.innerHTML = '<li class="manage-job-item"><p>Aucune offre disponible.</p></li>';
            return;
        }

        manageJobsList.innerHTML = allJobs.map(job => `
            <li class="manage-job-item" data-job-id="${job.id}">
                <img src="${job.logo}" 
                     alt="" 
                     class="job-card__logo" 
                     style="position: static; width: 48px; height: 48px; border-radius: 5px;">
                <div class="manage-job-item__info">
                    <h4>${job.position}</h4>
                    <p>${job.company} - ${job.location}</p>
                </div>
                <div class="manage-job-item__actions">
                    <button class="btn btn--secondary btn-edit">Modifier</button>
                    <button class="btn btn--danger btn-delete">Supprimer</button>
                </div>
            </li>
        `).join('');
    };

    /**
     * Handles job form submission (add/edit)
     * @function handleManageFormSubmit
     * @param {Event} e - Form submit event
     */
    const handleManageFormSubmit = (e) => {
        // TODO: Implement job save logic
        // 1. Prevent default submission
        // 2. Validate form
        // 3. Create job data object
        // 4. Add new job or update existing
        // 5. Save to localStorage
        // 6. Update UI and close modal

        e.preventDefault();

        clearErrors(manageJobForm);

        if (!validateJobForm()) return;

        const isEditing = jobIdInput.value.trim() !== '';
        const jobId = isEditing ? parseInt(jobIdInput.value.trim()) : Date.now();

        const jobData = {
            id: jobId,
            company: jobCompanyInput.value.trim(),
            position: jobPositionInput.value.trim(),
            logo: jobLogoInput.value.trim(),
            contract: jobContractInput.value.trim(),
            location: jobLocationInput.value.trim(),
            role: jobRoleInput.value.trim(),
            level: jobLevelInput.value.trim(),
            skills: jobSkillsInput.value.split(',').map(s => s.trim()).filter(s => s),
            description: jobDescriptionInput.value.trim(),
            new: !isEditing,
            featured: false,
            postedAt: new Date().toLocaleDateString('fr-FR')
        };

        const jobIndex = allJobs.findIndex(job => job.id === jobId);

        if (jobIndex > -1) {
            allJobs[jobIndex] = jobData;
            alert('Offre modifiée avec succès !');
        } else {
            allJobs.unshift(jobData);
            alert('Offre ajoutée avec succès !');
        }

        saveAllJobs();
        closeManageModal();
        renderManageList();
        applyAllFilters();
    };

    /**
     * Handles manage list clicks (edit/delete)
     * @function handleManageListClick
     * @param {Event} e - Click event
     */
    const handleManageListClick = (e) => {
        // TODO: Implement edit/delete functionality
        // 1. Determine if edit or delete button clicked
        // 2. Get job ID
        // 3. For edit: open manage modal with job data
        // 4. For delete: confirm and remove job

        const deleteBtn = e.target.closest('.btn-delete');
        const editBtn = e.target.closest('.btn-edit');

        if (deleteBtn) {
            const jobItem = deleteBtn.closest('.manage-job-item');
            const jobId = parseInt(jobItem.dataset.jobId);

            if (confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
                // Remove job from array
                const jobIndex = allJobs.findIndex(job => job.id === jobId);
                if (jobIndex > -1) {
                    allJobs.splice(jobIndex, 1);
                    saveAllJobs(); // Save immediately to localStorage
                }

                // Remove from favorites if it exists
                const favoriteIndex = favoriteJobIds.indexOf(jobId);
                if (favoriteIndex > -1) {
                    favoriteJobIds.splice(favoriteIndex, 1);
                    saveFavorites(); // Save immediately to localStorage
                    renderFavoritesCount();
                }

                // Update all UI components
                renderManageList();
                applyAllFilters();

                const activeTab = document.querySelector('.tab-item--active');
                if (activeTab && activeTab.dataset.tab === 'favorites') {
                    renderFavoriteJobs();
                }

                console.log('Job deleted successfully and localStorage updated');
            }
        }

        if (editBtn) {
            const jobItem = editBtn.closest('.manage-job-item');
            const jobId = parseInt(jobItem.dataset.jobId);
            openManageModal(jobId);
        }
    };

    // ------------------------------------
    // --- JOB RENDERING ---
    // ------------------------------------

    /**
     * Creates HTML for a single job card
     * @function createJobCardHTML
     * @param {Object} job - Job object
     * @returns {string} HTML string for job card
     */
    const createJobCardHTML = (job) => {
        const { id, company, logo, new: isNew, featured, position, role, level, postedAt, contract, location, skills } = job;
        const tags = [role, level, ...(skills || [])];
        const tagsHTML = tags.map(tag => `<span class="job-card__tag" data-tag="${tag}">${tag}</span>`).join('');
        const newBadge = isNew ? '<span class="job-card__badge job-card__badge--new">NEW!</span>' : '';
        const featuredBadge = featured ? '<span class="job-card__badge job-card__badge--featured">FEATURED</span>' : '';
        const featuredClass = featured ? 'job-card--featured' : '';

        const isFavorite = favoriteJobIds.includes(id);
        const favoriteClass = isFavorite ? 'job-card__favorite-btn--active' : '';
        const favoriteIcon = isFavorite ? '★' : '☆';

        return `
            <article class="job-card ${featuredClass}" data-job-id="${id}" data-tags="${tags.join(',')}">
                <button class="job-card__favorite-btn ${favoriteClass}" data-job-id="${id}" aria-label="Add to favorites">
                    ${favoriteIcon}
                </button>
                <img src="${logo || `https://api.dicebear.com/8.x/initials/svg?seed=${company}`}" alt="${company} logo" class="job-card__logo">
                <div class="job-card__info">
                    <div class="job-card__company"><span>${company}</span>${newBadge}${featuredBadge}</div>
                    <h2 class="job-card__position">${position}</h2>
                    <ul class="job-card__meta"><li>${postedAt}</li><li>${contract}</li><li>${location}</li></ul>
                </div>
                <div class="job-card__tags">${tagsHTML}</div>
            </article>
        `;
    };

    /**
     * Renders filtered jobs to main container
     * @function renderJobs
     * @param {Array} jobsToRender - Array of job objects to display
     */
    const renderJobs = (jobsToRender) => {
        // TODO: Implement job rendering logic
        jobListingsContainer.innerHTML = jobsToRender.length > 0
            ? jobsToRender.map(createJobCardHTML).join('')
            : '<p class="job-listings__empty">Aucune offre ne correspond à votre recherche.</p>';
    };

    /**
     * Renders active filter tags
     * @function renderManualFilterTags
     */
    const renderManualFilterTags = () => {
        // TODO: Implement filter tags rendering
        // Use this HTML template for each tag:
        // `<div class="filter-bar__tag" data-tag="${tag}">
        //     <span class="filter-bar__tag-name">${tag}</span>
        //     <button class="filter-bar__tag-remove" aria-label="Remove filter ${tag}">✕</button>
        //  </div>`

        if (manualFilters.length === 0) {
            filterTagsContainer.innerHTML = '';
            if (filterBar) filterBar.style.display = 'none';
            return;
        }

        if (filterBar) filterBar.style.display = 'flex';
        filterTagsContainer.innerHTML = manualFilters.map(tag => `
            <div class="filter-bar__tag" data-tag="${tag}">
                <span class="filter-bar__tag-name">${tag}</span>
                <button class="filter-bar__tag-remove" aria-label="Remove filter ${tag}">✕</button>
            </div>
        `).join('');
    };

    /**
     * Updates statistics counter
     * @function renderStats
     * @param {number} matchCount - Number of matching jobs
     * @param {number} totalCount - Total number of jobs
     */
    const renderStats = (matchCount, totalCount) => {
        // TODO: Implement stats rendering

        const hasFilters = manualFilters.length > 0 || userProfile.skills.length > 0 || (searchInput && searchInput.value.trim());

        if (hasFilters) {
            statsCounter.innerHTML = `<p>${matchCount} offre${matchCount > 1 ? 's trouvées' : ' trouvée'} sur ${totalCount}</p>`;
        } else {
            statsCounter.innerHTML = `<p>${totalCount} offre${totalCount > 1 ? 's disponibles' : ' disponible'}</p>`;
        }
    };

    // ------------------------------------
    // --- FILTERING & SEARCH ---
    // ------------------------------------

    /**
     * Applies all active filters and updates display
     * @function applyAllFilters
     */
    const applyAllFilters = () => {
        // TODO: Implement comprehensive filtering
        // 1. Get search term
        // 2. Combine profile skills and manual filters
        // 3. Filter jobs by tags and search term
        // 4. Update all UI components

        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

        const allFilters = [...new Set([...userProfile.skills, ...manualFilters])];

        let filtered = allJobs.filter(job => {
            const jobTags = [job.role, job.level, ...(job.skills || [])];

            const matchesFilters = allFilters.length === 0 ||
                allFilters.every(filter => jobTags.some(tag => tag.toLowerCase() === filter.toLowerCase()));

            const matchesSearch = !searchTerm ||
                job.position.toLowerCase().includes(searchTerm) ||
                job.company.toLowerCase().includes(searchTerm) ||
                job.location.toLowerCase().includes(searchTerm) ||
                jobTags.some(tag => tag.toLowerCase().includes(searchTerm));

            return matchesFilters && matchesSearch;
        });

        renderJobs(filtered);
        renderManualFilterTags();
        renderStats(filtered.length, allJobs.length);
    };

    // ------------------------------------
    // --- EVENT HANDLERS ---
    // ------------------------------------

    /**
     * Handles clicks on job listings
     * @function handleJobListClick
     * @param {Event} e - Click event
     */
    const handleJobListClick = (e) => {
        // TODO: Implement job list click handling
        // 1. Handle tag clicks (add to filters)
        // 2. Handle favorite button clicks
        // 3. Handle card clicks (open modal)

        const favoriteBtn = e.target.closest('.job-card__favorite-btn');
        if (favoriteBtn) {
            e.stopPropagation();
            const jobId = parseInt(favoriteBtn.dataset.jobId);
            toggleFavorite(jobId);
            return;
        }

        const tag = e.target.closest('.job-card__tag');
        if (tag) {
            e.stopPropagation();
            const tagName = tag.dataset.tag;

            if (!manualFilters.includes(tagName)) {
                manualFilters.push(tagName);
                applyAllFilters();
            }
            return;
        }

        const card = e.target.closest('.job-card');
        if (card) {
            const jobId = parseInt(card.dataset.jobId);
            openViewModal(jobId);
        }
    };

    /**
     * Handles filter bar clicks
     * @function handleFilterBarClick
     * @param {Event} e - Click event
     */
    const handleFilterBarClick = (e) => {
        // TODO: Implement filter removal

        const removeBtn = e.target.closest('.filter-bar__tag-remove');
        if (removeBtn) {
            const tag = removeBtn.closest('.filter-bar__tag');
            const tagName = tag.dataset.tag;

            manualFilters = manualFilters.filter(f => f !== tagName);

            applyAllFilters();
        }
    };

    /**
     * Clears all manual filters
     * @function handleClearFilters
     */
    const handleClearFilters = () => {
        // TODO: Implement filter clearing
        // 1. Clear manual filters array
        // 2. Clear search input
        // 3. Apply filters

        manualFilters = [];
        if (searchInput) searchInput.value = '';
        applyAllFilters();
    };

    // ------------------------------------
    // --- INITIALIZATION ---
    // ------------------------------------

    /**
     * Initializes the application
     * @async
     * @function initializeApp
     */
    const initializeApp = async () => {
        // TODO: Implement app initialization
        // 1. Load saved data (profile, favorites)
        // 2. Load job data
        // 3. Render initial UI
        // 4. Set up event listeners
        // 5. Apply initial filters

        loadProfile();
        loadFavorites();

        await loadAllJobs();

        renderProfileForm();
        renderProfileSkills();
        renderFavoritesCount();
        setupTabs();
        applyAllFilters();

        // Event Listeners - Profile
        if (profileForm) profileForm.addEventListener('submit', handleProfileSave);
        if (skillInput) skillInput.addEventListener('keydown', handleSkillAdd);

        // Event Listeners - View Modal
        if (viewModalCloseBtn) viewModalCloseBtn.addEventListener('click', closeViewModal);
        if (viewModal) {
            viewModal.addEventListener('click', (e) => {
                if (e.target === viewModal) closeViewModal();
            });
        }

        // Event Listeners - Manage Modal
        if (manageModalCloseBtn) manageModalCloseBtn.addEventListener('click', closeManageModal);
        if (manageModal) {
            manageModal.addEventListener('click', (e) => {
                if (e.target === manageModal) closeManageModal();
            });
        }

        // Event Listeners - Job Management
        if (addNewJobBtn) addNewJobBtn.addEventListener('click', () => openManageModal());
        if (manageJobForm) manageJobForm.addEventListener('submit', handleManageFormSubmit);
        if (manageJobsList) manageJobsList.addEventListener('click', handleManageListClick);

        // Event Listeners - Search & Filter
        if (searchInput) searchInput.addEventListener('input', applyAllFilters);
        if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', handleClearFilters);
        if (filterTagsContainer) filterTagsContainer.addEventListener('click', handleFilterBarClick);

        // Event Listeners - Job Listings
        if (jobListingsContainer) jobListingsContainer.addEventListener('click', handleJobListClick);
        if (favoriteJobsContainer) favoriteJobsContainer.addEventListener('click', handleJobListClick);

        console.log('Application initialized successfully!');
    };

    initializeApp();
});