// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.querySelector(".login-form");
    const usernameField = document.getElementById("username");
    const emailField = document.getElementById("email");
    const phoneField = document.getElementById("number");
    const passwordField = document.querySelectorAll('input[type="password"]')[0];
    const confirmPasswordField = document.querySelectorAll('input[type="password"]')[1];
    const passwordToggles = document.querySelectorAll(".password-toggle");
    
    const API_URL = "https://zuum-backend-qs8x.onrender.com/api"
    const MAIN_URL = "http://localhost:5500"
    const identity = localStorage.getItem("identity") || "artist";

    // Password visibility toggle
    passwordToggles.forEach(toggle => {
        toggle.addEventListener("click", function (e) {
            e.preventDefault();
            const passwordInput = this.previousElementSibling;
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                this.querySelector("i").classList.replace("fa-eye", "fa-eye-slash");
            } else {
                passwordInput.type = "password";
                this.querySelector("i").classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    });

    // Form submission event
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = usernameField.value.trim();
        const email = emailField.value.trim();
        const phone = phoneField.value.trim();
        const password = passwordField.value.trim();
        const confirmPassword = confirmPasswordField.value.trim();

        // Validation checks
        if (!validateUsername(username)) {
            alert("Username must be at least 6 characters long.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            alert("Password must be at least 8 characters long and include letters and numbers.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Prepare request payload
        const requestData = {
            username,
            identity,
            email,
            password,
        };

        try {
            const response = await fetch(API_URL + "/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('registrationEmail', requestData.email);
                alert("Signup successful! Redirecting to verification page...");
                window.location.href = MAIN_URL + "/login.html";
            } else {
                alert(result.error || result.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    });

    // Validation functions
    function validateUsername(username) {
        return username.length > 5;
    }

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function validatePassword(password) {
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordPattern.test(password);
    }
});
