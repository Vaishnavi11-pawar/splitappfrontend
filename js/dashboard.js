document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and display dashboard data
    const fetchDashboardData = async () => {
        try {
            const [expenses, people, categoryData] = await Promise.all([
                fetch(`${CONFIG.API_URL}/expenses`).then(r => r.json()),
                fetch(`${CONFIG.API_URL}/people`).then(r => r.json()),
                fetch(`${CONFIG.API_URL}/spending-category`).then(r => r.json())
            ]);

            // Update statistics
            document.getElementById('totalExpenses').textContent = '₹' + 
                expenses.data.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2);
            document.getElementById('totalPeople').textContent = people.data.length;

            // Display recent expenses
            const recentList = document.getElementById('recentExpenses');
            expenses.data.slice(0, 5).forEach(exp => {
                const item = document.createElement('div');
                item.className = 'list-group-item';
                item.innerHTML = `
                    <div class="d-flex justify-content-between">
                        <h6>${exp.description}</h6>
                        <span>₹${exp.amount}</span>
                    </div>
                    <small class="text-muted">Paid by ${exp.paid_by}</small>
                `;
                recentList.appendChild(item);
            });

            // Create category chart
            const ctx = document.getElementById('categoryChart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: categoryData.data.map(c => c.category),
                    datasets: [{
                        data: categoryData.data.map(c => c.total),
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF',
                            '#FF9F40'
                        ]
                    }]
                }
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    fetchDashboardData();
});