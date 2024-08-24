const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const productDetails = document.getElementById("productDetails");

const url = `https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/detail?lang=en&country=us&productcode=${productId}`;
const options = {
    method: "GET",
    headers: {
        "x-rapidapi-key": "042bb0e6d0msh99500dc4f7b05b0p1fe784jsnd729b3dfb35d",
        "x-rapidapi-host": "apidojo-hm-hennes-mauritz-v1.p.rapidapi.com",
    },
};
let globData;
const displayData = async () => {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        globData = data
        const product = data.product.articlesList[0];
        if (!product) {
            productDetails.innerHTML = "<p>Product not found.</p>";
            return;
        }
        const price = product.redPrice ? product.redPrice.price : product.whitePrice.price;
        const oldPrice = product.whitePrice ? product.whitePrice.price : null;
        productDetails.innerHTML = `
                                <div class="product-images">
                                    <img
                                        src="${product.fabricSwatchThumbnails[0].baseUrl}"
                                        class="product-big-image" alt="${product.name}"
                                    />
                                    <ul>
                                    ${product.galleryDetails
                .map((e, index) => {
                    if (index > 4) {
                        return;
                    }
                    if (index === 0) {
                        return `<li><img onclick="changeBigImage(event)" src="${e.baseUrl}" alt="Product Small Image" width="100" height="100" class="product-small-image active"/></li>`;
                    } else {
                        return `<li><img onclick="changeBigImage(event)" src="${e.baseUrl}" alt="Product Small Image" width="100" height="100" class="product-small-image" /></li>`;
                    }
                }).join("")}
                                    </ul>
                                </div>
                                <div class="product-details">
                                    <h1>${product.name}</h1>
                                    <div class="price-container">
                                        <div>
                                            <span class="product-price" style="color:${!product.redPrice ? '#111' : ''}">${price}$</span>
                                            ${product.redPrice ? `<span class="product-old-price">${oldPrice}$</span>` : ''}
                                        </div>
                                        ${product.percentageDiscount ? `<span class="discount">${product.percentageDiscount}</span>` : ''}
                                    </div>
                                    <p class="product-sub-title">MRP incl. of all taxes</p>
                                    <p class="product-description">${product.description}</p>
                                    <h5>Color</h5>
                                    <div class="colors-container">
                                        ${data.product.articlesList.map((e, index) => { if (index > 6) { return } return `<input onchange="changeColorHandle(${index})" type='radio' name='color' id='color-${index}' value='${e.color.rgbColor}' class="colors-radio" ${index === 0 ? 'checked' : ''}><label style="background-color:${e.color.rgbColor}" for="color-${index}"></label>` }).join('')}
                                    </div>
                                    <h5>Size</h5>
                                    <div class="sizes-container">
                                        ${product.variantsList.map((e, index) => { return `<input type='radio' name='size' id='${e.size.name}' value='${e.size.name}' class="sizes-radio" ${index === 0 ? 'checked' : ''}><label for="${e.size.name}">${e.size.name}</label>` }).join('')}
                                    </div>
                                    <div class="">  
                                        <a href="#" class="product-links">FIND YOUR SIZE</a> |
                                        <a href="#" class="product-links">MEASUREMENT GUIDE</a>
                                    </div>
                                    <button class="product-add-btn" type="button" onclick="handleAddItem()">ADD</button>
                                </div>
                        `;
    } catch (error) {
        console.error("Error fetching product data:", error);
        productDetails.innerHTML = "<p>Error loading product details.</p>";
    }
};
const changeColorHandle = (index) => {
    const galary = globData.product.articlesList[index].galleryDetails
    document.querySelectorAll(".product-small-image").forEach((e, i) => {
        if (i > galary.length - 1) {
            e.style.display = 'none'
        } else {
            e.style.display = 'block'
            e.src = galary[i].baseUrl
        }
    });
    document.querySelector(".product-big-image").src = galary[0].baseUrl;
}
const changeBigImage = (e) => {
    document.querySelectorAll(".product-small-image").forEach((e) => {
        e.classList.remove("active");
    });
    e.target.classList.add("active");
    document.querySelector(".product-big-image").src = e.target.src;
};

let cartContent = JSON.parse(localStorage.getItem("cart")) || [];
const handleAddItem = () => {
    let productIdIndex;
    document.querySelectorAll('.colors-container input[type="radio"]').forEach((e, i) => {
        if (e.checked) {
            productIdIndex = i;
        }
    })
    const cartItem = cartContent.find((item) => item.id === globData.product.articlesList[productIdIndex].code);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        const product = {
            id: globData.product.articlesList[productIdIndex].code,
            name: globData.product.name,
            category: globData.product.mainCategory.name,
            price: globData.product.redPrice ? globData.product.redPrice.price : globData.product.whitePrice.price,
            image: document.querySelector(".product-big-image").src,
            color: document.querySelector('.colors-container input[type="radio"]:checked').value,
            size: document.querySelector('.sizes-container input[type="radio"]:checked').value,
            quantity: 1,
        };
        cartContent.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(cartContent));
    document.getElementById('cart-count').style.display = 'flex';
    document.getElementById('cart-count').innerText = cartContent.length;
    const addBtn = document.querySelector('.product-add-btn');
    addBtn.innerText = 'Product Added +'
    addBtn.classList.add('added-btn')
    addBtn.disabled = true
    setTimeout(() => {
        addBtn.innerText = 'ADD'
        addBtn.classList.remove('added-btn')
        addBtn.disabled = false
    }, 3000);
}
displayData();
