const socket = io();

document.getElementById("formEntry").addEventListener("submit", (e) => {
  e.preventDefault();

  let titleEntry = document.getElementById("prodName");
  let title = titleEntry.value;
  let descriptionEntry = document.getElementById("prodDescription");
  let description = descriptionEntry.value;
  let codeEntry = document.getElementById("prodCode");
  let code = codeEntry.value;
  let priceEntry = document.getElementById("prodPrice");
  let price = parseInt(priceEntry.value);
  let statusEntry = document.getElementById("prodStatus");
  let status = statusEntry.value;
  let stockEntry = document.getElementById("prodStock");
  let stock = parseInt(stockEntry.value);
  let categoryEntry = document.getElementById("prodCategory");
  let category = categoryEntry.value;

  let newProduct = {
    title: title,
    description: description,
    code: code,
    price: price,
    status: status,
    stock: stock,
    category: category,
  };

  socket.emit("newProduct", newProduct);
});

socket.on("success", (data) => {
  Swal.fire({
    icon: "success",
    title: data,
    text: "Product added to list",
    confirmButtonText: "Aceptar",
  }).then(location.reload());
});

document.querySelectorAll(".btnDelete").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    let productIDEntry = e.target.parentElement.previousElementSibling;
    let productID = productIDEntry.textContent.trim();

    socket.emit("deleteProduct", productID);
    console.log("Producto para eliminar:", productID);
  });
});

socket.on("deletedProduct", (data) => {
  (location.reload(data));
});