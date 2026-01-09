const imagens = [
 "assets/CRETA - AZUL SAPPHIRE.png",
 "assets/IONQ - PRATA.png",
 "assets/TUCSON - PRATA.png",
 "assets/HB20 - AZUL SAPHIRE.png",
 "assets/KONA - PRETO.png"
];

const premios = [
 "Bônus de R$5.000,00",
 "Bônus de R$3.000,00",
 "Documento 2026 Grátis (Emplacamento + Licenciamento)",
 "Um ano de tanque Cheio (limitado a 1 por mês - Alcool)",
 "Super Valorização no seu seminovo"
];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const reels = document.querySelectorAll('.reel');
    reels.forEach(reel => createReelImages(reel));
    // Não chamamos bloqueio inicial aqui para não assustar o usuário
});

function createReelImages(reel, imagemForcada = null) {
 reel.innerHTML = '';
 for (let i = 0; i < 12; i++) {
   const img = document.createElement('img');
   img.src = imagemForcada ? imagemForcada : imagens[Math.floor(Math.random() * imagens.length)];
   reel.appendChild(img);
 }
}

function girar() {
 console.log("Clicou em girar"); // Log para debug
 const agora = Date.now();
 const tempoLimite = 1800000; // 30 minutos

 const dadosRoleta = JSON.parse(localStorage.getItem("roleta-dados")) || {
   primeiroGiro: 0,
   tentativas: 0
 };

 // Reset de tempo se passou 30min
 if (agora - dadosRoleta.primeiroGiro > tempoLimite) {
   dadosRoleta.primeiroGiro = agora;
   dadosRoleta.tentativas = 0;
   localStorage.setItem("roleta-dados", JSON.stringify(dadosRoleta));
 }

 // --- LÓGICA DE BLOQUEIO (Só ativa se clicar E já tiver 3 tentativas) ---
 if (dadosRoleta.tentativas >= 3) {
   const tempoRestante = tempoLimite - (agora - dadosRoleta.primeiroGiro);
   const timerContainer = document.getElementById("timer-container");
   
   timerContainer.classList.add("show");
   iniciarTimer(tempoRestante);
   return; // Para a função aqui
 }

 // --- SE PASSOU DAQUI, VAI GIRAR ---
 
 if (dadosRoleta.tentativas === 0) {
     dadosRoleta.primeiroGiro = agora;
 }
 
 dadosRoleta.tentativas += 1;
 localStorage.setItem("roleta-dados", JSON.stringify(dadosRoleta));

 // Toca áudio
 const audio = document.getElementById("audio-spin");
 if (audio) {
   audio.currentTime = 0;
   audio.play().catch(e => console.log("Áudio bloqueado pelo navegador"));
 }

 const reels = document.querySelectorAll('.reel');
 
 // Busca o botão pelo ID 'btn-girar'
 const btn = document.getElementById("btn-girar");
 
 if (btn) {
    btn.disabled = true;
    btn.textContent = "GIRANDO...";
 }

 const chanceDeGanho = 0.3;
 const vaiGanhar = Math.random() < chanceDeGanho;
 let imagemVencedora = null;

 if (vaiGanhar) {
   imagemVencedora = imagens[Math.floor(Math.random() * imagens.length)];
 }

 reels.forEach((reel, i) => {
   createReelImages(reel, null); 
   
   const imgResultado = document.createElement('img');
   imgResultado.src = imagemVencedora || imagens[Math.floor(Math.random() * imagens.length)];
   reel.appendChild(imgResultado);

   reel.style.transition = 'none';
   reel.style.transform = 'translateY(0)';
   
   setTimeout(() => {
       reel.style.transition = `transform 1.5s cubic-bezier(0.25, 1, 0.5, 1) ${i * 0.2}s`;
       const alturaSlot = 100; 
       const totalImagens = reel.children.length;
       const posicaoFinal = (totalImagens - 1) * alturaSlot; 
       reel.style.transform = `translateY(-${posicaoFinal}px)`;
   }, 50);
 });

 setTimeout(() => {
   const slots = Array.from(reels).map(reel => reel.lastElementChild.src);
   const resultadoEl = document.getElementById("resultado");
   const cta = document.getElementById("cta");
   const todasIguais = slots.every(src => src === slots[0]);

   if (todasIguais) {
     const premio = premios[Math.floor(Math.random() * premios.length)];
     resultadoEl.textContent = `🎉 PARABÉNS! VOCÊ GANHOU: ${premio}`;
     
     if (typeof confetti === "function") {
         confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
         });
     }

     const numeroWhatsApp = '5514998579065'; 
     const mensagem = `Oi 👋 Girei a roleta da Hyundai Top Motors e ganhei: *${premio}*! Como resgato? 🤩`;
     const linkWhatsapp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

     cta.href = linkWhatsapp;
     cta.innerHTML = `🎁 RESGATAR PRÊMIO`;
     cta.style.display = "inline-block";
   } else {
     resultadoEl.textContent = `Não foi dessa vez! Tente novamente.`;
     cta.style.display = "none";
   }

   // Reativa o botão
   if (btn) {
       btn.disabled = false;
       btn.textContent = "GIRAR NOVAMENTE";
   }

 }, 2200);
}

function iniciarTimer(tempoRestante) {
 const timerText = document.getElementById("timer-text");
 
 function atualizarTimer() {
   if (tempoRestante <= 0) {
     location.reload(); 
     return;
   }

   const minutos = Math.floor(tempoRestante / 60000);
   const segundos = Math.floor((tempoRestante % 60000) / 1000);
   if(timerText) {
       timerText.textContent = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
   }
   tempoRestante -= 1000;
 }

 if (window.timerInterval) clearInterval(window.timerInterval);
 window.timerInterval = setInterval(atualizarTimer, 1000);
 atualizarTimer();
}
