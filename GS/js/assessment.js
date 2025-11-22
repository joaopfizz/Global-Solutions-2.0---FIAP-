// ========================================
// Assessment Script - Questionário Interativo
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const assessmentForm = document.getElementById('assessmentForm');
    
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processAssessment();
        });
    }
});

function processAssessment() {
    // Coletar dados do formulário
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        profissaoAtual: document.getElementById('atualProfissao').value || 'Não especificada',
        objetivoCarreira: document.getElementById('objetivoCarreira').value,
        areaInteresse: document.getElementById('areaInteresse').value,
        programacao: getRadioValue('programacao'),
        design: getRadioValue('design'),
        dados: getRadioValue('dados'),
        produto: getRadioValue('produto'),
        marketing: getRadioValue('marketing'),
        experienciaLideranca: document.getElementById('experienciaLideranca').value,
        trabalhoRemoto: document.getElementById('trabalhoRemoto').value,
        idiomas: document.getElementById('idiomas').value,
        horasSemana: document.getElementById('horasSemana').value,
        prazo: document.getElementById('prazo').value
    };

    // Validar campos obrigatórios
    if (!formData.nome || !formData.email || !formData.objetivoCarreira || !formData.areaInteresse || !formData.horasSemana) {
        if (typeof showErrorMessage === 'function') {
            showErrorMessage('Por favor, preencha todos os campos obrigatórios.');
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
        return;
    }

    // Salvar dados no localStorage
    localStorage.setItem('userAssessment', JSON.stringify(formData));
    localStorage.setItem('userName', formData.nome);

    // Gerar relatório
    generateReport(formData);

    // Mostrar resultados
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('assessmentForm').style.display = 'none';
    
    // Scroll suave até os resultados
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function getRadioValue(name) {
    const radios = document.querySelectorAll(`input[name="${name}"]:checked`);
    return radios.length > 0 ? parseInt(radios[0].value) : 0;
}

function generateReport(data) {
    const resultsContent = document.getElementById('resultsContent');
    
    // Analisar habilidades
    const skills = {
        programacao: data.programacao || 0,
        design: data.design || 0,
        dados: data.dados || 0,
        produto: data.produto || 0,
        marketing: data.marketing || 0
    };
    
    // Identificar lacunas e recomendações
    const areaMapping = {
        'tech': { name: 'Tecnologia / Desenvolvimento', skills: ['programacao'], threshold: 3 },
        'design': { name: 'Design / UX/UI', skills: ['design'], threshold: 3 },
        'data': { name: 'Dados e Análise', skills: ['dados'], threshold: 3 },
        'business': { name: 'Product Management', skills: ['produto'], threshold: 3 },
        'marketing': { name: 'Marketing Digital', skills: ['marketing'], threshold: 3 }
    };
    
    const selectedArea = areaMapping[data.areaInteresse] || areaMapping['tech'];
    const areaSkillLevel = skills[selectedArea.skills[0]] || 0;
    
    // Gerar recomendações
    const recommendations = generateRecommendations(data, skills, selectedArea, areaSkillLevel);
    
    // Calcular tempo estimado
    const estimatedTime = calculateEstimatedTime(areaSkillLevel, parseInt(data.horasSemana), parseInt(data.prazo));
    
    // Criar HTML do relatório
    resultsContent.innerHTML = `
        <div class="report-header" style="background: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%); color: white; padding: 2rem; border-radius: 10px; margin-bottom: 2rem; text-align: center;">
            <h2 style="margin-bottom: 0.5rem;">Olá, ${data.nome}!</h2>
            <p style="opacity: 0.95; margin: 0;">Seu relatório de habilidades está pronto</p>
        </div>

        <div class="report-section" style="margin-bottom: 2rem;">
            <h3 style="color: #2C3E50; margin-bottom: 1rem;">📊 Resumo do Seu Perfil</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div style="background: #ECF0F1; padding: 1.5rem; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2.5rem; color: #FF6B9D; font-weight: bold; margin-bottom: 0.5rem;">
                        ${areaSkillLevel}/5
                    </div>
                    <div style="color: #2C3E50; font-weight: 600;">Nível Atual em ${selectedArea.name}</div>
                </div>
                <div style="background: #ECF0F1; padding: 1.5rem; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2.5rem; color: #4ECDC4; font-weight: bold; margin-bottom: 0.5rem;">
                        ${estimatedTime.months}
                    </div>
                    <div style="color: #2C3E50; font-weight: 600;">Meses Estimados para Requalificação</div>
                </div>
                <div style="background: #ECF0F1; padding: 1.5rem; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2.5rem; color: #27AE60; font-weight: bold; margin-bottom: 0.5rem;">
                        ${data.horasSemana}h
                    </div>
                    <div style="color: #2C3E50; font-weight: 600;">Horas Disponíveis por Semana</div>
                </div>
            </div>
        </div>

        <div class="report-section" style="margin-bottom: 2rem;">
            <h3 style="color: #2C3E50; margin-bottom: 1rem;">🎯 Suas Habilidades Atuais</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${generateSkillBar('Programação e Desenvolvimento', skills.programacao)}
                ${generateSkillBar('Design e UX/UI', skills.design)}
                ${generateSkillBar('Análise de Dados', skills.dados)}
                ${generateSkillBar('Gestão de Produto', skills.produto)}
                ${generateSkillBar('Marketing Digital', skills.marketing)}
            </div>
        </div>

        <div class="report-section" style="margin-bottom: 2rem;">
            <h3 style="color: #2C3E50; margin-bottom: 1rem;">📈 Identificação de Lacunas</h3>
            <div style="background: #FFF3E0; border-left: 4px solid #FF9800; padding: 1.5rem; border-radius: 5px;">
                ${recommendations.gaps}
            </div>
        </div>

        <div class="report-section" style="margin-bottom: 2rem;">
            <h3 style="color: #2C3E50; margin-bottom: 1rem;">✅ Recomendações Personalizadas</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${recommendations.careerPaths}
            </div>
        </div>

        <div class="report-section" style="margin-bottom: 2rem;">
            <h3 style="color: #2C3E50; margin-bottom: 1rem;">⏱️ Plano de Ação Sugerido</h3>
            <div style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 1.5rem; border-radius: 5px;">
                <p style="margin-bottom: 1rem; color: #2C3E50;"><strong>Baseado no seu perfil, recomendamos:</strong></p>
                <ul style="list-style: none; padding: 0; color: #2C3E50;">
                    ${recommendations.actionPlan}
                </ul>
            </div>
        </div>

        <div class="report-section" style="background: #E3F2FD; border-left: 4px solid #2196F3; padding: 1.5rem; border-radius: 5px;">
            <p style="margin: 0; color: #2C3E50;">
                <strong>💡 Próximo Passo:</strong> Explore o <a href="mapa-carreira.html" style="color: #2196F3; font-weight: bold;">Mapa de Carreira</a> 
                para ver trilhas detalhadas de requalificação e começar sua jornada!
            </p>
        </div>
    `;
}

function generateSkillBar(skillName, level) {
    const percentage = (level / 5) * 100;
    const color = level >= 3 ? '#4ECDC4' : level >= 2 ? '#FFC107' : '#FF6B9D';
    
    return `
        <div style="background: #ECF0F1; padding: 1rem; border-radius: 5px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-weight: 600; color: #2C3E50;">${skillName}</span>
                <span style="color: ${color}; font-weight: bold;">${level}/5</span>
            </div>
            <div style="background: #D5DBDB; height: 20px; border-radius: 10px; overflow: hidden;">
                <div style="background: ${color}; height: 100%; width: ${percentage}%; transition: width 0.5s ease; border-radius: 10px;"></div>
            </div>
        </div>
    `;
}

function generateRecommendations(data, skills, selectedArea, areaSkillLevel) {
    const gaps = [];
    const careerPaths = [];
    const actionPlan = [];
    
    // Identificar lacunas
    if (areaSkillLevel < 3) {
        gaps.push(`
            <p style="margin-bottom: 0.5rem;"><strong>• ${selectedArea.name}:</strong> 
            Você está no nível ${areaSkillLevel}/5. Recomendamos desenvolver habilidades fundamentais nesta área para alcançar sua meta profissional.</p>
        `);
    }
    
    // Habilidades complementares
    if (selectedArea.name.includes('Tecnologia') && skills.design < 2) {
        gaps.push(`
            <p style="margin-bottom: 0.5rem;"><strong>• Design Básico:</strong> 
            Conhecimento básico de UX/UI pode complementar suas habilidades de desenvolvimento.</p>
        `);
    }
    
    if (gaps.length === 0) {
        gaps.push('<p>Parabéns! Você já possui um bom nível nas habilidades relacionadas à sua área de interesse.</p>');
    }
    
    // Recomendar trilhas de carreira
    const careerMapping = {
        'tech': {
            name: 'Desenvolvedor Full Stack',
            link: 'mapa-carreira.html#fullstack',
            description: 'Desenvolva aplicações web completas, dominando front-end e back-end.'
        },
        'design': {
            name: 'UX/UI Designer',
            link: 'mapa-carreira.html#ux',
            description: 'Crie experiências digitais incríveis combinando design visual e pesquisa de usuário.'
        },
        'data': {
            name: 'Analista de Dados',
            link: 'mapa-carreira.html#data',
            description: 'Transforme dados em insights estratégicos para apoiar decisões empresariais.'
        },
        'business': {
            name: 'Product Manager Digital',
            link: 'mapa-carreira.html#pm',
            description: 'Gerencie produtos digitais combinando visão estratégica e técnicas de produto.'
        }
    };
    
    const recommendedCareer = careerMapping[data.areaInteresse] || careerMapping['tech'];
    
    careerPaths.push(`
        <div style="background: white; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #FF6B9D; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h4 style="color: #2C3E50; margin-bottom: 0.5rem;">${recommendedCareer.name}</h4>
            <p style="color: #666; margin-bottom: 1rem;">${recommendedCareer.description}</p>
            <a href="${recommendedCareer.link}" style="color: #FF6B9D; font-weight: bold; text-decoration: none;">Explorar trilha →</a>
        </div>
    `);
    
    // Plano de ação
    const hoursPerWeek = parseInt(data.horasSemana) || 10;
    const monthsNeeded = areaSkillLevel < 3 ? 12 : areaSkillLevel < 4 ? 8 : 4;
    
    actionPlan.push(`<li style="margin-bottom: 0.5rem;">✓ Dedicar ${hoursPerWeek}h por semana ao aprendizado</li>`);
    actionPlan.push(`<li style="margin-bottom: 0.5rem;">✓ Completar trilha de ${recommendedCareer.name} em aproximadamente ${monthsNeeded} meses</li>`);
    actionPlan.push(`<li style="margin-bottom: 0.5rem;">✓ Focar primeiro em fundamentos antes de avançar para tópicos mais complexos</li>`);
    actionPlan.push(`<li style="margin-bottom: 0.5rem;">✓ Praticar através de projetos práticos e portfólio</li>`);
    
    return {
        gaps: gaps.join(''),
        careerPaths: careerPaths.join(''),
        actionPlan: actionPlan.join('')
    };
}

function calculateEstimatedTime(skillLevel, hoursPerWeek, desiredTimeframe) {
    // Base: para ir de 0 a 5, precisa de ~800 horas
    const hoursNeeded = (5 - skillLevel) * 160; // ~160h por nível
    const weeksNeeded = Math.ceil(hoursNeeded / hoursPerWeek);
    const monthsNeeded = Math.ceil(weeksNeeded / 4);
    
    return {
        hours: hoursNeeded,
        weeks: weeksNeeded,
        months: Math.max(monthsNeeded, 3) // Mínimo de 3 meses
    };
}

