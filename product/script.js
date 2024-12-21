const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const productDetails = document.getElementById("productDetails");

const displayData = async () => {
    try {
        const products = JSON.parse(localStorage.getItem('products'));
        const product = products.find(p => p.id === productId);

        if (!product) {
            productDetails.innerHTML = "<p>Product not found.</p>";
            return;
        }
        const finalPrice = product.price - (product.price * (product.discount / 100));
        productDetails.innerHTML = `
            <div class="product-images">
                <img
                    src="../assets/images/one.jfif"
                    class="product-big-image" alt="${product.name}"
                />
                <ul>
                    <li><img onclick="changeBigImage(event)" src="../assets/images/one.jfif" alt="Product Small Image" width="100" height="100" class="product-small-image active" /></li>
                    <li><img onclick="changeBigImage(event)" src="../assets/images/two.jfif" alt="Product Small Image" width="100" height="100" class="product-small-image" /></li>
                    <li><img onclick="changeBigImage(event)" src="../assets/images/three.jfif" alt="Product Small Image" width="100" height="100" class="product-small-image" /></li>
                </ul>
            </div>
            <div class="product-details">
                <h1>${product.name}</h1>
                <div class="price-container">
                    <div>
                        <span class="product-price" style="color:${!product.discount ? '#111' : ''}">${finalPrice}$</span>
                        ${product.discount ? `<span class="product-old-price">${product.price}$</span>` : ''}
                    </div>
                    ${product.discount ? `<span class="discount">${product.discount}%</span>` : ''}
                </div>
                <p class="product-sub-title">MRP incl. of all taxes</p>
                <p class="product-description">${product.description}</p>
                <h5>Color</h5>
                <div class="colors-container">
                    ${product.colors.map((color, index) => {
            return `<input type='radio' name='color' id='color-${index}' value='${color}' class="colors-radio" ${index === 0 ? 'checked' : ''}>
                                <label style="background-color:#${color}" for="color-${index}"></label>`;
        }).join('')}
                </div>
                <h5>Size</h5>
                <div class="sizes-container">
                    ${product.sizes.map((size, index) => {
            return `<input type='radio' name='size' id='${size}' value='${size}' class="sizes-radio" ${index === 0 ? 'checked' : ''}>
                                <label for="${size}">${size}</label>`;
        }).join('')}
                </div>
                <div class="">  
                    <a href="#" class="product-links">FIND YOUR SIZE</a> |
                    <a href="#" class="product-links">MEASUREMENT GUIDE</a>
                </div>
                <button class="product-add-btn" type="button" onclick="handleAddItem()">ADD</button>
            </div>
        `;
    } catch (error) {
        console.error("Error loading product details:", error);
        productDetails.innerHTML = "<p>Error loading product details.</p>";
    }
};
const changeBigImage = (e) => {
    document.querySelectorAll(".product-small-image").forEach((e) => {
        e.classList.remove("active");
    });
    e.target.classList.add("active");
    document.querySelector(".product-big-image").src = e.target.src;
};
let cartContent = JSON.parse(localStorage.getItem("cart")) || [];
const handleAddItem = () => {
    const products = JSON.parse(localStorage.getItem('products'));
    let productIdIndex;
    document.querySelectorAll('.colors-container input[type="radio"]').forEach((e, i) => {
        if (e.checked) {
            productIdIndex = i;
        }
    });
    const product = products.find(p => p.id === productId);
    if (!product) {
        return;
    }
    const finalPrice = product.price - (product.price * (product.discount / 100));
    const cartItem = cartContent.find((item) => item.id === product.id);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        const cartProduct = {
            id: product.id,
            name: product.name,
            category: product.category,
            price: finalPrice,
            image: document.querySelector(".product-big-image").src,
            color: document.querySelector('.colors-container input[type="radio"]:checked').value,
            size: document.querySelector('.sizes-container input[type="radio"]:checked').value,
            quantity: 1,
        };
        cartContent.push(cartProduct);
    }
    localStorage.setItem("cart", JSON.stringify(cartContent));
    document.getElementById('cart-count').style.display = 'flex';
    document.getElementById('cart-count').innerText = cartContent.length;
    const addBtn = document.querySelector('.product-add-btn');
    addBtn.innerText = 'Product Added +';
    addBtn.classList.add('added-btn');
    addBtn.disabled = true;
    setTimeout(() => {
        addBtn.innerText = 'ADD';
        addBtn.classList.remove('added-btn');
        addBtn.disabled = false;
    }, 3000);
};

displayData();
