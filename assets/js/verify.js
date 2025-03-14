document.addEventListener("DOMContentLoaded", function () {
    const verifyForm = document.querySelector(".login-form");
    const otpField = document.getElementById("otp");
    const verifyButton = document.querySelector(".login-button");
    const resendLink = document.querySelector(".signup-text a");

    const API_URL = "https://zuum-backend-qs8x.onrender.com/api/auth/verify-email";
    const email = localStorage.getItem("registrationEmail"); // Get saved email

    if (!email) {
        alert("No email found. Please resend the otp.");
        // window.location.href = "resendemailotp.html"; // Redirect if no email is found
        return;
    }

    // Verify OTP function
    verifyForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const otp = otpField.value.trim();

        if (!otp) {
            alert("Please enter the OTP.");
            return;
        }

        const requestData = {
            email,
            otp,
        };

        try {
            verifyButton.textContent = "Verifying...";
            verifyButton.disabled = true;

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();

            if (response.ok) {
                alert("OTP Verified! Redirecting to login...");
                localStorage.removeItem("registrationEmail"); // Clear saved email
                window.location.href = "login.html"; // Redirect to login
            } else {
                alert(response.error || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            verifyButton.textContent = "Verify Otp";
            verifyButton.disabled = false;
        }
    });

    // Resend OTP (Assuming there's an endpoint for resending OTP)
    resendLink.addEventListener("click", async function (e) {
        e.preventDefault();
        alert("Resending OTP..."); // Display a temporary alert
        // Here, you can implement a resend OTP API call if available
    });
});
