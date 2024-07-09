document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('crudForm');
    const productName = document.getElementById('productName');
    const productDescription = document.getElementById('productDescription');
    const productPrice = document.getElementById('productPrice');
    const productQuantity = document.getElementById('productQuantity');
    const submitButton = document.getElementById('submitButton');
    const clearButton = document.getElementById('clearButton');
    const warningMessage = document.getElementById('warningMessage');
    const dataTable = document.getElementById('dataTable');
    const tbody = dataTable.querySelector('tbody');
    let editIndex = -1;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = productName.value.trim();
        const description = productDescription.value.trim();
        const price = productPrice.value.trim();
        const quantity = productQuantity.value.trim();

        const isValid = validateInputs(name, description, price, quantity);

        if (!isValid) {
            alert('All fields must be filled correctly!');
            return;
        }

        const productData = {
            name,
            description,
            price,
            quantity
        };

        if (editIndex === -1) {
            addRow(productData);
        } else {
            updateRow(productData);
        }
        clearForm();
        checkDataAvailability();
    });

    clearButton.addEventListener('click', () => {
        clearForm();
    });

    const validateInputs = (name, description, price, quantity) => {
        const nameValid = /^[a-zA-Z0-9\s]+$/.test(name);
        const descriptionValid = description !== '';
        const priceValid = !isNaN(price) && parseFloat(price) > 0;
        const quantityValid = !isNaN(quantity) && parseInt(quantity) > 0;

        return nameValid && descriptionValid && priceValid && quantityValid;
    };

    const addRow = (productData) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${productData.name}</td>
            <td>${productData.description}</td>
            <td>${productData.price}</td>
            <td>${productData.quantity}</td>
            <td>
                <button class="editButton">Edit</button>
                <button class="deleteButton">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
        attachRowEventListeners(row);
    };

    const updateRow = (productData) => {
        const row = tbody.children[editIndex];
        row.children[0].textContent = productData.name;
        row.children[1].textContent = productData.description;
        row.children[2].textContent = productData.price;
        row.children[3].textContent = productData.quantity;
        editIndex = -1;
        submitButton.textContent = 'Create';
    };

    const clearForm = () => {
        productName.value = '';
        productDescription.value = '';
        productPrice.value = '';
        productQuantity.value = '';
        editIndex = -1;
        submitButton.textContent = 'Create';
    };

    const attachRowEventListeners = (row) => {
        row.querySelector('.editButton').addEventListener('click', () => {
            editIndex = Array.from(tbody.children).indexOf(row);
            productName.value = row.children[0].textContent;
            productDescription.value = row.children[1].textContent;
            productPrice.value = row.children[2].textContent;
            productQuantity.value = row.children[3].textContent;
            submitButton.textContent = 'Update';
        });

        row.querySelector('.deleteButton').addEventListener('click', () => {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    row.remove();
                    checkDataAvailability();
                    Swal.fire(
                        'Deleted!',
                        'Your data has been deleted.',
                        'success'
                    );
                }
            });
        });
    };

    const checkDataAvailability = () => {
        if (tbody.children.length === 0) {
            warningMessage.classList.remove('hidden');
            dataTable.classList.add('hidden');
        } else {
            warningMessage.classList.add('hidden');
            dataTable.classList.remove('hidden');
        }
    };

    checkDataAvailability();
});
