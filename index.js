const categoryButtons = document.querySelectorAll('.category-button');
const productsDiv = document.querySelector('.products');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');

let cart = [];

function renderProducts(products) {
  productsDiv.innerHTML = '';
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;
    productsDiv.appendChild(productDiv);
  });
}

function fetchProducts(category = '') {
  let url = 'https://fakestoreapi.com/products';
  if (category) {
    url += `/category/${category}`;
  }
  fetch(url)
    .then(response => response.json())
    .then(products => {
      renderProducts(products);
    });
}

function fetchProduct(id) {
  const url = `https://fakestoreapi.com/products/${id}`;
  return fetch(url)
    .then(response => response.json())
    .then(product => product);
}

function updateCart() {
  cartItems.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.title} x ${item.quantity}`;
    cartItems.appendChild(li);
  });
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  cartTotal.textContent = totalPrice.toFixed(2);
}

function addToCart(id) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    fetchProduct(id)
      .then(product => {
        const cartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1
        };
        cart.push(cartItem);
      });
  }
  updateCart();
}

function subtractFromCart(id) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    if (existingItem.quantity === 1) {
      cart = cart.filter(item => item.id !== id);
    } else {
      existingItem.quantity--;
    }
  }
  updateCart();
}

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    fetchProducts(category);
  });
});

productsDiv.addEventListener('click', event => {
  const button = event.target.closest('.add-to-cart');
  if (button) {
    const id = parseInt(button.dataset.id);
    addToCart(id);
  }
});

cartItems.addEventListener('click', event => {
  const button = event.target.closest('.subtract-from-cart');
  if (button) {
    const id = parseInt(button.dataset.id);
    subtractFromCart(id);
  }
   
})// Select the remove button and cart items list
const removeButton = document.querySelector('.remove-items');
const cartItemsList = document.querySelector('.cart-items');

// Add a click event listener to the remove button
removeButton.addEventListener('click', function() {
  // Get all the items in the cart
  const cartItems = cartItemsList.querySelectorAll('li');
  
  // Get the last item in the cart and remove it
  const lastCartItem = cartItems[cartItems.length - 1];
  lastCartItem.remove();
  
  // Update the total cost of the cart
  updateCartTotal();
});

// Define a function to update the total cost of the cart
function updateCartTotal() {
  // Select the cart total element
  const cartTotal = document.querySelector('.cart-total');
  
  // Get all the prices of the items in the cart
  const cartItemPrices = cartItemsList.querySelectorAll('.cart-item-price');
  const itemPrices = [];
  for (let i = 0; i < cartItemPrices.length; i++) {
    itemPrices.push(parseFloat(cartItemPrices[i].innerText.replace('$', '')));
  }
  
  // Calculate the total cost of the items in the cart and update the cart total element
  const total = itemPrices.reduce((acc, cur) => acc + cur, 0);
  cartTotal.innerText = total.toFixed(2);
}


fetchProducts();
