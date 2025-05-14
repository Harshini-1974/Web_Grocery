// Quantity buttons for updating product quantity in the cart
document.querySelectorAll('.quantity button').forEach(button => {
    button.addEventListener('click', () => {
        const quantity = button.parentElement.querySelector('span');
        let value = parseInt(quantity.textContent);
        if (button.textContent === '-') {
            value = value > 1 ? value - 1 : 1;
        } else {
            value += 1;
        }
        quantity.textContent = value;
    });
});

// Category filter and toggle dropdown for categories
const menuIcon = document.querySelector('.menu-icon');
const categoryDropdown = document.querySelector('.category-dropdown');
const mainCategoryLinks = document.querySelectorAll('.main-categories a');
const subCategoryLinks = document.querySelectorAll('.subcategories a');
const subCategories = document.querySelectorAll('.subcategories div');
const productItems = document.querySelectorAll('.product-item');

let currentCategory = 'all';

// Default state for category dropdown and product display
window.addEventListener('load', () => {
    productItems.forEach(item => item.classList.add('active'));
    categoryDropdown.style.display = 'none';
});

// Toggle category dropdown visibility
menuIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    categoryDropdown.style.display = categoryDropdown.style.display === 'grid' ? 'none' : 'grid';
});

// Main category click event to show subcategories and filter products
mainCategoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.getAttribute('data-category');

        subCategories.forEach(sub => sub.classList.remove('active'));
        const correspondingSub = document.querySelector(`.subcategories div[data-category="${category}"]`);
        if (correspondingSub) {
            correspondingSub.classList.add('active');
        }

        currentCategory = category;
        productItems.forEach(item => {
            item.classList.remove('active', 'category-view', 'search-result');
            const itemCategory = item.getAttribute('data-category');

            if (category === 'all') {
                item.classList.add('active');
                item.style.display = 'block';
            } else if (category === 'fruititems') {
                const fruitCategories = ['mango', 'grapes', 'orange', 'apple', 'jackfruit', 'pineapple'];
                item.style.display = fruitCategories.includes(itemCategory) ? 'block' : 'none';
                if (fruitCategories.includes(itemCategory)) item.classList.add('active', 'category-view');
            } else if (category === 'vegetableitems') {
                const vegCategories = ['ashgourd', 'broccoli', 'cucumber', 'potato', 'capsicum', 'clusterbeans', 'ginger', 'onion'];
                item.style.display = vegCategories.includes(itemCategory) ? 'block' : 'none';
                if (vegCategories.includes(itemCategory)) item.classList.add('active', 'category-view');
            } else if (category === 'dessertitems') {
                const dessertCategories = ['cakes', 'cupcakes', 'cookies', 'candies', 'custards'];
                item.style.display = dessertCategories.includes(itemCategory) ? 'block' : 'none';
                if (dessertCategories.includes(itemCategory)) item.classList.add('active', 'category-view');
            } else if (category === 'oilkitchenitems') {
                const kitchenCategories = ['bakeware', 'cookware', 'fryingpan', 'kadhaiwoks', 'instantpot'];
                item.style.display = kitchenCategories.includes(itemCategory) ? 'block' : 'none';
                if (kitchenCategories.includes(itemCategory)) item.classList.add('active', 'category-view');
            } else if (category === 'petfoodsitems') {
                const petCategories = ['pedigree', 'drools', 'royalcanin', 'purinasupercoat', 'meatup', 'hillsdiet'];
                item.style.display = petCategories.includes(itemCategory) ? 'block' : 'none';
                if (petCategories.includes(itemCategory)) item.classList.add('active', 'category-view');
            } else {
                item.style.display = 'none';
            }
        });

        categoryDropdown.style.display = 'none';
    });
});

// Subcategory filtering
subCategoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.getAttribute('data-category');

        currentCategory = category;
        productItems.forEach(item => {
            item.classList.remove('active', 'category-view', 'search-result');
            if (item.getAttribute('data-category') === category) {
                item.classList.add('active', 'category-view');
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        categoryDropdown.style.display = 'none';
    });
});

// Click outside to close category dropdown
document.addEventListener('click', (e) => {
    if (!menuIcon.contains(e.target) && !categoryDropdown.contains(e.target)) {
        categoryDropdown.style.display = 'none';
    }
});

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchBar = document.querySelector('.search-bar');

searchInput.addEventListener('click', () => {
    searchBar.classList.add('active');
    setTimeout(() => {
        searchBar.classList.remove('active');
    }, 1000);
});

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    productItems.forEach(item => {
        const productName = item.querySelector('h3').textContent.toLowerCase();

        // Check if the product name starts with the search term
        if (productName.startsWith(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Add to cart functionality with blink effect
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        // Get product details
        const product = button.closest('.product-item');
        const productName = product.querySelector('h3').textContent;
        const productPrice = product.querySelector('.price').textContent;

        // Create product object
        const productData = {
            name: productName,
            price: productPrice,
            quantity: 1
        };

        // Retrieve current cart from localStorage or create a new one
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.name === productData.name);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1; // Increase quantity if product exists
        } else {
            cart.push(productData); // Add new product to cart
        }

        // Save updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Blink effect to indicate product added to cart
        button.classList.add('blink');
        setTimeout(() => {
            button.classList.remove('blink');
        }, 1000);

        // Show alert or confirmation
        alert(`${productName} has been added to your cart!`);
    });
});

// Cart display page functionality (for showing products from cart in cart.html)
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Clear current cart display

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <h4>${item.name}</h4>
                <p>${item.price}</p>
                <div class="quantity">
                    <button class="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
            `;
            cartContainer.appendChild(cartItem);

            // Event listeners to update quantity
            cartItem.querySelector('.decrease').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart(); // Re-render cart after update
                }
            });

            cartItem.querySelector('.increase').addEventListener('click', () => {
                item.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart(); // Re-render cart after update
            });
        });
    }
}

// Call renderCart when the page is loaded
if (document.getElementById('cart-items')) {
    renderCart();
}
