// ========================================
// Dashboard Script - Progresso e Conquistas
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    updateProgressBars();
    updateBadges();
    loadRecommendations();
});

function loadDashboardData() {
    // Carregar nome do usuário
    const userName = localStorage.getItem('userName') || 'Usuário';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
    
    document.getElementById('userName').textContent = userName;
    document.getElementById('userInitials').textContent = userInitials;
    
    // Carregar objetivo de carreira
    const assessment = JSON.parse(localStorage.getItem('userAssessment') || '{}');
    if (assessment.areaInteresse) {
        const areaNames = {
            'tech': 'Desenvolvedor Full Stack',
            'design': 'UX/UI Designer',
            'data': 'Analista de Dados',
            'business': 'Product Manager Digital',
            'marketing': 'Marketing Digital'
        };
        const goal = areaNames[assessment.areaInteresse] || 'Nenhum objetivo definido';
        document.getElementById('userGoal').textContent = `Objetivo: ${goal}`;
    }
}

function updateProgressBars() {
    const progress = JSON.parse(localStorage.getItem('careerProgress') || '{}');
    
    // Definir habilidades por área
    const areas = {
        'fullstack': ['fundamentos-fullstack', 'frontend-fullstack', 'backend-fullstack'],
        'ux': ['fundamentos-ux', 'research-ux', 'ui-ux'],
        'data': ['fundamentos-data', 'viz-data', 'bi-data'],
        'pm': ['fundamentos-pm', 'gestao-pm', 'estrategia-pm']
    };
    
    // Calcular progresso para cada área
    Object.keys(areas).forEach(area => {
        const skills = areas[area];
        const completed = skills.filter(skill => progress[skill]).length;
        const percentage = Math.round((completed / skills.length) * 100);
        
        // Atualizar barra de progresso
        const progressFill = document.querySelector(`.progress-fill[data-area="${area}"]`);
        const progressPercentage = document.querySelector(`.progress-item:nth-child(${Object.keys(areas).indexOf(area) + 1}) .progress-percentage`);
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
            progressFill.textContent = percentage > 0 ? `${percentage}%` : '';
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = `${percentage}%`;
        }
    });
    
    // Atualizar estatísticas gerais
    updateStats(progress, areas);
    updateCompletedSteps(progress, areas);
}

function updateStats(progress, areas) {
    // Contar habilidades concluídas
    let totalCompleted = 0;
    Object.values(areas).forEach(skills => {
        totalCompleted += skills.filter(skill => progress[skill]).length;
    });
    
    document.getElementById('completedSkills').textContent = totalCompleted;
    
    // Calcular horas (estimativa: 160h por habilidade)
    const totalHours = totalCompleted * 160;
    document.getElementById('totalHours').textContent = `${totalHours}h`;
    
    // Calcular progresso geral (baseado em todas as áreas)
    const totalSkills = Object.values(areas).reduce((sum, skills) => sum + skills.length, 0);
    const overallProgress = Math.round((totalCompleted / totalSkills) * 100);
    document.getElementById('progressPercentage').textContent = `${overallProgress}%`;
    
    // Atualizar badges count
    let badgesCount = 0;
    if (totalCompleted >= 1) badgesCount++;
    if (totalCompleted >= 5) badgesCount++;
    if (Object.keys(areas).some(area => {
        const skills = areas[area];
        return skills.every(skill => progress[skill]);
    })) badgesCount++;
    if (totalCompleted === totalSkills) badgesCount++;
    
    document.getElementById('badgesCount').textContent = badgesCount;
}

function updateCompletedSteps(progress, areas) {
    const completedStepsList = document.getElementById('completedStepsList');
    const completedSteps = [];
    
    // Mapear habilidades concluídas
    const skillNames = {
        'fundamentos-fullstack': 'Fundamentos - Desenvolvedor Full Stack',
        'frontend-fullstack': 'Front-end - Desenvolvedor Full Stack',
        'backend-fullstack': 'Back-end - Desenvolvedor Full Stack',
        'fundamentos-ux': 'Fundamentos - UX/UI Designer',
        'research-ux': 'UX Research - UX/UI Designer',
        'ui-ux': 'UI Design - UX/UI Designer',
        'fundamentos-data': 'Fundamentos - Analista de Dados',
        'viz-data': 'Visualização - Analista de Dados',
        'bi-data': 'Business Intelligence - Analista de Dados',
        'fundamentos-pm': 'Fundamentos - Product Manager',
        'gestao-pm': 'Gestão de Produto - Product Manager',
        'estrategia-pm': 'Estratégia - Product Manager'
    };
    
    Object.keys(progress).forEach(skillId => {
        if (progress[skillId] && skillNames[skillId]) {
            completedSteps.push(skillNames[skillId]);
        }
    });
    
    if (completedSteps.length === 0) {
        completedStepsList.innerHTML = `
            <p class="empty-state">Nenhuma habilidade concluída ainda. Explore o <a href="mapa-carreira.html">Mapa de Carreira</a> para começar!</p>
        `;
    } else {
        completedStepsList.innerHTML = completedSteps.map(step => `
            <div style="background: #E8F5E9; padding: 1rem; border-radius: 5px; border-left: 4px solid #4CAF50; margin-bottom: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="color: #4CAF50; font-size: 1.5rem;">✓</span>
                    <span style="color: #2C3E50; font-weight: 600;">${step}</span>
                </div>
            </div>
        `).join('');
    }
}

function updateBadges() {
    const progress = JSON.parse(localStorage.getItem('careerProgress') || '{}');
    const completedCount = Object.values(progress).filter(v => v).length;
    
    const areas = {
        'fullstack': ['fundamentos-fullstack', 'frontend-fullstack', 'backend-fullstack'],
        'ux': ['fundamentos-ux', 'research-ux', 'ui-ux'],
        'data': ['fundamentos-data', 'viz-data', 'bi-data'],
        'pm': ['fundamentos-pm', 'gestao-pm', 'estrategia-pm']
    };
    
    // Verificar se alguma trilha completa foi concluída
    const hasCompletePath = Object.keys(areas).some(area => {
        const skills = areas[area];
        return skills.every(skill => progress[skill]);
    });
    
    const allComplete = Object.values(areas).every(skills => 
        skills.every(skill => progress[skill])
    );
    
    const badges = document.querySelectorAll('.badge-card');
    
    // Badge 1: Iniciante (1 habilidade)
    if (completedCount >= 1) {
        badges[0].classList.remove('locked');
        badges[0].querySelector('.badge-status').textContent = 'Conquistado!';
        badges[0].style.background = 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)';
        badges[0].style.color = 'white';
    }
    
    // Badge 2: Em Progresso (5 habilidades)
    if (completedCount >= 5) {
        badges[1].classList.remove('locked');
        badges[1].querySelector('.badge-status').textContent = 'Conquistado!';
        badges[1].style.background = 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)';
        badges[1].style.color = 'white';
    }
    
    // Badge 3: Expert (trilha completa)
    if (hasCompletePath) {
        badges[2].classList.remove('locked');
        badges[2].querySelector('.badge-status').textContent = 'Conquistado!';
        badges[2].style.background = 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)';
        badges[2].style.color = 'white';
    }
    
    // Badge 4: Mestre (todas as trilhas)
    if (allComplete) {
        badges[3].classList.remove('locked');
        badges[3].querySelector('.badge-status').textContent = 'Conquistado!';
        badges[3].style.background = 'linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)';
        badges[3].style.color = 'white';
    }
}

function loadRecommendations() {
    const recommendationsList = document.getElementById('recommendationsList');
    const assessment = JSON.parse(localStorage.getItem('userAssessment') || '{}');
    const progress = JSON.parse(localStorage.getItem('careerProgress') || '{}');
    const completedCount = Object.values(progress).filter(v => v).length;
    
    let recommendations = [];
    
    if (completedCount === 0) {
        recommendations.push({
            title: '📖 Comece sua jornada',
            text: 'Complete a <a href="avaliacao-habilidades.html">avaliação de habilidades</a> para receber recomendações personalizadas.',
            icon: '📖'
        });
    } else if (completedCount < 3) {
        recommendations.push({
            title: '🚀 Continue aprendendo',
            text: 'Você está no caminho certo! Explore o <a href="mapa-carreira.html">Mapa de Carreira</a> para descobrir novas habilidades.',
            icon: '🚀'
        });
    } else {
        recommendations.push({
            title: '🎯 Próximos passos',
            text: 'Parabéns pelo progresso! Considere completar uma trilha inteira para desbloquear o badge Expert.',
            icon: '🎯'
        });
    }
    
    if (assessment.areaInteresse) {
        const areaNames = {
            'tech': 'Desenvolvedor Full Stack',
            'design': 'UX/UI Designer',
            'data': 'Analista de Dados',
            'business': 'Product Manager Digital'
        };
        const areaName = areaNames[assessment.areaInteresse];
        
        if (areaName) {
            recommendations.push({
                title: `💼 Foque em ${areaName}`,
                text: `Baseado na sua avaliação, recomendamos focar na trilha de ${areaName}. <a href="mapa-carreira.html">Ver trilha →</a>`,
                icon: '💼'
            });
        }
    }
    
    recommendationsList.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
            <h3>${rec.icon} ${rec.title}</h3>
            <p>${rec.text}</p>
        </div>
    `).join('');
}

function resetProgress() {
    if (confirm('Tem certeza que deseja limpar todo o seu progresso? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('careerProgress');
        location.reload();
    }
}

// Exportar função para uso em outros scripts
if (typeof window !== 'undefined') {
    window.updateDashboard = updateProgressBars;
}

