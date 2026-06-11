var entregas = [
  { id: 301, transportadora: "RotaMax", regiao: "Sudeste", prazo: 3, real: 7 },
  { id: 302, transportadora: "ViaCargo", regiao: "Sul", prazo: 5, real: 5 },
  { id: 303, transportadora: "FlashLog", regiao: "Nordeste", prazo: 4, real: 9 },
  { id: 304, transportadora: "RotaMax", regiao: "Norte", prazo: 6, real: 4 },
  { id: 305, transportadora: "ViaCargo", regiao: "Centro-Oeste", prazo: 2, real: 6 },
  { id: 306, transportadora: "FlashLog", regiao: "Sul", prazo: 5, real: 12 },
  { id: 307, transportadora: "RotaMax", regiao: "Sul", prazo: 6, real: 9 },
  { id: 308, transportadora: "ViaCargo", regiao: "Sudeste", prazo: 3, real: 4 },
  { id: 309, transportadora: "FlashLog", regiao: "Norte", prazo: 5, real: 5 },
  { id: 310, transportadora: "ViaCargo", regiao: "Nordeste", prazo: 4, real: 8 }
];

var graficoTransportadora;
var graficoRegiao;

function pegar(id) {
  return document.getElementById(id);
}

function atraso(e) {
  return Math.max(0, e.real - e.prazo);
}

function atualizarDashboard() {
  var filtroT = pegar("transportadora").value;
  var filtroR = pegar("regiao").value;

  var dados = entregas.filter(function(e) {
    return (filtroT == "todas" || e.transportadora.toLowerCase() == filtroT) &&
           (filtroR == "todas" || e.regiao.toLowerCase() == filtroR);
  });

  var atrasadas = dados.filter(function(e) {
    return atraso(e) > 0;
  });

  var maior = Math.max(0, ...dados.map(atraso));
  var taxa = dados.length == 0 ? 0 : Math.round((atrasadas.length / dados.length) * 100);

  pegar("totalEntregas").innerHTML = dados.length;
  pegar("entregasAtrasadas").innerHTML = atrasadas.length;
  pegar("taxaAtraso").innerHTML = taxa + "%";
  pegar("maiorAtraso").innerHTML = maior + " dias";

  var pior = dados.find(function(e) {
    return atraso(e) == maior && maior > 0;
  });

    pegar("entregaCritica").innerHTML = pior
    ? "Entrega " + `<strong>${pior.id}</strong>` + " da " + `<strong>${pior.transportadora}</strong>` + " com " +`<strong>${maior}</strong>` + " dias de atraso"
    : "Nenhuma entrega atrasada";

  mostrarTabela(dados);
  mostrarRanking(dados);
  mostrarGraficos(dados);
}

function mostrarTabela(dados) {
  pegar("tabelaEntregas").innerHTML = dados.map(function(e) {
    return `
      <tr>
        <td>${e.id}</td>
        <td>${e.transportadora}</td>
        <td>${e.regiao}</td>
        <td>${e.prazo}</td>
        <td>${e.real}</td>
        <td>${atraso(e)}</td>
        <td style="color: ${atraso(e) > 0 ? 'red' : 'green'}">${atraso(e) > 0 ? "Atrasada" : "No prazo"}</td>
      </tr>
    `;
  }).join("")
}

function mostrarRanking(dados) {
  var ranking = dados
    .filter(function(e) { return atraso(e) > 0; })
    .sort(function(a, b) { return atraso(b) - atraso(a); });

  pegar("tabelaRanking").innerHTML = ranking.map(function(e, i) {
    return `
      <tr>
        <td>${i + 1}º</td>
        <td>${e.id}</td>
        <td>${e.transportadora}</td>
        <td>${e.regiao}</td>
        <td>${e.prazo}</td>
        <td>${e.real}</td>
        <td>${atraso(e)}</td>
        <td style="color: ${atraso(e) > 0 ? 'red' : 'green'}">${atraso(e) > 0 ? "Atrasada" : "No prazo"}</td>
      </tr>
    `;
  }).join("");
}

function somar(dados, campo, nomes) {
  var resultado = {};

  nomes.forEach(function(nome) {
    resultado[nome] = 0;
  });

  dados.forEach(function(e) {
    resultado[e[campo]] += atraso(e);
  });

  return resultado;
}

function criarGrafico(id, antigo, dados) {
  if (antigo) {
    antigo.destroy();
  }

  return new Chart(pegar(id), {
    type: "bar",
    data: {
      labels: Object.keys(dados),
      datasets: [{
        label: "Dias de atraso",
        data: Object.values(dados)
      }]
    }
  });
}

function mostrarGraficos(dados) {
  var porTransportadora = somar(dados, "transportadora", ["RotaMax", "ViaCargo", "FlashLog"]);
  var porRegiao = somar(dados, "regiao", ["Sudeste", "Sul", "Nordeste", "Norte", "Centro-Oeste"]);

  graficoTransportadora = criarGrafico("graficoTransportadora", graficoTransportadora, porTransportadora);
  graficoRegiao = criarGrafico("graficoRegiao", graficoRegiao, porRegiao);
}

pegar("botaoFiltrar").onclick = atualizarDashboard;

atualizarDashboard();