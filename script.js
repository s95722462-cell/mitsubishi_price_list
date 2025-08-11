document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsTableBody = document.getElementById('resultsTableBody');
    let allProducts = [];

    // Function to fetch product data
    async function fetchProducts() {
        try {
            const response = await fetch('price_data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProducts = await response.json();
            displayProducts(allProducts); // Display all products initially
        } catch (error) {
            console.error('Error fetching product data:', error);
            resultsTableBody.innerHTML = `<tr><td colspan="2" class="text-center text-danger">데이터를 불러오는 데 실패했습니다. (${error.message})</td></tr>`;
        }
    }

    // Function to display products in the table
    function displayProducts(products) {
        resultsTableBody.innerHTML = ''; // Clear previous results
        if (products.length === 0) {
            resultsTableBody.innerHTML = `<tr><td colspan="2" class="text-center">검색 결과가 없습니다.</td></tr>`;
            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');
            // Clean and convert price to number
            const priceValue = product['가격'] ? parseInt(product['가격'].replace(/,/g, ''), 10) : NaN;

            row.innerHTML = `
                <td data-label="규격">${product['규격'] || ''}</td>
                <td data-label="가격">${!isNaN(priceValue) ? priceValue.toLocaleString() + '원' : ''}</td>
            `;
            resultsTableBody.appendChild(row);
        });
    }

    // Function to handle search
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = allProducts.filter(product => {
            // Search only in the '규격' field
            const specMatch = product['규격'] && product['규격'].toLowerCase().includes(searchTerm);
            return specMatch;
        });
        displayProducts(filteredProducts);
    }

    // Event Listeners
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        } else {
            // Live search as user types
            handleSearch();
        }
    });

    // Initial fetch of products when the page loads
    fetchProducts();
});