document.addEventListener("DOMContentLoaded", function () {
    const resendForm = document.querySelector(".login-form");
    const emailField = document.getElementById("resend-otp");
    const resendButton = document.querySelector(".login-button");

    const API_URL = "https://zuum-backend-qs8x.onrender.com/api/auth/resend-otp";
    const MAIN_URL = "http://localhost:5500"
    // Resend OTP function
    resendForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = emailField.value.trim();

        if (!email) {
            alert("Please enter your email.");
            return;
        }

        const requestData = {
            email
        };

        try {
            resendButton.textContent = "Resending...";
            resendButton.disabled = true;

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('registrationEmail', requestData.email);
                alert("OTP has been resent. Please check your email.");
                window.location.href = MAIN_URL+'/verifyemail.html';
            } else {
                alert(result.error || "Failed to resend OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            resendButton.textContent = "Verify Email Otp";
            resendButton.disabled = false;
        }
    });
});
