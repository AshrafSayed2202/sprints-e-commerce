document.getElementById('country-select').addEventListener('change', function () {
    if (this.value === '') {
        this.classList.add('default')
    } else {
        this.classList.remove('default')
    }
})

const toggleCheckoutForm = () => {
    const formToggleBtn = document.querySelector('.payment-btn.form-toggeler span');
    let inputs = document.querySelectorAll('.checkout-section input');
    inputs = Array.from(inputs);
    inputs = inputs.slice(0, 8); // Only validate the first 8 input fields
    inputs.push(document.querySelector('.checkout-section select')); // Add the country select field

    // Step 1: Validate Contact Info and Shipping Address
    if (formToggleBtn.innerText === 'Payment') {
        if (!validateContactAndShipping()) {
            return; // Stop form toggle if validation fails
        }
    }

    // Toggle the button text and form section visibility
    if (formToggleBtn.innerText === 'Payment') {
        formToggleBtn.innerText = 'Shipping';
    } else {
        formToggleBtn.innerText = 'Payment';
    }

    // Toggle the payment section visibility
    document.querySelector('.checkout-section').classList.toggle('payment-toggled');
};


let cartItems = JSON.parse(localStorage.getItem('cart'));

let total = document.getElementById('total');
let subTotal = document.getElementById('subtotal');
let shippingTax = document.getElementById('shippingTax');

const calculateSubTotal = (x = 0) => {
    let totalItem = 0;
    cartItems.map((item) => {
        totalItem += item.quantity * item.price;
    })
    return (totalItem + x).toFixed(2);
}
subTotal.innerHTML = "$ " + calculateSubTotal();
shippingAmount = cartItems.length > 0 ? 10 : 0;
shippingTax.innerHTML = "$ " + shippingAmount;
total.innerHTML = '$ ' + calculateSubTotal(cartItems.length > 0 ? 10 : 0);
document.querySelector('.your-order .order-count').innerHTML = `(${cartItems.length})`

document.getElementById('your-order-items').innerHTML = cartItems.map((item) => `
<div class="order-item">
    <img src="${item.image}" alt="order-image" class="order-image">
    <div class="order-details">
        <div>
            <div class="order-item-name">
                ${item.name}
                <br>
                <p><span class="order-item-color" style="background: #${item.color};"></span>/ ${item.size}</p>
            </div>
            <a href="../cart/">Change</a>
        </div>
            <div><span style="color: #000E8A;">(${item.quantity})</span><span>$${item.price}</span></div>
        </div>
</div>`).join('');
let currentStep = 1; // Track which step we are on

const validateContactAndShipping = () => {
    const shippingForm = document.querySelector('#shipping-form');
    let valid = true;

    // Reset error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());

    // Helper function to display error messages
    const showError = (element, message) => {
        valid = false;
        const errorMessage = document.createElement('span');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = message;
        element.parentNode.appendChild(errorMessage);
    };

    // 1. Validate Contact Info (Email and Phone)
    const email = shippingForm.querySelector('input[placeholder="Email"]');
    if (!email.value || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
        showError(email, 'Please enter a valid email address.');
    }

    const phone = shippingForm.querySelector('input[placeholder="Phone"]');
    if (!phone.value || !/^\d{11}$/.test(phone.value)) {
        showError(phone, 'Please enter a valid 11-digit phone number.');
    }

    // 2. Validate Shipping Address
    const firstName = shippingForm.querySelector('input[placeholder="First Name"]');
    if (!firstName.value) {
        showError(firstName, 'First name is required.');
    }

    const lastName = shippingForm.querySelector('input[placeholder="Last Name"]');
    if (!lastName.value) {
        showError(lastName, 'Last name is required.');
    }

    const country = document.querySelector('#country-select');
    if (!country.value) {
        showError(country, 'Please select a country.');
    }

    const state = shippingForm.querySelector('input[placeholder="State / Region"]');
    if (!state.value) {
        showError(state, 'State/Region is required.');
    }

    const address = shippingForm.querySelector('input[placeholder="Address"]');
    if (!address.value) {
        showError(address, 'Address is required.');
    }

    const city = shippingForm.querySelector('input[placeholder="City"]');
    if (!city.value) {
        showError(city, 'City is required.');
    }

    const postalCode = shippingForm.querySelector('input[placeholder="Postal Code"]');
    if (!postalCode.value || !/^\d{5}(-\d{4})?$/.test(postalCode.value)) {
        showError(postalCode, 'Please enter a valid postal code.');
    }

    return valid;
};

const validatePayment = () => {
    const paymentForm = document.querySelector('#payment-form');
    let valid = true;

    // Reset error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());

    // Helper function to display error messages
    const showError = (element, message) => {
        valid = false;
        const errorMessage = document.createElement('span');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = message;
        element.parentNode.appendChild(errorMessage);
    };

    // 1. Validate Payment Fields
    const cardName = paymentForm.querySelector('input[placeholder="Card Name "]');
    if (!cardName.value) {
        showError(cardName, 'Card name is required.');
    }

    const cardNumber = paymentForm.querySelector('input[placeholder="**** **** **** ****"]');
    if (!cardNumber.value || !/^\d{16}$/.test(cardNumber.value.replace(/\s/g, ''))) {
        showError(cardNumber, 'Please enter a valid 16-digit card number.');
    }

    const expiryDate = paymentForm.querySelector('input[placeholder="MM/YY"]');
    if (!expiryDate.value || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate.value)) {
        showError(expiryDate, 'Please enter a valid expiry date (MM/YY).');
    }

    const cvv = paymentForm.querySelector('input[placeholder="CVV"]');
    if (!cvv.value || !/^\d{3}$/.test(cvv.value)) {
        showError(cvv, 'Please enter a valid CVV.');
    }

    return valid;
};
const confirmOrder = (e) => {
    e.preventDefault();
    if (!validatePayment()) {
        return; // Stop the order confirmation if the form is invalid
    }
    const shippingForm = document.querySelector('#shipping-form');
    const paymentForm = document.querySelector('#payment-form');
    let inputs = document.querySelectorAll('.checkout-section input');
    inputs = Array.from(inputs);
    for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].value) {
            inputs[i].focus();
            return null;
        }
    }
    const shippingAddress = {
        firstName: shippingForm.querySelector('input[placeholder="First Name"]').value,
        lastName: shippingForm.querySelector('input[placeholder="Last Name"]').value,
        email: shippingForm.querySelector('input[placeholder="Email"]').value,
        phone: shippingForm.querySelector('input[placeholder="Phone"]').value,
        country: document.querySelector('#country-select').value,
        state: shippingForm.querySelector('input[placeholder="State / Region"]').value,
        address: shippingForm.querySelector('input[placeholder="Address"]').value,
        city: shippingForm.querySelector('input[placeholder="City"]').value,
        postalCode: shippingForm.querySelector('input[placeholder="Postal Code"]').value,
    };
    const paymentDetails = {
        cardName: paymentForm.querySelector('input[placeholder="Card Name "]').value,
        cardNumber: paymentForm.querySelector('input[placeholder="**** **** **** ****"]').value,
        expiryDate: paymentForm.querySelector('input[placeholder="MM/YY"]').value,
        cvv: paymentForm.querySelector('input[placeholder="CVV"]').value,
    };
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let shippingAmount = 10;
    const subtotal = calculateSubTotal();
    const totalCost = (parseFloat(subtotal) + shippingAmount).toFixed(2);
    const order = {
        cartItems: cartItems,
        shippingAddress: shippingAddress,
        paymentDetails: paymentDetails,
        subtotal: subtotal,
        shippingTax: shippingAmount,
        total: totalCost,
        orderDate: new Date().toISOString(),
    };
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('cart');
    document.querySelector('div.checkout-section').innerHTML = `<h1>Your order has been confirmed successfully. You will be redirected to the Home page...</h1>`;
    setTimeout(() => {
        window.location.href = '../';
    }, 5000);
};

