const apiBase = "http://localhost:5000/api";
const table = document.getElementById("dataTable");
const formContainer = document.getElementById("formContainer");
const collectionSelect = document.getElementById("collectionSelect");
let currentCollection = "users";
let selectedId = null;
let inputFields = {};
// Static credentials (hardcoded for this example)
const correctUsername = 'admin'; // Replace with your desired username
const correctPassword = 'password123'; // Replace with your desired password

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting and reloading the page

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    if (username === correctUsername && password === correctPassword) {
        // Hide login container and show dashboard
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } else {
        // Show error message
        errorMessage.textContent = 'Invalid username or password. Please try again.';
    }
});


document.getElementById('logoutBtn').addEventListener('click', function() {
    // Hide dashboard and show login container
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';

    // Reset the login form for a clean start
    document.getElementById('loginForm').reset(); // Clears input fields
    document.getElementById('errorMessage').textContent = ''; // Clears any error messages
});
document.getElementById("loadBtn").onclick = loadData;
document.getElementById("addBtn").onclick = addData;
document.getElementById("updateBtn").onclick = updateData;
document.getElementById("deleteBtn").onclick = deleteData;

const formStructure = {
    users: ["username", "email", "password", "role"],
    tours: ["title", "city", "address", "distance", "price", "maxGroupSize", "desc", "photo", "featured"],
    blogs: ["title", "content", "author", "date", "photo", "featured"],
    bookings: ["userId", "userEmail", "tourName", "fullName", "groupSize", "phone", "bookAt"],
    contacts: ["name", "email", "message"],
    review: ["username", "reviewText", "userId", "tourId", "rating", "comment"],

};

function renderForm(structure, record = {}) {
    formContainer.innerHTML = "";
    inputFields = {};
    structure.forEach(field => {
        const label = document.createElement("label");
        label.textContent = field;
        const input = document.createElement("input");
        input.value = record[field] || "";
        inputFields[field] = input;
        formContainer.appendChild(label);
        formContainer.appendChild(input);
        formContainer.appendChild(document.createElement("br"));
    });
}

async function loadData() {
    currentCollection = collectionSelect.value;
    renderForm(formStructure[currentCollection]); // blank form
    const res = await fetch(`${apiBase}/${currentCollection}`);
    const data = await res.json();
    renderTable(data);
}

function renderTable(data) {
    if (!data.length) {
        table.innerHTML = "<tr><td>No data found</td></tr>";
        return;
    }
    const headers = Object.keys(data[0]);
    table.innerHTML =
        "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>" +
        data.map(item =>
            `<tr onclick="selectRow('${item._id}')">` +
            headers.map(h => `<td>${item[h]}</td>`).join("") +
            "</tr>"
        ).join("");

    window.selectRow = (id) => {
        selectedId = id;
        const row = data.find(r => r._id === id);
        renderForm(formStructure[currentCollection], row);
    };
}

function collectData() {
    const obj = {};
    for (let key in inputFields) obj[key] = inputFields[key].value;
    return obj;
}

async function addData() {
    const obj = collectData();
    await fetch(`${apiBase}/${currentCollection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj)
    });
    loadData();
}

async function updateData() {
    if (!selectedId) return alert("Select a record first");
    const obj = collectData();
    await fetch(`${apiBase}/${currentCollection}/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj)
    });
    loadData();
}

async function deleteData() {
    if (!selectedId) return alert("Select a record first");
    await fetch(`${apiBase}/${currentCollection}/${selectedId}`, { method: "DELETE" });
    loadData();
}