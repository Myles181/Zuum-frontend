//Loading Screen 
const loadingScreen = document.getElementById('loading-screen');
const pageContent = document.getElementById('page-content');

setTimeout(() => {
    loadingScreen.style.display = 'none';
    pageContent.style.display = 'block';
}, 5000); /* 5000ms = 5 seconds */

//Fade-in Animation 
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".fade-in");

    document.querySelectorAll(".option a").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default navigation
            let identity = this.textContent.trim(); // Get selected identity
            localStorage.setItem("identity", identity); // Store in localStorage
            console.log(identity);
            window.location.href = this.getAttribute("href");
        });
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.3 });

    elements.forEach(element => observer.observe(element));
});

// Automatically update the year
document.getElementById("year").textContent = new Date().getFullYear();
