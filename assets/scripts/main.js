// User Check
function checkUserAndRedirect() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = '/login';
  }
}
// Logout
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = '/login';
}
checkUserAndRedirect()
// Cart Count
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartCount = document.getElementById("cart-count");
if (cart.length === 0) {
  cartCount.style.display = "none";
} else {
  cartCount.style.display = "flex";
  cartCount.innerText = cart.length;
}

// Toggle light/dark mode
const toggleTheme = document.getElementById("toggle-theme");
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const icon = document.body.classList.contains("dark-mode")
    ? "fa-regular fa-moon"
    : "fa-regular fa-sun";
  toggleTheme.innerHTML = `<i class="${icon}"></i>`;
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
});

// Load theme preference
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggleTheme.innerHTML = '<i class="fa-regular fa-moon"></i>';
} else {
  toggleTheme.innerHTML = '<i class="fa-regular fa-sun"></i>';
}

const showNav = () => {
  const burgerIcon = document.getElementById("burger-icon");
  const navList = document.getElementById("nav-list");
  navList.classList.toggle("active");
  burgerIcon.classList.toggle("active");
};
