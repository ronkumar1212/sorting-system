const API_URL = "https://script.google.com/macros/s/AKfycbzZSWREF5zSSP8TX04MBDxXQE-cMwld5KyyFyhU0QwsS0lWAqj-mHBql4fMHwQu6FNHzw/exec"; // Replace with your Google Apps Script deployment URL

let itemsData = []; // To store all fetched items

// Fetch items and populate dropdowns
async function fetchItems() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch data.");
    itemsData = await response.json();

    if (itemsData.error) throw new Error(itemsData.error);

    populateDropdowns(itemsData);
  } catch (error) {
    console.error("Error fetching items:", error);
    alert("Error fetching items. Please check the console for details.");
  }
}

// Populate dropdown menus
function populateDropdowns(items) {
  const categoryDropdown = document.getElementById("category-dropdown");
  const locationDropdown = document.getElementById("location-dropdown");

  // Extract unique categories and locations
  const categories = [...new Set(items.map((item) => item.category))];
  const locations = [...new Set(items.map((item) => item.location))];

  // Populate Category Dropdown
  categoryDropdown.innerHTML = `<option value="">Select Category</option>`;
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryDropdown.appendChild(option);
  });

  // Populate Location Dropdown
  locationDropdown.innerHTML = `<option value="">Select Location</option>`;
  locations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    locationDropdown.appendChild(option);
  });
}

// Display filtered items
function displayFilteredItems() {
  const selectedCategory = document.getElementById("category-dropdown").value;
  const selectedLocation = document.getElementById("location-dropdown").value;
  const resultsDiv = document.getElementById("results");

  // Filter items
  const filteredItems = itemsData.filter((item) => {
    const matchCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchLocation = selectedLocation ? item.location === selectedLocation : true;
    return matchCategory && matchLocation;
  });

  // Display items
  resultsDiv.innerHTML = ""; // Clear previous results
  filteredItems.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";
    itemDiv.innerHTML = `
      <strong>${item.name}</strong> (${item.category})
      <br>Location: ${item.location}
      <br>${item.notes ? `Notes: ${item.notes}` : ""}
    `;
    resultsDiv.appendChild(itemDiv);
  });
}

// Submit a new item
async function addItem() {
  const name = document.getElementById("item-name").value.trim();
  const category = document.getElementById("item-category").value.trim();
  const location = document.getElementById("item-location").value.trim();
  const notes = document.getElementById("item-notes").value.trim();

  if (!name || !category || !location) {
    alert("Please fill in all required fields (Name, Category, Location).");
    return;
  }

  try {
    const params = new URLSearchParams({ name, category, location, notes });
    const response = await fetch(`${API_URL}?${params.toString()}`, {
      method: "POST",
    });

    if (!response.ok) throw new Error("Failed to add item.");
    const result = await response.text();
    alert(result);

    fetchItems(); // Refresh items
  } catch (error) {
    console.error("Error adding item:", error);
    alert("Error adding item. Please check the console for details.");
  }
}

// Attach event listeners
document.getElementById("category-dropdown").addEventListener("change", displayFilteredItems);
document.getElementById("location-dropdown").addEventListener("change", displayFilteredItems);
document.getElementById("add-item-btn").addEventListener("click", () => {
  document.getElementById("add-item-form").classList.toggle("hidden");
});
document.getElementById("submit-item").addEventListener("click", addItem);

// Load items on page load
fetchItems();
