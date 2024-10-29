$(document).ready(function() {
    const ctxFinance = document.getElementById('financeChart').getContext('2d');
    const ctxCombined = document.getElementById('combinedChart').getContext('2d');

    let financeChart, combinedChart;

    $('#financeForm').on('submit', function(e) {
        e.preventDefault();

        const income = parseFloat($('#income').val());
        const expense = parseFloat($('#expense').val());

        if (isNaN(income) || isNaN(expense)) {
            toastr.error('😩 Por favor, insira valores válidos para receita e despesa!');
            return;
        }

        const savings = income * 0.10; // 10% de receita
        const remaining = income - expense - savings; // Calculando o restante corretamente

        // Atualizando o gráfico de finanças
        if (financeChart) financeChart.destroy();
        financeChart = new Chart(ctxFinance, {
            type: 'bar',
            data: {
                labels: ['Receita', 'Despesa', 'Economia', 'Restante'],
                datasets: [{
                    label: 'Valores',
                    data: [income, expense, savings, remaining],
                    backgroundColor: ['#4caf50', '#f44336', '#ff9800', '#2196F3'],
                    borderColor: '#000',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.dataset.label}: R$ ${tooltipItem.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Gráfico combinado de Poupança e Tesouro Selic
        if (combinedChart) combinedChart.destroy();
        const months = 12; // 1 ano
        const interestSavings = 0.006; // 0,6% ao mês
        const interestSelic = 0.012; // 1,2% ao mês

        const savingsData = [];
        const selicData = [];
        let totalSavings = 0;
        let totalSelic = 0;

        for (let i = 0; i < months; i++) {
            totalSavings += savings * Math.pow(1 + interestSavings, i);
            totalSelic += savings * Math.pow(1 + interestSelic, i);
            savingsData.push(totalSavings);
            selicData.push(totalSelic);
        }

        combinedChart = new Chart(ctxCombined, {
            type: 'line',
            data: {
                labels: [...Array(months).keys()].map(m => `Mês ${m + 1}`),
                datasets: [{
                    label: 'Poupança',
                    data: savingsData,
                    borderColor: '#ff9800',
                    fill: false
                }, {
                    label: 'Tesouro Selic',
                    data: selicData,
                    borderColor: '#2196F3',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.dataset.label}: R$ ${tooltipItem.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        $('#results').html(`
            <h3>Resultados</h3>
            <p>Receita: <strong>R$ ${income.toFixed(2)}</strong></p>
            <p>Despesa: <strong>R$ ${expense.toFixed(2)}</strong></p>
            <p>Economias (10%): <strong>R$ ${savings.toFixed(2)}</strong></p>
            <p>Restante: <strong>R$ ${remaining.toFixed(2)}</strong></p>
        `);

        toastr.success('✅ Cálculos realizados com sucesso!');
    });

    // Feedback do usuário
    $('#feedbackForm').on('submit', function(e) {
        e.preventDefault();
        const feedbackText = $('#feedback').val();
        if (!feedbackText) {
            toastr.warning('Por favor, escreva algo antes de enviar!');
            return;
        }

        // Aqui você pode enviar o feedback para um servidor ou fazer algo com ele
        toastr.success('✅ Seu feedback foi enviado! Obrigado pela contribuição!');
        $('#feedback').val(''); // Limpa o campo de feedback
    });
});

document.getElementById('toggleDarkMode').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        this.textContent = 'Modo Claro';
    } else {
        this.textContent = 'Modo Escuro';
    }
});

function formatNumber(event) {
    let input = event.target;
    // Remove todos os caracteres que não sejam números e vírgulas
    let value = input.value.replace(/\D/g, '');
    
    // Formata o valor para incluir vírgulas e ponto decimal
    value = (parseFloat(value) / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }); }
