// Portfolio interaction functionality

// Portfolio data with detailed information
const portfolioData = {
    'Project One': {
        image: 'images/project1.jpg',
        imageAlt: 'Screenshot of Project 1',
        title: 'Project One',
        description: 'A responsive web application built with modern technologies.',
        detailedDescription: 'This project showcases a fully responsive web application that adapts seamlessly to different screen sizes. Built using HTML5, CSS3, and JavaScript, it features smooth animations, intuitive navigation, and optimized performance. The application demonstrates best practices in web development including semantic HTML, accessibility features, and clean code architecture.'
    },
    'Project Two': {
        image: 'images/project2.jpg',
        imageAlt: 'Screenshot of Project 2',
        title: 'Project Two',
        description: 'An interactive website featuring smooth animations and user-friendly design.',
        detailedDescription: 'An engaging interactive website that combines beautiful design with functional user experience. Features include scroll-triggered animations, dynamic content loading, and responsive layouts. The project emphasizes user engagement through thoughtful interactions and visual feedback, creating an immersive browsing experience.'
    },
    'Project Three': {
        image: 'images/project3.jpg',
        imageAlt: 'Screenshot of Project 3',
        title: 'Project Three',
        description: 'A portfolio website showcasing creative work and design skills.',
        detailedDescription: 'A comprehensive portfolio website designed to showcase creative work and professional achievements. The site features a clean, modern design with emphasis on visual presentation. Includes project galleries, detailed case studies, and contact integration. Built with performance and accessibility in mind, ensuring fast load times and compatibility across all devices.'
    }
};

// Get modal elements
const modal = document.getElementById('portfolio-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalDetails = document.getElementById('modal-details');
const modalClose = document.querySelector('.modal-close');

// Get all portfolio items
const portfolioItems = document.querySelectorAll('.portfolio-item');

// Function to open portfolio modal
function openPortfolioModal(item) {
    // Get the project title from the item
    const projectTitle = item.querySelector('.portfolio-title').textContent;
    
    // Get project data
    const projectData = portfolioData[projectTitle];
    
    if (projectData) {
        // Populate modal with project data
        modalImage.src = projectData.image;
        modalImage.alt = projectData.imageAlt;
        modalTitle.textContent = projectData.title;
        modalDescription.textContent = projectData.description;
        modalDetails.textContent = projectData.detailedDescription;
        
        // Show modal
        modal.classList.add('active');
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Focus on close button for keyboard accessibility
        modalClose.focus();
    }
}

// Add click event listeners to portfolio items
portfolioItems.forEach(item => {
    item.addEventListener('click', function(e) {
        // Prevent default link behavior
        e.preventDefault();
        openPortfolioModal(this);
    });
    
    // Add keyboard event listener for Enter and Space keys
    item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPortfolioModal(this);
        }
    });
});

// Close modal when close button is clicked
modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Function to close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Return focus to the last focused portfolio item
    const focusedItem = document.querySelector('.portfolio-item:focus');
    if (focusedItem) {
        focusedItem.focus();
    }
}
