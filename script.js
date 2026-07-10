async function carregarDashboard() {

    try {

        const resposta =
    await fetch('dados/dashboard.json');

        const dados =
            await resposta.json();


// ====================================
// KPI'S OFENSOR DIÁRIO
// ====================================

const totalPecas =
    document.getElementById("totalPecasOfensor");

const totalEnderecos =
    document.getElementById("totalEnderecosOfensor");

const totalPallets =
    document.getElementById("totalPalletsOfensor");

if (totalPecas) {

    totalPecas.innerText =
        formatarNumero(
            dados.resumo_ofensores.pecas
        );

}

if (totalEnderecos) {

    totalEnderecos.innerText =
        formatarNumero(
            dados.resumo_ofensores.enderecos
        );

}

if (totalPallets) {

    totalPallets.innerText =
        formatarNumero(
            dados.resumo_ofensores.pallets
        );

}

        function formatarNumero(valor) {

            return Number(valor).toLocaleString("pt-BR");

        }


// ====================================
// CARDS OFENSORES
// ====================================

const containerOfensores =
    document.getElementById("cardsOfensores");

if (
    containerOfensores &&
    dados.ofensores
) {

    containerOfensores.innerHTML = "";

    dados.ofensores.forEach((item, indice) => {

        containerOfensores.innerHTML += `

            <div class="col-12 mb-4">

                <div
                    class="card p-3"
                    style="
                        border-radius:18px;
                        border-top:6px solid #ffffff;
                        background:#145b78;
                        color:white;
                        box-shadow:0 4px 15px rgba(0,0,0,.15);
                        min-height:400px;
                    "
                >

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:8px;
                            border-bottom:1px solid rgba(255,255,255,.25);
                            padding-bottom:10px;
                            margin-bottom:15px;
                        "
                    >

                        <h4
                            style="
                                margin:0;
                                font-weight:600;
                                color:white;
                            "
                        >

                            👤 ${item.almoxarife.replace(".", " ")}

                        </h4>

                        <span
                            class="badge"
                            style="
                                background:#ffffff;
                                color:#145b78;
                                font-size:11px;
                                font-weight:bold;
                            "
                        >
                            ${item.turno}
                        </span>

                    </div>

                    <div
                        id="kpiOfensor${indice}"
                        style="
                            text-align:center;
                            border-radius:10px;
                            padding:8px;
                            background:white;
                            margin-bottom:20px;
                        "
                    >

                    </div>

                    <div
                        id="graficoOfensor${indice}"
                        class="mt-2"
                        style="
                            display:flex;
                            gap:4px;
                            align-items:flex-end;
                            flex-wrap:wrap;
                            justify-content:center;
                            padding-top:5px;
                        "
                    ></div>

                </div>

            </div>

        `;

    });


// ====================================
// GRÁFICOS OFENSORES
// ====================================

function renderizarGraficosOfensores() {

    const filtro =
        document.getElementById(
            "filtroOfensor"
        );

    const filtroSalvo =
        localStorage.getItem(
            "filtroOfensor"
        );

    if (
        filtro &&
        filtroSalvo
    ) {

        filtro.value =
            filtroSalvo;

    }

    const tipo =
        filtro
            ? filtro.value
            : "pecas";

    dados.ofensores.forEach((item, indice) => {

        const grafico =
            document.getElementById(
                `graficoOfensor${indice}`
            );

        const kpi =
            document.getElementById(
                `kpiOfensor${indice}`
            );

        if (
            !grafico ||
            !kpi
        ) return;

        grafico.innerHTML = "";
        kpi.innerHTML = "";

let campo = "pecas";
let titulo = "🏆 Recorde de Peças";
let data = item.recorde_pecas.data;
let valor = item.recorde_pecas.valor;
let unidade = "peças";
let corBarra = "#FFFFFF";

if (tipo === "enderecos") {

    campo = "enderecos";

    const melhorEndereco = item.historico.reduce(
        (maior, atual) =>
            atual.enderecos > maior.enderecos
                ? atual
                : maior
    );

    titulo =
        "📍 Maior Movimento de Endereços";

    data =
        melhorEndereco.data;

    valor =
        melhorEndereco.enderecos;

    unidade =
        "endereços";

}

else if (tipo === "pallets") {

    campo = "pallets";

    titulo =
        "🚚 Maior Movimento de Pallets";

    data =
        item.recorde_pallets.data;

    valor =
        item.recorde_pallets.valor;

    unidade =
        "pallets";

}

        kpi.innerHTML = `

            <div
                style="
                    font-size:16px;
                    font-weight:bold;
                    color:#222;
                "
            >
                ${titulo}
            </div>

            <div
                style="
                    font-size:13px;
                    color:#777;
                    font-weight:bold;
                "
            >
                ${data}
            </div>

            <div
                style="
                    color:#145b78;
                    font-size:30px;
                    font-weight:bold;
                "
            >
                ${formatarNumero(valor)}
            </div>

            <div
                style="
                    font-size:16px;
                    color:#444;
                    font-weight:bold;
                "
            >
                ${unidade}
            </div>

        `;

        const maiorValor =
            Math.max(
                ...item.historico.map(
                    x => x[campo]
                )
            );

        item.historico.forEach(dia => {

            const altura =
                (dia[campo] / maiorValor) * 180;

            grafico.innerHTML += `

                <div
                    style="
                        min-width:95px;
                        text-align:center;
                    "
                >

                    <div
                        style="
                            display:flex;
                            justify-content:center;
                            align-items:flex-end;
                            height:220px;
                        "
                    >

                        <div>

                            <div
                                style="
                                    font-size:14px;
                                    font-weight:bold;
                                    color:white;
                                    margin-bottom:6px;
                                "
                            >
                                ${formatarNumero(
                                    dia[campo]
                                )}
                            </div>

                            <div
                                style="
                                    width:35px;
                                    height:${altura}px;
                                    background:${corBarra};
                                    border-radius:5px 5px 0 0;
                                "
                            ></div>

                        </div>

                    </div>

                    <div
                        style="
                            margin-top:10px;
                            font-size:12px;
                            font-weight:bold;
                            color:white;
                        "
                    >
                        ${dia.data.substring(0,5)}
                    </div>

                </div>

            `;

        });

    });

}

renderizarGraficosOfensores();

const filtro =
    document.getElementById(
        "filtroOfensor"
    );

if (filtro) {

    filtro.addEventListener(
        "change",
        () => {

            localStorage.setItem(
                "filtroOfensor",
                filtro.value
            );

            renderizarGraficosOfensores();

        }
    );

}

}

        // ==========================
        // KPIs
        // ==========================

        document.getElementById("faturadoB1").innerText =
            formatarNumero(dados.kpis.faturadoB1);

        document.getElementById("faturadoB2").innerText =
            formatarNumero(dados.kpis.faturadoB2);

        document.getElementById("separadoB1").innerText =
            formatarNumero(dados.kpis.separadoB1);

        document.getElementById("separadoB2").innerText =
            formatarNumero(dados.kpis.separadoB2);

        document.getElementById("enderecoB1").innerText =
            formatarNumero(dados.enderecos.b1);

        document.getElementById("enderecoB2").innerText =
            formatarNumero(dados.enderecos.b2);

        document.getElementById("palletsB1").innerText =
            formatarNumero(dados.pallets.b1);

        document.getElementById("palletsB2").innerText =
            formatarNumero(dados.pallets.b2);

document.getElementById("ultimaAtualizacao").innerText =
    dados.ultimaAtualizacao;

    // ==========================
// MAIOR ATRASO
// ==========================

function obterMaiorAtraso(labels, valores) {

    let maiorIndice = 0;
    let maiorDmais = -1;

    labels.forEach((label, indice) => {

        const numero = parseInt(
            String(label).replace("D+", "")
        );

        if (numero > maiorDmais) {

            maiorDmais = numero;
            maiorIndice = indice;

        }

    });

    return {

        label: labels[maiorIndice],

        valor: valores[maiorIndice]

    };

}

const atrasoB1 = obterMaiorAtraso(
    dados.pendenciaB1.labels,
    dados.pendenciaB1.valores
);

const atrasoB2 = obterMaiorAtraso(
    dados.pendenciaB2.labels,
    dados.pendenciaB2.valores
);

document.getElementById("maiorAtrasoB1").innerText =
    atrasoB1.label;

document.getElementById("maiorAtrasoB1Qtde").innerText =
    `${formatarNumero(atrasoB1.valor)} Peças`;

document.getElementById("maiorAtrasoB2").innerText =
    atrasoB2.label;

document.getElementById("maiorAtrasoB2Qtde").innerText =
    `${formatarNumero(atrasoB2.valor)} Peças`;

    // ==========================
// CRITICIDADE MAIOR ATRASO
// ==========================

function obterCriticidade(labelDmais) {

    const numero = parseInt(
        String(labelDmais).replace("D+", "")
    );

    if (numero <= 1) {

        return {
            texto: "🟢 NORMAL",
            classe: "text-success"
        };

    }

    if (numero <= 4) {

        return {
            texto: "🟡 ATENÇÃO",
            classe: "text-white"
        };

    }

         return {
    texto: "🔴 CRÍTICO",
    classe: "text-white"
};
}

const critB1 =
    obterCriticidade(atrasoB1.label);

const critB2 =
    obterCriticidade(atrasoB2.label);

const elCritB1 =
    document.getElementById("criticidadeB1");

elCritB1.innerText =
    critB1.texto;

elCritB1.className =
    `fw-bold ${critB1.classe}`;

const elCritB2 =
    document.getElementById("criticidadeB2");

elCritB2.innerText =
    critB2.texto;

elCritB2.className =
    `fw-bold ${critB2.classe}`;

    // ==========================
// MAIOR VOLUME
// ==========================

function obterMaiorVolume(labels, valores) {

    const maiorValor = Math.max(...valores);

    const indice = valores.indexOf(maiorValor);

    return {

        label: labels[indice],

        valor: maiorValor

    };

}

const volumeB1 = obterMaiorVolume(
    dados.pendenciaB1.labels,
    dados.pendenciaB1.valores
);

const volumeB2 = obterMaiorVolume(
    dados.pendenciaB2.labels,
    dados.pendenciaB2.valores
);

document.getElementById("maiorVolumeB1").innerText =
    volumeB1.label;

document.getElementById("maiorVolumeB1Qtde").innerText =
    `${formatarNumero(volumeB1.valor)} Peças`;

document.getElementById("maiorVolumeB2").innerText =
    volumeB2.label;

document.getElementById("maiorVolumeB2Qtde").innerText =
    `${formatarNumero(volumeB2.valor)} Peças`;

    // ==========================
// CRITICIDADE MAIOR VOLUME
// ==========================

const numeroVolumeB1 =
    parseInt(
        String(volumeB1.label)
            .replace("D+", "")
    );

let textoVolumeB1 = "";
let classeVolumeB1 = "";

if (numeroVolumeB1 <= 1) {

    textoVolumeB1 = "🟢 NORMAL";
    classeVolumeB1 = "text-success";

}
else if (numeroVolumeB1 <= 4) {

    textoVolumeB1 = "🟡 ATENÇÃO";
    classeVolumeB1 = "text-white";

}
else {

    textoVolumeB1 = "🔴 CRÍTICO";
    classeVolumeB1 = "text-danger";

}

const spanVolumeB1 =
    document.getElementById("criticidadeVolumeB1");

if (spanVolumeB1) {

    spanVolumeB1.innerText =
        textoVolumeB1;

    spanVolumeB1.className =
        `fw-bold ${classeVolumeB1}`;

}

// ==========================

const numeroVolumeB2 =
    parseInt(
        String(volumeB2.label)
            .replace("D+", "")
    );

let textoVolumeB2 = "";
let classeVolumeB2 = "";

if (numeroVolumeB2 <= 1) {

    textoVolumeB2 = "🟢 NORMAL";
    classeVolumeB2 = "text-success";

}
else if (numeroVolumeB2 <= 4) {

    textoVolumeB2 = "🟡 ATENÇÃO";
    classeVolumeB2 = "text-white";

}
else {

    textoVolumeB2 = "🔴 CRÍTICO";
    classeVolumeB2 = "text-danger";

}

const spanVolumeB2 =
    document.getElementById("criticidadeVolumeB2");

if (spanVolumeB2) {

    spanVolumeB2.innerText =
        textoVolumeB2;

    spanVolumeB2.className =
        `fw-bold ${classeVolumeB2}`;

}

const container =
    document.getElementById("saudeOperacional");

if (container && dados.metas) {

    container.innerHTML = "";

    indicadores.forEach(item => {

        const meta =
            dados.metas[item.nome] || 0;

        let cor = "success";
        let status = "🟢 Dentro da Meta";

        if (item.atual < meta) {

            if ((meta - item.atual) <= 100) {

                cor = "warning";
                status = "🟡 Atenção";

            }
            else {

                cor = "danger";
                status = "🔴 Crítico";

            }

        }

        container.innerHTML += `

            <div class="col-md-3 mb-3">

                <div class="card border-${cor} h-100">

                    <div class="card-body">

                        <h6>${item.nome}</h6>

                        <p class="mb-1">
                            Meta:
                            <strong>${formatarNumero(meta)}</strong>
                        </p>

                        <p class="mb-2">
                            Atual:
                            <strong>${formatarNumero(item.atual)}</strong>
                        </p>

                        <span class="text-${cor} fw-bold">

                            ${status}

                        </span>

                    </div>

                </div>

            </div>

        `;

    });

}
        // ==========================
        // FATURADO CD1
        // ==========================

new Chart(
    document.getElementById("graficoFaturadoB1"),
    {
        type: "bar",

        data: {

            labels: dados.faturadoB1.labels,

            datasets: [{

                data: dados.faturadoB1.valores,

                backgroundColor: "#FFFFFF",

                borderColor: "#FFFFFF",

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            layout: {

                padding: {

                    top: 25

                }

            },

            plugins: {

                legend: {

                    display: false

                },

                datalabels: {

                    color: "#FFFFFF",

                    anchor: "end",

                    align: "top",

                    font: {

                        weight: "bold",

                        size: 14

                    },

                    formatter: function(value) {

                        return Number(value)
                            .toLocaleString("pt-BR");

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#FFFFFF",

                        font: {

                            weight: "bold",

                            size: 13

                        }

                    },

                    grid: {

                        display: false

                    }

                },

y: {

    display: false,

    grid: {

        display: false

    }

}

            }

        },

        plugins: [ChartDataLabels]

    }
);

        // ==========================
        // FATURADO B2
        // ==========================

new Chart(
    document.getElementById("graficoFaturadoB2"),
    {
        type: "bar",

        data: {

            labels: dados.faturadoB2.labels,

            datasets: [{

                data: dados.faturadoB2.valores,

                backgroundColor: "#FFFFFF",

                borderColor: "#FFFFFF",

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            layout: {

                padding: {

                    top: 25

                }

            },

            plugins: {

                legend: {

                    display: false

                },

                datalabels: {

                    color: "#FFFFFF",

                    anchor: "end",

                    align: "top",

                    font: {

                        weight: "bold",

                        size: 14

                    },

                    formatter: function(value) {

                        return Number(value)
                            .toLocaleString("pt-BR");

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#FFFFFF",

                        font: {

                            weight: "bold",

                            size: 13

                        }

                    },

                    grid: {

                        display: false

                    }

                },

                            y: {

                             display: false,

                             grid: {

                             display: false

                             }

                             }

            }

        },

        plugins: [ChartDataLabels]

    }
);

        // ==========================
        // SEPARAÇÃO CD1
        // ==========================

new Chart(
    document.getElementById("graficoSeparacaoB1"),
    {
        type: "bar",

        data: {

            labels: dados.separacaoB1.labels,

            datasets: [{

                data: dados.separacaoB1.valores,

                backgroundColor: "#FFFFFF",

                borderColor: "#FFFFFF",

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            layout: {

                padding: {

                    top: 25

                }

            },

            plugins: {

                legend: {

                    display: false

                },

                datalabels: {

                    color: "#FFFFFF",

                    anchor: "end",

                    align: "top",

                    font: {

                        weight: "bold",

                        size: 14

                    },

                    formatter: function(value) {

                        return Number(value)
                            .toLocaleString("pt-BR");

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#FFFFFF",

                        font: {

                            weight: "bold",

                            size: 13

                        }

                    },

                    grid: {

                        display: false

                    }

                },

y: {

    display: false,

    grid: {

        display: false

    }

}

            }

        },

        plugins: [ChartDataLabels]

    }
);

        // ==========================
        // SEPARAÇÃO CD2
        // ==========================

new Chart(
    document.getElementById("graficoSeparacaoB2"),
    {
        type: "bar",

        data: {

            labels: dados.separacaoB2.labels,

            datasets: [{

                data: dados.separacaoB2.valores,

                backgroundColor: "#FFFFFF",

                borderColor: "#FFFFFF",

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            layout: {

                padding: {

                    top: 25

                }

            },

            plugins: {

                legend: {

                    display: false

                },

                datalabels: {

                    color: "#FFFFFF",

                    anchor: "end",

                    align: "top",

                    font: {

                        weight: "bold",

                        size: 14

                    },

                    formatter: function(value) {

                        return Number(value)
                            .toLocaleString("pt-BR");

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#FFFFFF",

                        font: {

                            weight: "bold",

                            size: 13

                        }

                    },

                    grid: {

                        display: false

                    }

                },

y: {

    display: false,

    grid: {

        display: false

    }

}


            }

        },

        plugins: [ChartDataLabels]

    }
);

        // ==========================
        // PALLETS CD1
        // ==========================

new Chart(
    document.getElementById("graficoPalletsB1"),
    {
        type: "bar",

        data: {

            labels: dados.palletsB1.labels,

            datasets: [{

                data: dados.palletsB1.valores,

                backgroundColor: "#FFFFFF",

                borderColor: "#FFFFFF",

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            layout: {

                padding: {

                    top: 25

                }

            },

            plugins: {

                legend: {

                    display: false

                },

                datalabels: {

                    color: "#FFFFFF",

                    anchor: "end",

                    align: "top",

                    font: {

                        weight: "bold",

                        size: 14

                    },

                    formatter: function(value) {

                        return Number(value)
                            .toLocaleString("pt-BR");

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#FFFFFF",

                        font: {

                            weight: "bold",

                            size: 13

                        }

                    },

                    grid: {

                        display: false

                    }

                },

y: {

    display: false,

    grid: {

        display: false

    }

}

            }

        },

        plugins: [ChartDataLabels]

    }
);

        // ==========================
        // PALLETS CD2
        // ==========================

new Chart(
    document.getElementById("graficoPalletsB2"),
    {
        type: "bar",

        data: {

            labels: dados.palletsB2.labels,

            datasets: [{

                data: dados.palletsB2.valores,

                backgroundColor: "#FFFFFF",

                borderColor: "#FFFFFF",

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            layout: {

                padding: {

                    top: 25

                }

            },

            plugins: {

                legend: {

                    display: false

                },

                datalabels: {

                    color: "#FFFFFF",

                    anchor: "end",

                    align: "top",

                    font: {

                        weight: "bold",

                        size: 14

                    },

                    formatter: function(value) {

                        return Number(value)
                            .toLocaleString("pt-BR");

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#FFFFFF",

                        font: {

                            weight: "bold",

                            size: 13

                        }

                    },

                    grid: {

                        display: false

                    }

                },

y: {

    display: false,

    grid: {

        display: false

    }

}

            }

        },

        plugins: [ChartDataLabels]

    }
);

        // ==========================
        // TENDÊNCIA CD1
        // ==========================

new Chart(
    document.getElementById("graficoTendenciaB1"),
    {
        type: "line",

        data: { labels: dados.tendenciaB1.labels,

            datasets: [{

                data: dados.tendenciaB1.valores,

                borderColor: "#ffffff",

                backgroundColor: "#ffffff",

                borderWidth: 4,

                tension: 0.3,

                pointRadius: 5,

                pointHoverRadius: 6,

                fill: false

            }]

        },

        options: {

            responsive: true,

            layout: {

                padding: {

                    top: 50

                }

            },

            plugins: {

                legend: {
                    display: false
                },

                 datalabels: {

                color: "#145b78",

                 backgroundColor: "#FFFFFF",

                borderRadius: 4,

                 padding: 4,

                anchor: "end",

                 align: "top",

                offset: 12,

                 font: {

                  weight: "bold",

                size: 13

                 },

                formatter: function(value) {

                 return Number(value)
                 .toLocaleString("pt-BR");

                  }

                }

            },

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    ticks: {

                        color: "#ffffff",

                        font: {

                            weight: "bold",

                            size: 12

                        }

                    }

                },

                y: {

                    display: false,

                    grid: {
                        display: false
                    }

                }

            }

        },

        plugins: [ChartDataLabels]

    }
);
        // ==========================
        // TENDÊNCIA CD2
        // ==========================

new Chart(
    document.getElementById("graficoTendenciaB2"),
    {
        type: "line",

        data: {

            labels: dados.tendenciaB2.labels,

            datasets: [{

                data: dados.tendenciaB2.valores,

                borderColor: "#ffffff",

                backgroundColor: "#ffffff",

                borderWidth: 4,

                tension: 0.3,

                pointRadius: 5,

                pointHoverRadius: 6,

                fill: false

            }]

        },

        options: {

            responsive: true,

            layout: {

                padding: {

                    top: 50

                }

            },

            plugins: {

                legend: {
                    display: false
                },

datalabels: {

    color: "#145b78",

    backgroundColor: "#FFFFFF",

    borderRadius: 4,

    padding: 4,

    anchor: "end",

    align: "top",

    offset: 12,

    font: {

        weight: "bold",

        size: 13

    },

    formatter: function(value) {

        return Number(value)
            .toLocaleString("pt-BR");

    }

}

            },

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    ticks: {

                        color: "#ffffff",

                        font: {

                            weight: "bold",

                            size: 12

                        }

                    }

                },

                y: {

                    display: false,

                    grid: {
                        display: false
                    }

                }

            }

        },

        plugins: [ChartDataLabels]

    }
);
        // ==========================
        // PENDÊNCIA CD1
        // ==========================

new Chart(
    document.getElementById("graficoPendenciaB1"),
    {
        type: "bar",

        data: {

            labels: dados.pendenciaB1.labels,

            datasets: [{

                data: dados.pendenciaB1.valores,

                backgroundColor: dados.pendenciaB1.valores.map(valor =>

                    valor === Math.max(...dados.pendenciaB1.valores)
                        ? "#ff4d4d"
                        : "#FFFFFF"

                ),

                borderColor: dados.pendenciaB1.valores.map(valor =>

                    valor === Math.max(...dados.pendenciaB1.valores)
                        ? "#ff4d4d"
                        : "#FFFFFF"

                ),

                borderWidth: 1

            }]

        },

        options: {

            indexAxis: "y",

            responsive: true,

            layout: {

                padding: {

                    right: 60

                }

            },

            plugins: {

                legend: {

                    display: false

                },

                datalabels: {

                    color: "#FFFFFF",

                    anchor: "end",

                    align: "right",

                    font: {

                        weight: "bold",

                        size: 14

                    },

                    formatter: function(value) {

                        return Number(value)
                            .toLocaleString("pt-BR");

                    }

                }

            },

            scales: {

x: {

    display: false,

    grid: {

        display: false

    }

},

                y: {

                    ticks: {

                        color: "#FFFFFF",

                        font: {

                            weight: "bold",

                            size: 13

                        }

                    },

                    grid: {

                        display: false

                    }

                }

            }

        },

        plugins: [ChartDataLabels]

    }
);

        // ==========================
        // PENDÊNCIA CD2
        // ==========================

new Chart(
    document.getElementById("graficoPendenciaB2"),
    {
        type: "bar",

        data: {

            labels: dados.pendenciaB2.labels,

            datasets: [{

                data: dados.pendenciaB2.valores,

                backgroundColor: dados.pendenciaB2.valores.map(valor =>

                    valor === Math.max(...dados.pendenciaB2.valores)
                        ? "#ff4d4d"
                        : "#FFFFFF"

                ),

                borderColor: dados.pendenciaB2.valores.map(valor =>

                    valor === Math.max(...dados.pendenciaB2.valores)
                        ? "#ff4d4d"
                        : "#FFFFFF"

                ),

                borderWidth: 1

            }]

        },

        options: {

            indexAxis: "y",

            responsive: true,

            layout: {

                padding: {

                    right: 60

                }

            },

            plugins: {

                legend: {

                    display: false

                },

                datalabels: {

                    color: "#FFFFFF",

                    anchor: "end",

                    align: "right",

                    font: {

                        weight: "bold",

                        size: 14

                    },

                    formatter: function(value) {

                        return Number(value)
                            .toLocaleString("pt-BR");

                    }

                }

            },

            scales: {

x: {

    display: false,

    grid: {

        display: false

    }

},

                y: {

                    ticks: {

                        color: "#FFFFFF",

                        font: {

                            weight: "bold",

                            size: 13

                        }

                    },

                    grid: {

                        display: false

                    }

                }

            }

        },

        plugins: [ChartDataLabels]

    }
);

        // ==========================
        // ATUAÇÕES CD1
        // ==========================

        const tabelaB1 =
            document.getElementById("tabelaAtuacaoB1");

        if (tabelaB1 && dados.atuacaoB1) {

            dados.atuacaoB1.forEach(item => {

let status = "";
let classeStatus = "";

if (item.dmais === "D+0" || item.dmais === "D+1") {

    status = `
        <span class="badge bg-success">
            ✅ Normal
        </span>
    `;

}
else if (

    item.dmais === "D+2" ||
    item.dmais === "D+3" ||
    item.dmais === "D+4"

) {

    status = `
        <span class="badge bg-warning text-dark">
            ⚠ Atenção
        </span>
    `;

}
else {

    status = `
        <span class="badge bg-danger">
            🔴 Crítico
        </span>
    `;

}

                tabelaB1.innerHTML += `
                    <tr>
                        <td>${item.data}</td>
                        <td class="${
    item.dmais === 'D+0' || item.dmais === 'D+1'
        ? 'text-success fw-bold'

        : item.dmais === 'D+2' ||
          item.dmais === 'D+3' ||
          item.dmais === 'D+4'
        ? 'text-warning fw-bold'

        : 'text-danger fw-bold'
}">
    ${item.dmais}
</td>
<td>
    ${status}
</td>
                        <td>${item.turno}</td>
                        <td>${item.almoxarife}</td>
                        <td>${formatarNumero(item.qtde)}</td>
                    </tr>
                `;

            });

        }

        // ==========================
        // ATUAÇÕES CD2
        // ==========================

        const tabelaB2 =
            document.getElementById("tabelaAtuacaoB2");

        if (tabelaB2 && dados.atuacaoB2) {

            dados.atuacaoB2.forEach(item => {

let status = "";
let classeStatus = "";

if (item.dmais === "D+0" || item.dmais === "D+1") {

    status = `
        <span class="badge bg-success">
            ✅ Normal
        </span>
    `;

}
else if (

    item.dmais === "D+2" ||
    item.dmais === "D+3" ||
    item.dmais === "D+4"

) {

    status = `
        <span class="badge bg-warning text-dark">
            ⚠ Atenção
        </span>
    `;

}
else {

    status = `
        <span class="badge bg-danger">
            🔴 Crítico
        </span>
    `;

}
                tabelaB2.innerHTML += `
                    <tr>
                        <td>${item.data}</td>
                        <td class="${
    item.dmais === 'D+0' || item.dmais === 'D+1'
        ? 'text-success fw-bold'

        : item.dmais === 'D+2' ||
          item.dmais === 'D+3' ||
          item.dmais === 'D+4'
        ? 'text-warning fw-bold'

        : 'text-danger fw-bold'
}">
    ${item.dmais}
</td>
<td>
    ${status}
</td>
                        <td>${item.turno}</td>
                        <td>${item.almoxarife}</td>
                        <td>${formatarNumero(item.qtde)}</td>
                    </tr>
                `;

            });

        }

    }

    catch (erro) {

        console.error("Erro:", erro);

    }

}

function mostrarPagina(pagina) {

    document.getElementById("paginaHome").style.display =
        "none";

    document.getElementById("paginaIndicadores").style.display =
        "none";

    document.getElementById("paginaOfensor").style.display =
        "none";

    document.getElementById("menuHome")
        .classList.remove("menu-ativo");

    document.getElementById("menuIndicadores")
        .classList.remove("menu-ativo");

    document.getElementById("menuOfensor")
        .classList.remove("menu-ativo");

    if (pagina === "home") {

        document.getElementById("paginaHome").style.display =
            "block";

        document.getElementById("menuHome")
            .classList.add("menu-ativo");

    }

    if (pagina === "indicadores") {

        document.getElementById("paginaIndicadores").style.display =
            "block";

        document.getElementById("menuIndicadores")
            .classList.add("menu-ativo");

    }

    if (pagina === "ofensor") {

        document.getElementById("paginaOfensor").style.display =
            "block";

        document.getElementById("menuOfensor")
            .classList.add("menu-ativo");

    }

}

async function capturarDashboard() {

    alert(
        "Versão Web: captura desabilitada."
    );

    const paginaOfensor =
        document.getElementById(
            "paginaOfensor"
        );

    const paginaIndicadores =
        document.getElementById(
            "paginaIndicadores"
        );

    const estaOfensor =
        paginaOfensor &&
        paginaOfensor.style.display !== "none";

    const elemento =
        estaOfensor
            ? paginaOfensor
            : paginaIndicadores;

    html2canvas(
        elemento,
        {
            scale: 3,
            useCORS: true,
            backgroundColor: null,
            scrollY: -window.scrollY,
            y: -80
        }
    ).then(async canvas => {

        const imagem =
            canvas.toDataURL(
                "image/png"
            );

        let tipo = "indicadores";

        if (estaOfensor) {

            const filtro =
                document.getElementById(
                    "filtroOfensor"
                );

            if (filtro) {

                if (
                    filtro.value === "pecas"
                ) {

                    tipo = "pecas";

                }
                else if (
                    filtro.value === "enderecos"
                ) {

                    tipo = "enderecos";

                }
                else if (
                    filtro.value === "pallets"
                ) {

                    tipo = "pallets";

                }

            }

        }

        try {

            const resposta =
                await fetch(
                    "http://127.0.0.1:5000/salvar_print",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            tipo: tipo,

                            imagem: imagem

                        })

                    }
                );

            const resultado =
                await resposta.json();

            if (
                resultado.sucesso
            ) {

                alert(
                    "✅ Print salvo com sucesso."
                );

            }

            else {

                alert(
                    resultado.erro
                );

            }

        }

        catch (erro) {

            console.error(
                erro
            );

            alert(
                "❌ Erro ao salvar print."
            );

        }

    });

}

// ==========================
// DATA PADRÃO HOME
// ==========================

(function () {

    const ontem = new Date();

    ontem.setDate(
        ontem.getDate() - 1
    );

    const dataFormatada =
        ontem.toISOString()
             .split("T")[0];

    const campo =
        document.getElementById(
            "dataReferencia"
        );

    if (campo) {

        campo.value =
            dataFormatada;

    }

})();

async function atualizarDashboard() {

    const data =
        document.getElementById(
            "dataReferencia"
        ).value;

    const status =
        document.getElementById(
            "statusAtualizacao"
        );

    status.innerHTML =
        "⏳ Atualizando Dashboard...";

    try {

        const resposta =
            await alert(
    "Atualização disponível apenas na versão local.",

                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        data: data
                    })
                }
            );

        console.log(resposta);

        const resultado =
            await resposta.json();

        console.log(resultado);

if (resultado.sucesso) {

    status.innerHTML = `
        <h4 style="color:#7CFC00;">
            ✅ Dashboard Atualizado com Sucesso
        </h4>
        <pre>
${resultado.mensagem}
        </pre>
    `;

}
else {

    status.innerHTML = `
        <h4 style="color:#ff6b6b;">
            ❌ Erro na Atualização
        </h4>
        <pre>
${resultado.erro}
        </pre>
    `;

}

    }

    catch (erro) {

        console.error(erro);

        status.innerHTML =
            "❌ " + erro;

    }

}

// ====================================
// ATUALIZAR OFENSOR DIÁRIO
// ====================================

async function atualizarOfensor() {

    const mes =
        document.getElementById(
            "mesOfensor"
        ).value;

    const status =
        document.getElementById(
            "statusOfensor"
        );

    status.innerHTML =
        "⏳ Atualizando...";

    status.style.background =
        "#ffc107";

    status.style.color =
        "#000";

    try {

        const resposta =
            await alert(
    "Atualização disponível apenas na versão local.",
    
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        mes: mes

                    })

                }
            );

        const resultado =
            await resposta.json();

        if (resultado.sucesso) {

            status.innerHTML =
                "✅ Atualizado";

            status.style.background =
                "#198754";

            status.style.color =
                "#fff";

            carregarDashboard();

        }
else {

    console.log(resultado);

    alert(resultado.erro);

    status.innerHTML =
        "❌ Erro";

    status.style.background =
        "#dc3545";

    status.style.color =
        "#fff";

}

    }

    catch (erro) {

        console.error(erro);

        alert(Erro)

        status.innerHTML =
            "❌ Erro";

        status.style.background =
            "#dc3545";

        status.style.color =
            "#fff";

    }

}

const btnAtualizarOfensor =
    document.getElementById(
        "btnAtualizarOfensor"
    );

if (btnAtualizarOfensor) {

    btnAtualizarOfensor.addEventListener(
        "click",
        atualizarOfensor
    );

}


carregarDashboard();

setTimeout(() => {

    mostrarPagina("Ofensor");

    window.dispatchEvent(
        new Event("resize")
    );

}, 300);
