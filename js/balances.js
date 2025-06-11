document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch balances and settlements
        const [balancesRes, settlementsRes] = await Promise.all([
            fetch(`${CONFIG.API_URL}/balances`),
            fetch(`${CONFIG.API_URL}/settlements`)
        ]);

        const balances = await balancesRes.json();
        const settlements = await settlementsRes.json();

        // Display balances
        const balancesList = document.getElementById('balancesList');
        Object.entries(balances.data).forEach(([person, amount]) => {
            const item = document.createElement('div');
            item.className = `list-group-item ${amount > 0 ? 'list-group-item-success' : amount < 0 ? 'list-group-item-danger' : ''}`;
            item.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <h6>${person}</h6>
                    <span>₹${amount.toFixed(2)}</span>
                </div>
            `;
            balancesList.appendChild(item);
        });

        // Display settlements
        const settlementsList = document.getElementById('settlementsList');
        settlements.data.forEach(settlement => {
            const item = document.createElement('div');
            item.className = 'list-group-item';
            item.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>${settlement.from} → ${settlement.to}</div>
                    <span>₹${settlement.amount.toFixed(2)}</span>
                </div>
            `;
            settlementsList.appendChild(item);
        });

    } catch (error) {
        console.error('Error fetching balances:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger';
        errorMessage.textContent = 'Failed to connect to the server. Please try again later.';
        document.querySelector('.container').prepend(errorMessage);
    }
});