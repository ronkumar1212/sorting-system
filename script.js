const API_URL = "https://script.google.com/macros/s/AKfycbxaQCyFV_NkjjS5JCWSqcI1c-zX3eKxaQJmAswyF2SQ7UbG7EyGGyd-ooQTy0KNbfxQ_w/exec"; // Replace with your Google Apps Script deployment URL

let itemsData = []; // To store all fetched items

// Fetch items and initialize dropdowns
async function fetchItems() {
  const response = await fetch(API_URL);
  itemsData = await response.json(); // Save fetched data
  populateDropdowns(itemsData);
}

// Populate the dropdown menus for Category and Location
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

// Display items based on selected Category or Location
function displayFilteredItems() {
  const selectedCategory = document.getElementById("category-dropdown").value;
  const selectedLocation = document.getElementById("location-dropdown").value;
  const resultsDiv = document.getElementById("results");

  // Filter items based on the dropdown selections
  const filteredItems = itemsData.filter((item) => {
    const matchCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchLocation = selectedLocation ? item.location === selectedLocation : true;
    return matchCategory && matchLocation;
  });

  // Display filtered items
  resultsDiv.innerHTML = ""; // Clear previous results
  if (filteredItems.length > 0) {
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
  } else {
    resultsDiv.innerHTML = `<p>No items found.</p>`;
  }
}

// Attach event listeners for dropdown changes
document.getElementById("category-dropdown").addEventListener("change", displayFilteredItems);
document.getElementById("location-dropdown").addEventListener("change", displayFilteredItems);

// Load items on page load
fetchItems();
