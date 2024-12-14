const API_URL = "https://script.google.com/macros/s/AKfycbxaQCyFV_NkjjS5JCWSqcI1c-zX3eKxaQJmAswyF2SQ7UbG7EyGGyd-ooQTy0KNbfxQ_w/exec"; // Replace with your Apps Script URL

// Fetch and display items
async function fetchItems() {
    const response = await fetch(API_URL);
    const items = await response.json();
    displayItems(items);
}

// Display items in categories
function displayItems(items) {
    const categories = {};
    items.forEach(item => {
        if (!categories[item.category]) categories[item.category] = [];
        categories[item.category].push(item);
    });

    const categoriesDiv = document.getElementById("categories");
    categoriesDiv.innerHTML = "";
    for (const [category, items] of Object.entries(categories)) {
        const categoryDiv = document.createElement("div");
        categoryDiv.innerHTML = `<h3>${category}</h3>`;
        items.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.innerHTML = `${item.name} - ${item.location}`;
            categoryDiv.appendChild(itemDiv);
        });
        categoriesDiv.appendChild(categoryDiv);
    }
}

// Handle new item submission
async function addItem() {
    const name = document.getElementById("item-name").value;
    const category = document.getElementById("item-category").value;
    const location = document.getElementById("item-location").value;
    const notes = document.getElementById("item-notes").value;

    const response = await fetch(`${API_URL}?name=${name}&category=${category}&location=${location}&notes=${notes}`, {
        method: "POST"
    });

    if (response.ok) {
        alert("Item added!");
        fetchItems();
    } else {
        alert("Error adding item.");
    }
}

// Event listeners
document.getElementById("submit-item").addEventListener("click", addItem);

// Initial fetch
fetchItems();
