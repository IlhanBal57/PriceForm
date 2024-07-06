document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addButton');
    const productModal = document.getElementById('productModal');
    const productForm = document.getElementById('productForm');
    const dropdown1 = document.getElementById('dropdown1');
    const dropdown2 = document.getElementById('dropdown2');
    const dropdown3 = document.getElementById('dropdown3');
    const quantity = document.getElementById('quantity');
    const submitButton = document.getElementById('submitButton');
    const productTable = document.getElementById('productTable');
    const tableBody = document.getElementById('tableBody');
    const totalPriceElement = document.getElementById('totalPrice');
    const label1 = document.getElementById('label1');
    const label2 = document.getElementById('label2');
    const label3 = document.getElementById('label3');
    const quantityLabel = document.getElementById('quantityLabel');

    const dropdownData = {
        A: { 1: ["A1a", "A1b", "A1c"], 2: ["A2a", "A2b", "A2c"], 3: ["A3a", "A3b", "A3c"] },
        B: { 1: ["B1a", "B1b", "B1c"], 2: ["B2a", "B2b", "B2c"], 3: ["B3a", "B3b", "B3c"] },
        C: { 1: ["C1a", "C1b", "C1c"], 2: ["C2a", "C2b", "C2c"], 3: ["C3a", "C3b", "C3c"] }
    };

    const unitPrices = {
        A1a: 10, A1b: 15, A1c: 20, A2a: 12, A2b: 18, A2c: 22, A3a: 14, A3b: 19, A3c: 24,
        B1a: 11, B1b: 16, B1c: 21, B2a: 13, B2b: 17, B2c: 23, B3a: 15, B3b: 20, B3c: 25,
        C1a: 9, C1b: 14, C1c: 19, C2a: 11, C2b: 16, C2c: 21, C3a: 13, C3b: 18, C3c: 23
    };

    let currentEditRow = null;

    addButton.addEventListener('click', () => {
        productModal.style.display = 'block';
        productForm.style.display = 'block';
        dropdown1.style.display = 'block';
        label1.style.display = 'block';
    });

    dropdown1.addEventListener('change', () => {
        const selectedValue = dropdown1.value;
        const secondDropdownOptions = Object.keys(dropdownData[selectedValue]);
        populateDropdown(dropdown2, secondDropdownOptions.map(option => selectedValue + option));
        toggleElementDisplay(dropdown2, dropdown1.value);
        toggleElementDisplay(label2, dropdown1.value);
        toggleElementDisplay(dropdown3, false);
        toggleElementDisplay(label3, false);
        toggleElementDisplay(quantity, false);
        toggleElementDisplay(quantityLabel, false);
        toggleElementDisplay(submitButton, false);
    });

    dropdown2.addEventListener('change', () => {
        const selectedValue = dropdown2.value.substring(1); 
        const selectedCategory = dropdown1.value;
        populateDropdown(dropdown3, dropdownData[selectedCategory][selectedValue]);
        toggleElementDisplay(dropdown3, dropdown2.value);
        toggleElementDisplay(label3, dropdown2.value);
        toggleElementDisplay(quantity, false);
        toggleElementDisplay(quantityLabel, false);
        toggleElementDisplay(submitButton, false);
    });

    dropdown3.addEventListener('change', () => {
        toggleElementDisplay(quantity, dropdown3.value);
        toggleElementDisplay(quantityLabel, dropdown3.value);
        toggleElementDisplay(submitButton, dropdown3.value);
    });

    submitButton.addEventListener('click', () => {
        const dropdown1Value = dropdown1.value;
        const dropdown2Value = dropdown2.value;
        const dropdown3Value = dropdown3.value;
        const quantityValue = quantity.value;

        if (dropdown1Value && dropdown2Value && dropdown3Value && quantityValue) {
            const code = dropdown3Value;
            const description = 'Ürün-' + code;
            const unitPrice = unitPrices[code]; 
            const totalPrice = unitPrice * quantityValue;

            if (currentEditRow) {
                currentEditRow.cells[1].textContent = code;
                currentEditRow.cells[2].textContent = description;
                currentEditRow.cells[3].textContent = quantityValue + ' adet';
                currentEditRow.cells[4].textContent = unitPrice + ' TL';
                currentEditRow.cells[5].textContent = totalPrice + ' TL';
                currentEditRow = null;
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${tableBody.rows.length + 1}</td>
                    <td>${code}</td>
                    <td>${description}</td>
                    <td>${quantityValue} adet</td>
                    <td>${unitPrice} TL</td>
                    <td>${totalPrice} TL</td>
                    <td><button class="editButton">Düzenle</button></td>
                `;
                tableBody.appendChild(row);
            }

            updateTotalPrice();

            productTable.style.display = 'table';
            resetForm();
            productModal.style.display = 'none';

            document.querySelectorAll('.editButton').forEach(button => {
                button.addEventListener('click', handleEditButtonClick);
            });
        } else {
            alert('Lütfen tüm alanları doldurun');
        }
    });

    function populateDropdown(dropdown, options) {
        dropdown.innerHTML = '<option value="">Seçiniz</option>';
        for (const option of options) {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            dropdown.appendChild(opt);
        }
    }

    function resetForm() {
        productForm.style.display = 'none';
        dropdown1.value = '';
        dropdown2.value = '';
        dropdown3.value = '';
        dropdown2.style.display = 'none';
        dropdown3.style.display = 'none';
        quantity.style.display = 'none';
        submitButton.style.display = 'none';
        label1.style.display = 'none';
        label2.style.display = 'none';
        label3.style.display = 'none';
        quantityLabel.style.display = 'none';
        quantity.value = 1;
    }

    function toggleElementDisplay(element, condition) {
        element.style.display = condition ? 'block' : 'none';
    }

    function updateTotalPrice() {
        let total = 0;
        tableBody.querySelectorAll('tr').forEach(row => {
            const priceCell = row.cells[5];
            if (priceCell) {
                total += parseFloat(priceCell.textContent);
            }
        });
        totalPriceElement.textContent = total + ' TL';
    }

    function handleEditButtonClick(event) {
        const row = event.target.closest('tr');
        const cells = row.cells;

        dropdown1.value = cells[1].textContent.charAt(0);
        dropdown1.dispatchEvent(new Event('change'));

        setTimeout(() => {
            dropdown2.value = cells[1].textContent.substring(0, 2);
            dropdown2.dispatchEvent(new Event('change'));

            setTimeout(() => {
                dropdown3.value = cells[1].textContent;
                dropdown3.dispatchEvent(new Event('change'));

                quantity.value = cells[3].textContent.split(' ')[0];

                productModal.style.display = 'block';
                productForm.style.display = 'block';
                dropdown1.style.display = 'block';
                dropdown2.style.display = 'block';
                dropdown3.style.display = 'block';
                quantity.style.display = 'block';
                submitButton.style.display = 'block';
                label1.style.display = 'block';
                label2.style.display = 'block';
                label3.style.display = 'block';
                quantityLabel.style.display = 'block';

                currentEditRow = row;
            }, 300);
        }, 300);
    }
});
