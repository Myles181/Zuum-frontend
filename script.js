// Toggle password visibility
document.getElementById('password-toggle').addEventListener('click', function() {
    const passwordField = document.getElementById('password-field');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
});

// Login button functionality
document.querySelector('.login-button').addEventListener('click', function() {
    const username = document.querySelector('input[type="text"]').value;
    const password = document.getElementById('password-field').value;
    
    if (username && password) {
        alert('Login Succesfully');
    } else {
        alert('Please enter both username and password');
    }
});

// Social login buttons
document.querySelectorAll('.social-button').forEach(button => {
    button.addEventListener('click', function() {
        const provider = this.querySelector('span').textContent;
        alert(`${provider} login would be initiated here in a real application`);
    });
});