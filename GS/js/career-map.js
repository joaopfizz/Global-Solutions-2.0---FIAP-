// ========================================
// Career Map Scripts - Filtros e Interações
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Filtro de carreira
    const careerFilter = document.getElementById('careerFilter');
    const careerPaths = document.querySelectorAll('.career-path');

    if (careerFilter) {
        careerFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            
            careerPaths.forEach(path => {
                if (selectedCategory === 'all' || path.dataset.category === selectedCategory) {
                    path.style.display = 'block';
                    setTimeout(() => {
                        path.style.opacity = '1';
                        path.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    path.style.opacity = '0';
                    path.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        path.style.display = 'none';
                    }, 300);
                }
            });
        });
    }

    // Animações para os roadmap steps
    const roadmapSteps = document.querySelectorAll('.roadmap-step');
    roadmapSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-20px)';
        step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateX(0)';
        }, index * 200);
    });
});

// Função para rastrear progresso
function trackProgress(skillId) {
    // Recuperar progresso do localStorage
    let progress = JSON.parse(localStorage.getItem('careerProgress') || '{}');
    
    // Marcar habilidade como concluída
    progress[skillId] = true;
    
    // Salvar no localStorage
    localStorage.setItem('careerProgress', JSON.stringify(progress));
    
    // Atualizar UI
    const button = event.target;
    button.style.background = '#27AE60';
    button.textContent = '✓ Concluído';
    button.disabled = true;
    
    // Atualizar dashboard
    updateDashboard();
    
    // Mostrar mensagem de sucesso
    if (typeof showSuccessMessage === 'function') {
        showSuccessMessage('Habilidade marcada como concluída! 🎉');
    } else {
        alert('Habilidade marcada como concluída! 🎉');
    }
    
    // Atualizar progresso visual na página
    updateProgressBars();
}

// Função para calcular ROI
function calculateROI(careerType) {
    const rois = {
        'fullstack': {
            investment: 'R$ 2.000 - 5.000',
            timeMonths: '12-18 meses',
            avgSalary: 'R$ 7.000',
            roi: '140% - 350%',
            payback: '6-8 meses'
        },
        'ux': {
            investment: 'R$ 1.500 - 3.500',
            timeMonths: '8-12 meses',
            avgSalary: 'R$ 6.000',
            roi: '171% - 400%',
            payback: '4-6 meses'
        },
        'data': {
            investment: 'R$ 1.800 - 4.000',
            timeMonths: '9-13 meses',
            avgSalary: 'R$ 6.500',
            roi: '163% - 361%',
            payback: '5-7 meses'
        },
        'pm': {
            investment: 'R$ 2.200 - 5.500',
            timeMonths: '9-12 meses',
            avgSalary: 'R$ 9.000',
            roi: '164% - 409%',
            payback: '4-6 meses'
        }
    };

    const roi = rois[careerType] || rois['fullstack'];
    
    const modal = document.getElementById('roiModal');
    const resultsDiv = document.getElementById('roiResults');
    
    resultsDiv.innerHTML = `
        <div style="padding: 2rem;">
            <h3 style="color: #2C3E50; margin-bottom: 1.5rem;">Análise de Retorno sobre Investimento</h3>
            <div style="display: grid; gap: 1rem;">
                <div style="display: flex; justify-content: space-between; padding: 1rem; background: #ECF0F1; border-radius: 5px;">
                    <strong>Investimento Necessário:</strong>
                    <span style="color: #FF6B9D; font-weight: bold;">${roi.investment}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 1rem; background: #ECF0F1; border-radius: 5px;">
                    <strong>Tempo de Preparação:</strong>
                    <span style="color: #4ECDC4; font-weight: bold;">${roi.timeMonths}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 1rem; background: #ECF0F1; border-radius: 5px;">
                    <strong>Salário Médio (inicial):</strong>
                    <span style="color: #27AE60; font-weight: bold;">${roi.avgSalary}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 1rem; background: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%); color: white; border-radius: 5px;">
                    <strong>ROI Estimado (1 ano):</strong>
                    <span style="font-weight: bold; font-size: 1.2rem;">${roi.roi}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 1rem; background: #ECF0F1; border-radius: 5px;">
                    <strong>Tempo de Payback:</strong>
                    <span style="color: #FF6B9D; font-weight: bold;">${roi.payback}</span>
                </div>
            </div>
            <div style="margin-top: 2rem; padding: 1rem; background: #E8F8F5; border-radius: 5px; border-left: 4px solid #4ECDC4;">
                <p style="color: #2C3E50; margin: 0;">
                    <strong>💡 Nota:</strong> Estes valores são estimativas baseadas em dados de mercado. 
                    O retorno real pode variar conforme sua dedicação, localização e oportunidades disponíveis.
                </p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Fechar modal de ROI
function closeROIModal() {
    const modal = document.getElementById('roiModal');
    modal.style.display = 'none';
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('roiModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Atualizar barras de progresso (chamada do dashboard)
function updateProgressBars() {
    // Esta função é chamada pelo dashboard.js
    if (typeof window.updateDashboard === 'function') {
        window.updateDashboard();
    }
}

