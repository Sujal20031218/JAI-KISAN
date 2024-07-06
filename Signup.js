const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

document.addEventListener('DOMContentLoaded', function () {
    const signupButton = document.getElementById('signupButton');

    signupButton.addEventListener('click', function () {
        // Get user-entered data (e.g., name, email, password)
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // You can add validation here if needed

        // Redirect to "form.html" with user data as query parameters
        window.location.href = `FarmerReg.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    });
});