document.addEventListener('DOMContentLoaded', () => {
    const sharedPeople = new Set();
    const sharedPeopleList = document.getElementById('sharedPeopleList');
    const sharedPersonInput = document.getElementById('sharedPersonInput');
    const addPersonBtn = document.getElementById('addPersonBtn');
    const sharedBetweenInput = document.getElementById('sharedBetweenInput');

    // Function to add person tag
    const addPersonTag = (name) => {
        if (name && !sharedPeople.has(name)) {
            sharedPeople.add(name);
            
            const tag = document.createElement('span');
            tag.className = 'badge bg-primary me-2 mb-2';
            tag.innerHTML = `
                ${name}
                <button type="button" class="btn-close btn-close-white ms-2" 
                    aria-label="Remove" style="font-size: 0.5rem;"></button>
            `;
            
            tag.querySelector('.btn-close').addEventListener('click', () => {
                sharedPeople.delete(name);
                tag.remove();
                updateSharedBetweenInput();
            });
            
            sharedPeopleList.appendChild(tag);
            updateSharedBetweenInput();
        }
        sharedPersonInput.value = '';
    };

    // Update hidden input with current people
    const updateSharedBetweenInput = () => {
        sharedBetweenInput.value = JSON.stringify(Array.from(sharedPeople));
    };

    // Add person when button is clicked
    addPersonBtn.addEventListener('click', () => {
        addPersonTag(sharedPersonInput.value.trim());
    });

    // Add person when Enter is pressed
    sharedPersonInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addPersonTag(sharedPersonInput.value.trim());
        }
    });

    // Handle form submission
    document.getElementById('expenseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const expense = {
            amount: Number(formData.get('amount')),
            description: formData.get('description'),
            paid_by: formData.get('paid_by'),
            shared_between: JSON.parse(formData.get('shared_between')),
            split_type: formData.get('split_type'),
            category: formData.get('category')
        };

        try {
            const response = await fetch(`${CONFIG.API_URL}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expense)
            });

            if (response.ok) {
                window.location.href = '/';
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            alert('Failed to add expense');
        }
    });
});