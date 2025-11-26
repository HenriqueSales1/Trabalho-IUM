// Sistema de Agendamento
let dataAtual = new Date();
let mesAtual = dataAtual.getMonth();
let anoAtual = dataAtual.getFullYear();
let dataSelecionada = null;
let horarioSelecionado = null;

const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Horários disponíveis (9h às 19h)
const horariosDisponiveis = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00'
];

document.addEventListener('DOMContentLoaded', function() {
    inicializarCalendario();
    
    const btnMesAnterior = document.getElementById('btnMesAnterior');
    const btnMesProximo = document.getElementById('btnMesProximo');
    const btnConfirmar = document.getElementById('btnConfirmar');

    if (btnMesAnterior) {
        btnMesAnterior.addEventListener('click', function() {
            mesAtual--;
            if (mesAtual < 0) {
                mesAtual = 11;
                anoAtual--;
            }
            renderizarCalendario();
        });
    }

    if (btnMesProximo) {
        btnMesProximo.addEventListener('click', function() {
            mesAtual++;
            if (mesAtual > 11) {
                mesAtual = 0;
                anoAtual++;
            }
            renderizarCalendario();
        });
    }

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', confirmarAgendamento);
    }
});

function inicializarCalendario() {
    renderizarCalendario();
}

function renderizarCalendario() {
    const mesAnoElement = document.getElementById('mesAno');
    const calendarioDiasElement = document.getElementById('calendarioDias');
    
    if (!mesAnoElement || !calendarioDiasElement) return;

    mesAnoElement.textContent = `${meses[mesAtual]} ${anoAtual}`;
    calendarioDiasElement.innerHTML = '';

    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const ultimoDiaMesAnterior = new Date(anoAtual, mesAtual, 0).getDate();
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Dias do mês anterior
    for (let i = primeiroDia - 1; i >= 0; i--) {
        const diaElement = criarDiaElement(ultimoDiaMesAnterior - i, true, false);
        diaElement.classList.add('outro-mes');
        calendarioDiasElement.appendChild(diaElement);
    }

    // Dias do mês atual
    for (let dia = 1; dia <= ultimoDia; dia++) {
        const dataCompleta = new Date(anoAtual, mesAtual, dia);
        dataCompleta.setHours(0, 0, 0, 0);
        
        const ehPassado = dataCompleta < hoje;
        const ehDomingo = dataCompleta.getDay() === 0;
        const ehSabado = dataCompleta.getDay() === 6;
        
        const diaElement = criarDiaElement(dia, false, ehPassado || ehDomingo);
        
        if (dataCompleta.getTime() === hoje.getTime()) {
            diaElement.classList.add('hoje');
        }

        if (dataSelecionada && 
            dataSelecionada.getDate() === dia && 
            dataSelecionada.getMonth() === mesAtual && 
            dataSelecionada.getFullYear() === anoAtual) {
            diaElement.classList.add('selecionado');
        }

        if (ehSabado && !ehPassado) {
            diaElement.title = 'Sábado - Horário limitado até 14h';
        }

        calendarioDiasElement.appendChild(diaElement);
    }

    // Completar última semana
    const totalDias = calendarioDiasElement.children.length;
    const diasRestantes = 7 - (totalDias % 7);
    if (diasRestantes < 7) {
        for (let i = 1; i <= diasRestantes; i++) {
            const diaElement = criarDiaElement(i, true, false);
            diaElement.classList.add('outro-mes');
            calendarioDiasElement.appendChild(diaElement);
        }
    }
}

function criarDiaElement(numero, outroMes, disabled) {
    const diaElement = document.createElement('div');
    diaElement.className = 'dia';
    diaElement.textContent = numero;
    
    if (disabled) {
        diaElement.classList.add('disabled');
    } else if (!outroMes) {
        diaElement.addEventListener('click', function() {
            selecionarData(numero);
        });
    }
    
    return diaElement;
}

function selecionarData(dia) {
    dataSelecionada = new Date(anoAtual, mesAtual, dia);
    horarioSelecionado = null;
    
    renderizarCalendario();
    renderizarHorarios();
    
    const btnConfirmar = document.getElementById('btnConfirmar');
    if (btnConfirmar) {
        btnConfirmar.disabled = true;
    }
}

function renderizarHorarios() {
    const horariosGrid = document.getElementById('horariosGrid');
    const dataSelecionadaElement = document.getElementById('dataSelecionada');
    
    if (!horariosGrid || !dataSelecionada) return;

    const opcoes = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    dataSelecionadaElement.textContent = dataSelecionada.toLocaleDateString('pt-BR', opcoes);
    
    horariosGrid.innerHTML = '';

    const ehSabado = dataSelecionada.getDay() === 6;
    let horariosParaMostrar = horariosDisponiveis;
    
    if (ehSabado) {
        // Sábado: apenas até 14h
        horariosParaMostrar = horariosDisponiveis.filter(h => {
            const hora = parseInt(h.split(':')[0]);
            return hora < 14;
        });
    }

    horariosParaMostrar.forEach(horario => {
        const horarioElement = document.createElement('div');
        horarioElement.className = 'horario-slot';
        horarioElement.textContent = horario;
        
        // Simular alguns horários ocupados aleatoriamente
        if (Math.random() > 0.7) {
            horarioElement.classList.add('ocupado');
            horarioElement.title = 'Horário indisponível';
        } else {
            horarioElement.addEventListener('click', function() {
                selecionarHorario(horario, horarioElement);
            });
        }
        
        horariosGrid.appendChild(horarioElement);
    });
}

function selecionarHorario(horario, element) {
    horarioSelecionado = horario;
    
    // Remover seleção de outros horários
    document.querySelectorAll('.horario-slot').forEach(slot => {
        slot.classList.remove('selecionado');
    });
    
    element.classList.add('selecionado');
    
    const btnConfirmar = document.getElementById('btnConfirmar');
    if (btnConfirmar) {
        btnConfirmar.disabled = false;
    }
}

function confirmarAgendamento() {
    if (!dataSelecionada || !horarioSelecionado) return;
    
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    // Criar caixa do alerta
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    
    // Criar mensagem
    const mensagem = document.createElement('p');
    mensagem.textContent = 'O agendamento está temporariamente indisponível';
    
    // Criar botão
    const botao = document.createElement('button');
    botao.textContent = 'Fechar';
    botao.addEventListener('click', function() {
        overlay.remove();
    });
    
    // Montar estrutura
    alertBox.appendChild(mensagem);
    alertBox.appendChild(botao);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    
    // Fechar ao clicar no overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}
