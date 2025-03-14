document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".login-form");
    const MAIN_URL = "http://localhost:5500"
  
    if (loginForm) {
      loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission
  
        // Get input values
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
  
        if (!email || !password) {
          alert("Please enter both email and password.");
          return;
        }
  
        // API Endpoint
        const loginUrl = "https://zuum-backend-qs8x.onrender.com/api/auth/login";
  
        try {
          const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
  
          const result = await response.json();
  
          if (response.ok) {
            alert("Login successful!");
  
            // Store token if necessary (modify according to API response structure)
            if (result.token) {
              localStorage.setItem("token", result.token);
            }
  
            // Redirect to dashboard or home page
            window.location.href = MAIN_URL + "/dashboard.html";
          } else {
            // console.log(response);
            if (response.status === 406) {
                alert(result.error);
                window.location.href = MAIN_URL + "/resendemailotp.html";
            }
            alert(result.error || "Login failed. Please try again.");
          }
        } catch (error) {
          console.error("Error logging in:", error);
          alert("Something went wrong. Please try again later.");
        }
      });
    } else {
      console.error("Login form not found");
    }
  });
  