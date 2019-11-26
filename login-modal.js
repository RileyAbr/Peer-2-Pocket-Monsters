// VARIABLES
let loginModal = document.getElementById("login-menu");
let loginSubmitButton = document.getElementById("login-menu-submit");

// FUNCTIONS
removeModal = function () {
    loginModal.style.display = "none";
}

// MAIN
window.onclick = function (event) {
    if (event.target == loginModal) {
        loginModal.style.opacity = 0;
        setTimeout(removeModal, 2000); //Wait two seconds before removing modal for animation to finish
    }
}

loginSubmitButton.onclick = function () {
    loginModal.style.opacity = 0;
    setTimeout(removeModal, 2000); //Wait two seconds before removing modal for animation to finish
}

