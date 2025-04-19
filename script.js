// Danh sách sản phẩm
const products = [
    { id: 1, name: "Bó hoa hồng đỏ", price: 300000, image: "images/hoa-hong.jpg" },
    { id: 2, name: "Bó hoa cúc trắng", price: 200000, image: "images/hoa-cuc.jpg" }
  ];
  
  // Hàm gửi qua Telegram (vào topic Shop Hoa)
  function sendToTelegram(name, phone, address, orderDetails, total) {
    fetch("/.netlify/functions/sendOrder", {
      method: "POST",
      body: JSON.stringify({ name, phone, address, orderDetails, total })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Đơn hàng đã được gửi vào topic Shop Hoa! Cảm ơn bạn.");
          localStorage.removeItem("cart");
          document.getElementById("order-form").style.display = "none";
          document.getElementById("orderForm").reset();
          displayCart();
        } else {
          alert("Lỗi khi gửi đơn hàng: " + data.message);
        }
      })
      .catch(error => {
        alert("Lỗi khi gửi đơn hàng: " + error);
      });
  }
  
  
  // Xem chi tiết sản phẩm
  function viewProduct(id) {
    const product = products.find(p => p.id === id);
    alert(`Tên: ${product.name}\nGiá: ${product.price} VNĐ\nMô tả: Hoa tươi đẹp, phù hợp mọi dịp.`);
    if (confirm("Thêm vào giỏ hàng?")) {
      addToCart(id);
    }
  }
  
  // Thêm vào giỏ hàng
  function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
  }
  
  // Hiển thị giỏ hàng
  function displayCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    
    cartItems.innerHTML = "";
    let total = 0;
    
    cart.forEach((item, index) => {
      total += item.price;
      cartItems.innerHTML += `
        <div class="cart-item">
          <span>${item.name} - ${item.price} VNĐ</span>
          <button onclick="removeFromCart(${index})">Xóa</button>
        </div>
      `;
    });
    
    cartTotal.textContent = `${total} VNĐ`;
  }
  
  // Xóa sản phẩm khỏi giỏ hàng
  function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  }
  
  // Hiện form đặt hàng
  function showOrderForm() {
    document.getElementById("order-form").style.display = "block";
  }
  
  // Xử lý gửi đơn hàng
  document.getElementById("orderForm")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }
    
    const orderDetails = cart.map(item => `${item.name} - ${item.price} VNĐ`).join("\n");
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Gửi qua Telegram (vào topic Shop Hoa)
    sendToTelegram(name, phone, address, orderDetails, total);
  });
  
  // Hiển thị giỏ hàng khi tải trang
  if (document.getElementById("cart-items")) {
    displayCart();
  }