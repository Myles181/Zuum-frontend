document.addEventListener('DOMContentLoaded', function() {
    // Get the main option that will be clicked to show the dropdown
    const mainOption = document.querySelector('.privacy');
    
    // Create a container for the dropdown options
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown-options';
    dropdownContainer.style.display = 'none';
    
    // Move the "Only me" and "Friends only" options to the dropdown container
    const allOptions = document.querySelectorAll('privacy');
    for (let i = 1; i < allOptions.length; i++) {
        dropdownContainer.appendChild(allOptions[i]);
    }
    
    // Insert the dropdown container after the main option
    mainOption.parentNode.insertBefore(dropdownContainer, mainOption.nextSibling);
    
    // Add click event to the main option to toggle dropdown
    mainOption.addEventListener('click', function() {
        const isVisible = dropdownContainer.style.display === 'block';
        dropdownContainer.style.display = isVisible ? 'none' : 'block';
        
        // Rotate the arrow icon when dropdown is open
        const arrow = mainOption.querySelector('.fa-angle-right');
        arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
    });
    
    // Add click events to the dropdown options
    const dropdownOptions = dropdownContainer.querySelectorAll('privacy');
    dropdownOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Get the selected option content
            const icon = option.querySelector('.option-left span:first-child').innerHTML;
            const text = option.querySelector('.option-left span:last-child').textContent;
            
            // Update the main option with the selected option's content
            mainOption.querySelector('.option-left span:first-child').innerHTML = icon;
            mainOption.querySelector('.option-left span:last-child').textContent = text;
            
            // Hide dropdown after selection
            dropdownContainer.style.display = 'none';
            mainOption.querySelector('.fa-angle-right').style.transform = 'rotate(0deg)';
            
            // Optional: Save the user's selection
            saveUserPreference(text);
        });
    });
    
    // Function to save the user's preference (you can implement according to your needs)
    function saveUserPreference(preference) {
        console.log('User selected:', preference);
        // Implement your saving logic here (e.g., API call, localStorage, etc.)
    }
});