let allProducts = [];
let filteredProducts = [];
let selectedCategories =
  JSON.parse(localStorage.getItem("selectedCategories")) || [];
let selectedSortOrder = localStorage.getItem("selectedSortOrder") || "default";
const getProducts = async () => {
  try {
    const productsData = await new Promise((resolve, reject) => {
      const storedData = localStorage.getItem('products');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData && Array.isArray(parsedData)) {
            resolve(parsedData);
          } else {
            reject('No valid "results" array found in stored data');
          }
        } catch (error) {
          reject('Error parsing stored products data');
        }
      } else {
        reject('No products found in localStorage');
      }
    });
    allProducts = productsData;
    applyFiltersAndSorting();
    displayFilters(productsData);
  } catch (error) {
    console.error(error);
  }
};


const applyFiltersAndSorting = () => {
  filteredProducts = [...allProducts];

  // Apply category filter
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((prod) =>
      selectedCategories.includes(prod.categoryName)
    );
  }

  // Apply sorting
  if (selectedSortOrder === "price-asc") {
    filteredProducts.sort(
      (a, b) => parseFloat(a.price.value) - parseFloat(b.price.value)
    );
  } else if (selectedSortOrder === "price-desc") {
    filteredProducts.sort(
      (a, b) => parseFloat(b.price.value) - parseFloat(a.price.value)
    );
  }

  displayProducts(filteredProducts);
};

const displayProducts = (products) => {
  const productListing = document.getElementById("product-listing");
  productListing.innerHTML = products
    .map(
      (prod) => `
        <div class="product-card" onclick="window.location.href='../product/?id=${prod.id}'">
            <img src="/assets/images/one.jfif" alt="${prod.name}">
            <div class="product-info">
                <span>Category: ${prod.category} ${prod.colors ? `<span class="prod-card-color" style="background-color:${prod.colors[0]}"></span>${prod.colors.length > 1 ? `+${prod.colors.length}` : ""}` : ""}</span>
                <div class="card-text">
                    <h4>${prod.name}</h4>
                    <p>${prod.price}$</p>
                </div>
            </div>
        </div>
    `
    )
    .join("");
};
const displayFilters = (products) => {
  const categoryCounts = products.reduce((counts, prod) => {
    counts[prod.category] = (counts[prod.category] || 0) + 1;
    return counts;
  }, {});

  const categories = Object.keys(categoryCounts).map((category) => {
    return { name: category, count: categoryCounts[category] };
  });

  const categoriesFilter = document.querySelector(".filter-section.category");
  categoriesFilter.innerHTML = `
        <h3 class="filter-header" onclick="collapseFilter(event)">Category<span><i class="fa-solid fa-angle-right"></i></span></h3>
        <div class="filter-options">
            ${categories
      .map(
        (category) => `
                <label>
                    <input type="checkbox" value="${category.name
          }" onclick="filterByCategory(event)" ${selectedCategories.includes(category.name) ? "checked" : ""
          }/> ${category.name} (<span style="color:black;">${category.count
          }</span>)
                </label>
            `
      )
      .join("")}
        </div>
    `;

  document.getElementById("sort-select").value = selectedSortOrder;
};

const filterByCategory = (e) => {
  const category = e.target.value;
  if (e.target.checked) {
    selectedCategories.push(category);
  } else {
    selectedCategories = selectedCategories.filter((cat) => cat !== category);
  }
  localStorage.setItem(
    "selectedCategories",
    JSON.stringify(selectedCategories)
  );
  applyFiltersAndSorting();
};

const sortProducts = () => {
  const sortSelect = document.getElementById("sort-select");
  selectedSortOrder = sortSelect.value;
  localStorage.setItem("selectedSortOrder", selectedSortOrder);
  applyFiltersAndSorting();
};

const collapseFilter = (e) => {
  const content = e.target.nextElementSibling;
  const icon = e.target.querySelector("i");
  if (content.classList.contains("extend")) {
    icon.classList.replace("fa-angle-down", "fa-angle-right");
    content.classList.remove("extend");
    content.style.height = "0";
  } else {
    icon.classList.replace("fa-angle-right", "fa-angle-down");
    content.classList.add("extend");
    content.style.height = content.scrollHeight + "px";
  }
};

const showFilters = () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("active");
};

document.getElementById("sort-select").addEventListener("change", sortProducts);

document.addEventListener("DOMContentLoaded", getProducts);
