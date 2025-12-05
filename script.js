const imagens = [
"assets/CRETA - AZUL SAPPHIRE.png",
"assets/IONQ - PRATA.png",
"assets/TUCSON - PRATA.png",
"assets/HB20 - AZUL SAPHIRE.png",
"assets/KONA - PRETO.png"
];




const premios = [
 "Bônus / Desconto de R$5mil",
 "Bônus / Desconto de R$3mil",
 "Bônus / Desconto de R$2mil",
 "Documento + IPVA Grátis",
 "1 ano de combustível grátis (1 abastecimento a álcool/mês)"
 "Até a tabela FIPE no seu Seminovo"
];




function createReelImages(reel, imagemForcada = null) {
reel.innerHTML = '';
for (let i = 0; i < 6; i++) {
  const img = document.createElement('img');
  img.src = imagemForcada || imagens[Math.floor(Math.random() * imagens.length)];
  reel.appendChild(img);
}
}




function girar() {
const agora = Date.now();
const tempoLimite = 1800000; // 30 minutos




const dadosRoleta = JSON.parse(localStorage.getItem("roleta-dados")) || {
  primeiroGiro: 0,
  tentativas: 0
};




if (agora - dadosRoleta.primeiroGiro > tempoLimite) {
  dadosRoleta.primeiroGiro = agora;
  dadosRoleta.tentativas = 0;
}




if (dadosRoleta.tentativas >= 3) {
  const tempoRestante = tempoLimite - (agora - dadosRoleta.primeiroGiro);
  document.getElementById("resultado").textContent = `Limite de 3 giros atingido. Aguarde para tentar novamente.`;




  const timerContainer = document.getElementById("timer-container");
  timerContainer.classList.add("show");




  iniciarTimer(tempoRestante);
  return;
}




dadosRoleta.tentativas += 1;
localStorage.setItem("roleta-dados", JSON.stringify(dadosRoleta));




const audio = document.getElementById("audio-spin");
if (audio) {
  audio.currentTime = 0;
  audio.play();
}




const reels = document.querySelectorAll('.reel');




const chanceDeGanho = 0.3;
const forcarVitoria = Math.random() < chanceDeGanho;
let imagemVencedora = null;




if (forcarVitoria) {
  imagemVencedora = imagens[Math.floor(Math.random() * imagens.length)];
}




reels.forEach((reel, i) => {
  createReelImages(reel, imagemVencedora);
  reel.style.animation = `spin 1.3s ease-in-out ${i * 0.3}s`;
  setTimeout(() => {
    reel.style.animation = 'none';
  }, 1400 + i * 200);
});




setTimeout(() => {
  const slots = Array.from(reels).map(reel => reel.children[2].src);
  const resultadoEl = document.getElementById("resultado");
  const cta = document.getElementById("cta");




  const todasIguais = slots.every(src => src === slots[0]);




  if (todasIguais) {
    const premio = premios[Math.floor(Math.random() * premios.length)];
    resultadoEl.textContent = `🎉 Parabéns! Você ganhou: ${premio}`;




    const numeroWhatsApp = '5514998579065'; // Sem https://, apenas números
    const mensagem = `Oi 👋 Acabei de girar a Roleta Premiada da Hyundai Top Motors e ganhei 🎁 *${premio}*! Quero saber como resgatar 🤩`;
    const mensagemCodificada = encodeURIComponent(mensagem);
    const linkWhatsapp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;




    cta.href = linkWhatsapp;
    cta.textContent = "🎁 Resgatar meu prêmio no WhatsApp";
    cta.style.display = "inline-block";
  } else {
    resultadoEl.textContent = `Você ganhou! A emoção de tentar novamente.`;
    cta.style.display = "none";
  }
}, 1800);
}




function iniciarTimer(tempoRestante) {
const timerContainer = document.getElementById("timer-container");
const timerText = document.getElementById("timer-text");
timerContainer.classList.add("show");




function atualizarTimer() {
  const minutos = Math.floor(tempoRestante / 60000);
  const segundos = Math.floor((tempoRestante % 60000) / 1000);
  timerText.textContent = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;




  if (tempoRestante <= 0) {
    timerContainer.classList.remove("show");
    clearInterval(intervalo);
    localStorage.removeItem("roleta-dados");
    document.getElementById("resultado").textContent = "Você já pode girar novamente!";
  }




  tempoRestante -= 1000;
}




let intervalo = setInterval(atualizarTimer, 1000);
atualizarTimer();
}
