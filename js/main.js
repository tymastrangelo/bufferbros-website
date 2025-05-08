// Mobile Menu Toggle with Animation
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
  if (mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
      mobileMenu.classList.remove('opacity-0', 'scale-y-95');
      mobileMenu.classList.add('opacity-100', 'scale-y-100');
    }, 10);
  } else {
    mobileMenu.classList.add('opacity-0', 'scale-y-95');
    mobileMenu.classList.remove('opacity-100', 'scale-y-100');
    setTimeout(() => {
      mobileMenu.classList.add('hidden');
    }, 300);
  }
});

// Gallery Filters
const filterButtons = document.querySelectorAll('.gallery-filter');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');

    // Remove active styles from all buttons
    filterButtons.forEach(btn => {
      btn.classList.remove('bg-blue-600', 'text-white');
      btn.classList.add('bg-gray-200', 'hover:bg-gray-300');
    });

    // Add active styles to the clicked button
    button.classList.remove('bg-gray-200', 'hover:bg-gray-300');
    button.classList.add('bg-blue-600', 'text-white');

    // Show/hide gallery items
    galleryItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      if (filter === 'all' || itemCategory === filter) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// FAQ Toggles
document.querySelectorAll('.faq-toggle').forEach(button => {
  button.addEventListener('click', function() {
    const content = this.nextElementSibling;
    const icon = this.querySelector('i');

    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
  });
});

// Form Submission Fake Handler (Quote Form)
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  quoteForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Hide form
    this.style.display = 'none';

    // Show success message
    document.getElementById('successMessage').classList.remove('hidden');

    // Reset form after 5 seconds (demo purposes)
    setTimeout(() => {
      this.style.display = 'block';
      document.getElementById('successMessage').classList.add('hidden');
      this.reset();
    }, 5000);
  });
}