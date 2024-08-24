let allProducts = [];
let filteredProducts = [];
let selectedCategories =
  JSON.parse(localStorage.getItem("selectedCategories")) || [];
let selectedSortOrder = localStorage.getItem("selectedSortOrder") || "default";

const urlParams = new URLSearchParams(window.location.search);
const pageNum = urlParams.get("page") || 0;
const ProductsType = urlParams.get("type");
const baseUrl =
  "https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list";
const url = `${baseUrl}?country=us&lang=en&currentpage=${pageNum}&pagesize=30${ProductsType ? `&productTypes=${ProductsType}` : ""
  }`;

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "042bb0e6d0msh99500dc4f7b05b0p1fe784jsnd729b3dfb35d",
    "x-rapidapi-host": "apidojo-hm-hennes-mauritz-v1.p.rapidapi.com",
  },
};

const getProducts = async () => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    allProducts = data.results;
    applyFiltersAndSorting();
    displayFilters(data.results);
    displayPagination(data.pagination);
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
        <div class="product-card" onclick="window.location.href='../product/?id=${prod.articles[0].code
        }'">
            <img src="${prod.images[0].url}" alt="${prod.name}">
            <div class="product-info">
                <span>Category: ${prod.categoryName} ${prod.rgbColors
          ? `<span class="prod-card-color" style="background-color:${prod.rgbColors[0]
          }"></span>${prod.rgbColors.length > 1 ? `+${prod.rgbColors.length}` : ""
          }`
          : ""
        }</span>
                <div class="card-text">
                    <h4>${prod.name}</h4>
                    <p>${prod.price.formattedValue}</p>
                </div>
            </div>
        </div>
    `
    )
    .join("");
};

const displayPagination = (pagination) => {
  const paginationContainer = document.querySelector(".pagination");
  let pageNumber = pagination.currentPage + 1;
  let lastPage = pagination.numberOfPages;
  paginationContainer.innerHTML = `
        <span onclick="changePage(${pagination.currentPage - 1}, '${ProductsType || ""
    }')" ${pageNumber === 1 ? "style='display:none'" : ""
    }><i class="fa-solid fa-angle-left"></i></span>
        <span>${pageNumber}</span>
        <span onclick="changePage(${pagination.currentPage + 1}, '${ProductsType || ""
    }')" ${pageNumber === lastPage ? "style='display:none'" : ""
    }><i class="fa-solid fa-angle-right"></i></span>
    `;
};

const changePage = (pageNumber, type) => {
  const url = new URL(window.location.href);
  url.searchParams.set("page", pageNumber);
  if (type) {
    url.searchParams.set("type", type);
  } else {
    url.searchParams.delete("type");
  }
  window.location.href = url.toString();
};

const displayFilters = (products) => {
  const categoryCounts = products.reduce((counts, prod) => {
    counts[prod.categoryName] = (counts[prod.categoryName] || 0) + 1;
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
