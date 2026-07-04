const loginForm = document.getElementById('loginForm');
const rollNoInput = document.getElementById('rollNo');
const emailInput = document.getElementById('email');
const rollNoError = document.getElementById('rollNoError');
const emailError = document.getElementById('emailError');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    validateForm();
});

function validateForm() {
    let isValid = true;

    // Validate Roll No
    if (rollNoInput.value.trim() === '') {
        rollNoError.textContent = 'Roll No is required.';
        isValid = false;
    } else {
        rollNoError.textContent = '';
    }

    // Validate Email ID
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email ID is required.';
        isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
        emailError.textContent = 'Invalid email format.';
        isValid = false;
    } else {
        emailError.textContent = '';
    }

    if (isValid) {
        // Store email in local storage before redirecting
        localStorage.setItem('userEmail', emailInput.value.trim());
        // Redirect to the location check page after successful validation
        window.location.href = 'location_check.html';
    }
}

function isValidEmail(email) {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
