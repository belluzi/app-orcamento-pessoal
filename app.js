// Criando e Registrando Despesas:

// Criando objeto Despesa:
class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  // Método para validar dados:
  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}

class Bd {
  constructor() {
    // Capturando o ID de LocalStorage:
    let id = localStorage.getItem("id");

    // Verificando para que não seja nulo:
    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  // Método para auto-incrementar o ID:
  getProximoID() {
    let proximoID = localStorage.getItem("id");
    return parseInt(proximoID) + 1; // Incremento de ID
  }

  // Método para gravar em Loc. Stg. o ID e a Despesa:
  gravar(d) {
    let id = this.getProximoID();
    localStorage.setItem(id, JSON.stringify(d)); //Armazenando ID e Objeto 'Despesa'.
    // JSON.stringify() converte Objeto Literal em String para JSON.
    localStorage.setItem("id", id); // Atribuindo o ID.
  }

  // Método para recuperar os registros em Local Storage:
  recuperarRegistros() {
    // Array de Despesas:
    let despesas = Array();

    // Recuperando ID:
    let id = localStorage.getItem("id");

    // Recuperar todas as depesas de Loc. Storage:
    for (let i = 1; i <= id; i++) {
      //Recuperar despesa:
      let despesa = JSON.parse(localStorage.getItem(i)); // Converte String para Objeto Literal

      // Averiguar a possibilidade de nulls:
      // Pular os índices nulos
      if (despesa == null) {
        continue;
      }
      // Adicionando despesas a um array:
      despesa.id = i; // Acrescentando ao array o atributo ID.
      despesas.push(despesa);
    }

    return despesas;
  }

  // Método para pesquisar as despesas:
  pesquisar(despesa) {
    let despesasFiltradas = Array();
    despesasFiltradas = this.recuperarRegistros();

    console.log(despesa);
    console.log(despesasFiltradas);

    // ano
    if (despesa.ano != "") {
      console.log("filtro de ano");
      despesasFiltradas = despesasFiltradas.filter((d) => d.ano == despesa.ano);
    }
    // mes
    if (despesa.mes != "") {
      console.log("filtro de mês");
      despesasFiltradas = despesasFiltradas.filter((d) => d.mes == despesa.mes);
    }
    // dia
    if (despesa.dia != "") {
      console.log("filtro de dia");
      despesasFiltradas = despesasFiltradas.filter((d) => d.dia == despesa.dia);
    }
    // tipo
    if (despesa.tipo != "") {
      console.log("filtro de tipo");
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.tipo == despesa.tipo
      );
    }
    // descricao
    if (despesa.descricao != "") {
      console.log("filtro de descrição");
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.descricao == despesa.descricao
      );
    }
    // valor
    if (despesa.valor != "") {
      console.log("filtro de valor");
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.valor == despesa.valor
      );
    }

    return despesasFiltradas;
  }

  remover(id) {
    localStorage.removeItem(id);
  }
}

// Instanciando o objeto Bd:
let bd = new Bd();

// Função para cadastar despesa e gerar uma nova instância do objeto:
function cadastrarDespesa() {
  // Recuperando os valores digitados em tela:
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  // Gerando nova instância e passando os valores:
  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );

  // Validando valores:
  if (despesa.validarDados()) {
    bd.gravar(despesa);

    // dialog de sucesso
    $("#modalRegistraDespesa").modal("show");
    //Modal Sucesso:
    modModal(true, "Sua despesa foi registrada!");
    limpaCampos();
  } else {
    // dialog de erro
    $("#modalRegistraDespesa").modal("show");
    // Modal Erro:
    modModal(false, "Existem campos não preenchidos.");
  }

  // Limpar campos da aplicação:
  function limpaCampos() {
    // Selecionando elementos da página:
    let campoAno = document.getElementById("ano");
    let campoMes = document.getElementById("mes");
    let campoDia = document.getElementById("dia");
    let campoTipo = document.getElementById("tipo");
    let campoDescricao = document.getElementById("descricao");
    let campoValor = document.getElementById("valor");

    campoAno.value = "";
    campoMes.value = "";
    campoDia.value = "";
    campoTipo.value = "";
    campoDescricao.value = "";
    campoValor.value = "";
  }

  // Manipulando Modal:
  function modModal(estado, mensagemModal) {
    // Selecionando e armazenando elementos:
    corHeader = document.getElementById("modalHeader");
    textoHeader = document.getElementById("modalHeaderText");
    mensagem = document.getElementById("mensagemPrincipal");
    botaoModal = document.getElementById("botaoModal");

    // Alterando valores:
    if (estado == true) {
      corHeader.className = "modal-header text-success"; // Cor do Texto Header
      textoHeader.textContent = "Registro Inserido com Sucesso"; // Texto do Header
      mensagem.textContent = mensagemModal; // Mensagem do Modal
      botaoModal.className = "btn btn-success"; // Botão
      botaoModal.textContent = "Ok"; // Texto do Botão
    } else {
      corHeader.className = "modal-header text-danger"; // Cor do Texto Header
      textoHeader.textContent = "Erro no Registro"; // Texto do Header
      mensagem.textContent = mensagemModal; // Mensagem do Modal
      botaoModal.className = "btn btn-danger"; // Botão
      botaoModal.textContent = "Voltar e corrigir"; // Texto do Botão
    }
  }
}

// Listando Despesas:

function carregaListaDespesas(despesas = Array(), filtro = false) {
  if (despesas.length == 0 && filtro == false) {
    despesas = bd.recuperarRegistros();
  }

  // Selecionando o elemento <tbody> da tabela:
  let tabelaDespesas = document.getElementById("listaDeDespesas");
  // Limpando a tabela <tbody>:
  tabelaDespesas.innerHTML = "";

  // Percorrer o array 'despesas', listando cada uma de forma dinâmica:
  despesas.forEach(function (d) {
    // Criando a linha (tr):
    let linha = tabelaDespesas.insertRow();
    // Criando as colunas (td):
    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

    switch (parseInt(d.tipo)) {
      case 1:
        d.tipo = "Alimentação";
        break;
      case 2:
        d.tipo = "Educação";
        break;
      case 3:
        d.tipo = "Lazer";
        break;
      case 4:
        d.tipo = "Saúde";
        break;
      case 5:
        d.tipo = "Transporte";
        break;
    }

    linha.insertCell(1).innerHTML = d.tipo;
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;

    // Criando o botão de exclusão:
    let btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.id = "id_despesa_" + d.id;
    btn.onclick = function () {
      // Remover a despesa.
      let id = this.id.replace("id_despesa_", "");
      bd.remover(id);
      // Atualizar a página em seguida:
      window.location.reload();
    };
    linha.insertCell(4).append(btn);
  });
}

// Filtrando as despesas listadas:
function pesquisarDespesa() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );

  let despesas = bd.pesquisar(despesa);

  this.carregaListaDespesas(despesas, true);
}
