// Send email using EmailJS
function sendMail(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get form and submit button
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const formStatus = document.getElementById('form-status');

    // Basic form validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        formStatus.innerHTML = '<p class="text-red-500">Please fill in all fields.</p>';
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        formStatus.innerHTML = '<p class="text-red-500">Please enter a valid email address.</p>';
        return;
    }

    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <span>Sending...</span>
    `;

    // Clear previous status messages
    formStatus.innerHTML = '';

    // Collect form data
    const params = {
        name: name,
        email: email,
        message: message,
    }

    // Send email using EmailJS
    emailjs.send("service_9010kbi", "template_5n7377d", params)
        .then(() => {
            formStatus.innerHTML = '<p class="text-green-500">Message sent successfully!</p>';
            form.reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            formStatus.innerHTML = '<p class="text-red-500">Failed to send message. Please try again.</p>';
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = `
                <i class="fas fa-paper-plane"></i>
                <span>Send Message</span>
            `;
        });
}

// Add event listener to form
document.getElementById('contact-form').addEventListener('submit', sendMail);
