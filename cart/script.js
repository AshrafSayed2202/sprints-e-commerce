let cartItems = JSON.parse(localStorage.getItem('cart'));
let originalCartItems = JSON.parse(localStorage.getItem('cart'));
const calculateSubTotal = (x = 0) => {
    let totalItem = 0;
    cartItems.map((item) => {
        totalItem += item.quantity * item.price;
    })
    return (totalItem + x).toFixed(2);
}
let total = document.getElementById('total');
let subTotal = document.getElementById('subtotal');
let cartContainer = document.getElementById('cart-container');
let shippingTax = document.getElementById('shippingTax');
let checkBoxItem = document.getElementById('checkBoxItem');

const draw = (cartItems) => {
    cartContainer.innerHTML = `${cartItems.map((item, i) => `
        <div class="shoppingCartItem">
                    <div class="product-info-cart">
                        <div class="product-img">
                            <img 
                                src="${item.image}"
                                alt="Full Sleeve Zipper "
                            />
                            <div class="favProduct">
                                <button>
                                    <i
                                        class="fa-regular fa-heart"
                                        style="transform: rotate(300deg)"
                                    ></i>
                                </button>
                            </div>
                        </div>
                        <div class="product-name">
                        <p>${item.category}</p>
                            <div class="test">
                                <h4>${item.name}</h4>
                                <span>$ ${item.price}</span>
                            </div>
                        </div>
                    </div>
                    <div class="product-options">
                        <button onclick ="deleteQuantityProd(${i})"><i class="fa-solid fa-xmark"></i></button>
                        <span name="size" id="size" class="custom-select"
                            >${item.size}</span
                        >
                        <p
                            class="prod-card-color prodColor"
                            style="background-color: #${item.color}"
                        ></p>
                        <div class="btn-group-increment">
                            <button type="button" class="btnLight" onclick ="increaseQuantityProd(${item.quantity}, ${i})">+</button>
                            <button type="button" class="btnLight">${item.quantity}</button>
                            <button type="button" class="btnLight" onclick ="decreaseQuantityProd(${item.quantity}, ${i})">-</button>
                        </div>
                        <button class="refreshIcon" onclick ="resetQuantityProd(${i})">
                            <i class="fa-solid fa-arrows-rotate"></i>
                        </button>
                    </div>
                </div>
    `).join('')}`
    subTotal.innerHTML = "$ " + calculateSubTotal();
    shippingAmount = cartItems.length > 0 ? 10 : 0;
    shippingTax.innerHTML = "$ " + shippingAmount;
    total.innerHTML = '$ ' + calculateSubTotal(cartItems.length > 0 ? 10 : 0);
    if (cartItems.length === 0) {
        cartContainer.innerHTML = `<h1>No items added yet.<a href="../products/"><br />Wants to add some?</a></h1>`
    }
}
if (cartItems.length) {
    draw(cartItems);
}
const increaseQuantityProd = (quantity, i) => {
    cartItems[i].quantity = quantity + 1;
    localStorage.setItem('cart', JSON.stringify(cartItems));
    draw(cartItems);
}
const decreaseQuantityProd = (quantity, i) => {
    if (cartItems[i].quantity != 1) {
        cartItems[i].quantity = quantity - 1;
    }
    else {
        cartItems.splice(i, 1);
        updateCartCount()
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
    draw(cartItems);

}
const deleteQuantityProd = (i) => {
    cartItems.splice(i, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
    draw(cartItems);

}
const updateCartCount = () => {
    const count = document.getElementById('cart-count')
    if (cartItems.length) {
        count.style.display = 'flex'
    } else {
        count.style.display = 'none'
    }
    count.innerHTML = cartItems.length
}
const resetQuantityProd = (i) => {
    cartItems[i].quantity = originalCartItems[i].quantity;
    localStorage.setItem('cart', JSON.stringify(cartItems));
    draw(cartItems);
}

checkBoxItem.addEventListener('click', () => {
    if (calculateSubTotal(cartItems.length > 0 ? 10 : 0) != 0) {
        if (checkBoxItem.value) {
            document.getElementById('continueButton').toggleAttribute('disabled');
            document.getElementById('continueButton').addEventListener('click', () => { window.location.href = '../checkout/' });
        }
    }
    else {
        document.getElementById('continueButton').toggleAttribute('disabled');
        document.getElementById('continueButton').removeEventListener('click', () => { window.location.href = '../checkout/' });
    }
});