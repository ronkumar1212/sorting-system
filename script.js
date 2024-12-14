const API_URL = "https://script.google.com/macros/s/AKfycbxaQCyFV_NkjjS5JCWSqcI1c-zX3eKxaQJmAswyF2SQ7UbG7EyGGyd-ooQTy0KNbfxQ_w/exec"; // Replace with your Google Apps Script deployment URL

// Fetch and display items when the page loads
async function fetchItems() {
  const response = await fetch(API_URL);
  const items = await response.json();
  displayItems(items);
}

// Dynamically display items
function displayItems(items) {
  const categoriesDiv = document.getElementById("categories");
  categoriesDiv.innerHTML = ""; // Clear existing content

  items.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";
    itemDiv.innerHTML = `
      <strong>${item.name}</strong> (${item.category})
      <br>Location: ${item.location}
      <br>${item.notes ? `Notes: ${item.notes}` : ""}
    `;
    categoriesDiv.appendChild(itemDiv);
  });
}

// Real-time search functionality
function searchItems(event) {
  const query = event.target.value.toLowerCase(); // Get search query
  const items = document.querySelectorAll(".item"); // Select all displayed items

  items.forEach((item) => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? "block" : "none";
  });
}

// Show or hide the "Add New Item" form
function toggleAddItemForm() {
  const form = document.getElementById("add-item-form");
  form.classList.toggle("hidden"); // Toggle visibility
}

// Submit the "Add New Item" form
async function addItem() {
  const name = document.getElementById("item-name").value.trim();
  const category = document.getElementById("item-category").value.trim();
  const location = document.getElementById("item-location").value.trim();
  const notes = document.getElementById("item-notes").value.trim();

  if (!name || !category || !location) {
    alert("Please fill in all required fields (Name, Category, Location).");
    return;
  }

  // Submit the new item to Google Sheets backend
  const response = await fetch(`${API_URL}?name=${name}&category=${category}&location=${location}&notes=${notes}`, {
    method: "POST",
  });

  if (response.ok) {
    alert("Item added successfully!");
    fetchItems(); // Refresh the list
    toggleAddItemForm(); // Hide the form
  } else {
    alert("Error adding item. Please try again.");
  }
}

// Attach event listeners
document.getElementById("search-bar").addEventListener("input", searchItems); // Search functionality
document.getElementById("add-item-btn").addEventListener("click", toggleAddItemForm); // Toggle "Add New Item" form
document.getElementById("submit-item").addEventListener("click", addItem); // Submit new item

// Load items on page load
fetchItems();
