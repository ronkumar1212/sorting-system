const API_URL = "https://script.google.com/macros/s/AKfycbxaQCyFV_NkjjS5JCWSqcI1c-zX3eKxaQJmAswyF2SQ7UbG7EyGGyd-ooQTy0KNbfxQ_w/exec"; // Replace with your Google Apps Script deployment URL

let itemsData = []; // To store all fetched items

// Fetch items and initialize dropdowns
async function fetchItems() {
  try {
    const response = await fetch(API_URL);
    itemsData = await response.json(); // Save fetched data
    populateDropdowns(itemsData);
    displayFilteredItems(); // Ensure filtered items are displayed after dropdowns load
  } catch (error) {
    console.error("Error fetching items:", error);
  }
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

  // Filter items based on dropdown selections
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

  try {
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
  } catch (error) {
    console.error("Error adding item:", error);
  }
}

// Attach event listeners
document.getElementById("category-dropdown").addEventListener("change", displayFilteredItems); // Filter items on category change
document.getElementById("location-dropdown").addEventListener("change", displayFilteredItems); // Filter items on location change
document.getElementById("add-item-btn").addEventListener("click", toggleAddItemForm); // Toggle "Add New Item" form
document.getElementById("submit-item").addEventListener("click", addItem); // Submit new item

// Load items on page load
fetchItems();
