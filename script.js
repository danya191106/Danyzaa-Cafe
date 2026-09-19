// Danyzaa Café JavaScript


/* =========================
   PHASE 5
   SEARCH + CATEGORY FILTER
========================= */

const searchInput = document.getElementById("menuSearch");
const categoryButtons = document.querySelectorAll(".category-btn");
const menuItems = document.querySelectorAll(".menu-item");
const noResults = document.getElementById("noResults");

let selectedCategory = "All";


function filterMenu() {

    const searchText = searchInput.value.toLowerCase();

    let visibleItems = 0;

    menuItems.forEach(function(item) {

        const itemName =
            item.getAttribute("data-name").toLowerCase();

        const itemCategory =
            item.getAttribute("data-category");

        const categoryMatch =
            selectedCategory === "All" ||
            itemCategory === selectedCategory;

        const searchMatch =
            itemName.includes(searchText);

        if (categoryMatch && searchMatch) {

            item.classList.remove("d-none");

            visibleItems++;

        } else {

            item.classList.add("d-none");

        }

    });


    if (visibleItems === 0) {

        noResults.classList.remove("d-none");

    } else {

        noResults.classList.add("d-none");

    }
}


/* Category buttons */

categoryButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        categoryButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedCategory =
            button.getAttribute("data-category");

        filterMenu();

    });

});


/* Search */

searchInput.addEventListener("input", function() {

    filterMenu();

});


/* =========================
   PHASE 6
   CART SYSTEM
========================= */

let cart = [];

const cartCount =
    document.getElementById("cartCount");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const emptyCart =
    document.getElementById("emptyCart");

const cartSummary =
    document.getElementById("cartSummary");


/* Add to Cart */

const addButtons =
    document.querySelectorAll(".add-cart");


addButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const name =
            button.getAttribute("data-name");

        const price =
            Number(button.getAttribute("data-price"));

        const image =
            button.getAttribute("data-image");


        const existingItem =
            cart.find(function(item) {
                return item.name === name;
            });


        /* Add only if item is not already in cart */

        if (!existingItem) {

            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });

            /* Change button */

            button.textContent = "Go to Cart";
            
            const tootltip = bootstrap.Tooltip.getInstance(button);
            if (tootltip) {
                tootltip.setContent({ '.tooltip-inner': 'Item added to cart!' });
            }

            button.classList.remove("btn-dark");
            button.classList.add("btn-success");

            button.onclick = function(event) {

                event.preventDefault();

                document.getElementById("cart")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            };

        }


        updateCart();

    });

});


/* Update Cart */

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let itemCount = 0;


    cart.forEach(function(item, index) {

        total =
            total + item.price * item.quantity;

        itemCount =
            itemCount + item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item py-3";


        cartItem.innerHTML = `

            <div class="row align-items-center g-3">

                <div class="col-md-2 text-center">

                    <img src="${item.image}"
                         class="cart-image"
                         alt="${item.name}">

                </div>


                <div class="col-md-4">

                    <h6 class="fw-bold mb-1">
                        ${item.name}
                    </h6>

                    <small class="text-secondary">
                        ₹${item.price}
                    </small>

                </div>


                <div class="col-md-3">

                    <div class="d-flex align-items-center
                                justify-content-center gap-2">

                        <button class="btn btn-outline-dark btn-sm"
                                onclick="decreaseQuantity(${index})">
                            −
                        </button>

                        <span class="fw-bold">
                            ${item.quantity}
                        </span>

                        <button class="btn btn-outline-dark btn-sm"
                                onclick="increaseQuantity(${index})">
                            +
                        </button>

                    </div>

                </div>


                <div class="col-md-2 text-center">

                    <strong>
                        ₹${item.price * item.quantity}
                    </strong>

                </div>


                <div class="col-md-1 text-center">

                    <button class="btn btn-outline-danger btn-sm"
                            onclick="removeItem(${index})">
                        ×
                    </button>

                </div>

            </div>
        `;


        cartItems.appendChild(cartItem);

    });


    cartCount.textContent = itemCount;

    cartTotal.textContent = total;


    if (cart.length === 0) {

        emptyCart.classList.remove("d-none");
        cartItems.classList.add("d-none");
        cartSummary.classList.add("d-none");

    } else {

        emptyCart.classList.add("d-none");
        cartItems.classList.remove("d-none");
        cartSummary.classList.remove("d-none");

    }

}


/* Increase quantity */

function increaseQuantity(index) {

    cart[index].quantity++;

    updateCart();

}


/* Decrease quantity */

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    updateCart();

}


/* Remove item */

function removeItem(index) {

    const removedItem = cart[index];

    cart.splice(index, 1);

    const menuButton = document.querySelector(
        `.add-cart[data-name="${removedItem.name}"]`
    );

    if (menuButton) {
        menuButton.textContent = "Add to Cart";

        menuButton.classList.remove("btn-success");
        menuButton.classList.add("btn-dark");

        menuButton.onclick = null;

        const tooltip = bootstrap.Tooltip.getInstance(menuButton);

        if (tooltip) {
            tooltip.setContent({
                ".tooltip-inner": "Add this item to cart"
            });
        }
    }

    updateCart();
}


/* Checkout */

const checkoutBtn =
    document.getElementById("checkoutBtn");


checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }

    alert("Your order is ready! Please complete the reservation form.");

    document.getElementById("reservation")
        .scrollIntoView();

});


/* =========================
   PHASE 10
   RESERVATION FORM
========================= */

const reservationForm =
    document.getElementById("reservationForm");

const formMessage =
    document.getElementById("formMessage");


reservationForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const date =
        document.getElementById("date").value;

    const guests =
        document.getElementById("guests").value;


    if (
        name === "" ||
        email === "" ||
        date === "" ||
        guests === ""
    ) {

        formMessage.innerHTML = `
            <div class="alert alert-danger">
                Please fill in all required fields.
            </div>
        `;

        return;

    }


    formMessage.innerHTML = `
        <div class="alert alert-success">
            Reservation submitted successfully for
            ${name}.
        </div>
    `;


    reservationForm.reset();

});


/* =========================
   PHASE 8
   TOOLTIP + POPOVER
========================= */

const tooltipElements =
    document.querySelectorAll('[data-bs-toggle="tooltip"]');


tooltipElements.forEach(function(element) {

    new bootstrap.Tooltip(element);

});


/* Initial cart */

updateCart();

function goToReservation(event) {
    event.preventDefault();

    const modal = document.getElementById("offerModal");

    modal.addEventListener("hidden.bs.modal", function () {
        document.getElementById("reservation").scrollIntoView({
            behavior: "smooth"
        });
    }, { once: true });

    const modalInstance = bootstrap.Modal.getInstance(modal);

    if (modalInstance) {
        modalInstance.hide();
    }
}
