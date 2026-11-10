// Hooks do React usados neste componente:
// - useState: guarda valores que, ao mudar, fazem a tela ser redesenhada
// - useEffect: executa efeitos colaterais (salvar dados, abrir o modal) após a renderização
// - useMemo: evita refazer cálculos pesados enquanto as dependências não mudam
// - useRef: guarda uma referência direta a um elemento do HTML (o <dialog>)
import { useEffect, useMemo, useRef, useState } from "react";
import "./Agendamento.css";

// 1) CONSTANTES -------------------------------------------
// Ficam fora do componente porque nunca mudam: assim não são recriadas a cada renderização.
const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const HORAS = ["07:00", "08:00", "09:00", "10:00", "11:00", "17:00", "18:00", "19:00", "20:00"];

// Quantidade de semanas que podem ser navegadas a partir da semana atual.
const TOTAL_SEMANAS = 4;

// Chave sob a qual as reservas são gravadas no localStorage do navegador.
const STORAGE_KEY = "reservas";

// Estado inicial do formulário. Também é usado para limpar os campos após enviar ou cancelar.
const FORM_VAZIO = { nome: "", email: "", telefone: "" };

// 2) FUNÇÕES AUXILIARES -----------------------------------
// São funções puras: dependem só dos parâmetros e não usam estado do componente.
// Por isso ficam fora dele.

// Calcula a data de um dia da semana exibida.
// semana: 0 = semana atual, 1 = próxima, e assim por diante.
// posicao: 0 = segunda, 1 = terça ... 5 = sábado.
function pegarData(semana, posicao) {
  const hoje = new Date();

  // getDay() retorna 0 para domingo, 1 para segunda ... 6 para sábado.
  // A conta abaixo reorganiza para: segunda = 0, terça = 1 ... domingo = 6.
  const diasDesdeSegunda = (hoje.getDay() + 6) % 7;

  // Parte de hoje, volta até a segunda-feira, avança as semanas e soma a posição do dia.
  // O setDate() corrige sozinho a virada de mês e de ano.
  const data = new Date();
  data.setDate(hoje.getDate() - diasDesdeSegunda + semana * 7 + posicao);

  // Zera a hora para que a data represente apenas o dia.
  data.setHours(0, 0, 0, 0);
  return data;
}

// Converte um objeto Date em texto no formato "16/10/2026".
function formatar(data) {
  // padStart garante dois dígitos: "5" vira "05".
  const dia = String(data.getDate()).padStart(2, "0");
  // getMonth() começa em 0 (janeiro), por isso o + 1.
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${data.getFullYear()}`;
}

// Lê as reservas salvas no navegador.
// O try/catch evita que a página quebre se o localStorage estiver bloqueado
// ou se o conteúdo salvo não for um JSON válido.
function lerReservas() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// 3) COMPONENTE -------------------------------------------
export default function Agendamento() {
  // --- Estados ---
  // Cada useState devolve [valor atual, função para alterar o valor].
  // Chamar a função de alteração faz o React executar o componente de novo.

  // Semana exibida: 0 = esta semana, 1 = próxima...
  const [semana, setSemana] = useState(0);

  // Lista de reservas. Passar a função lerReservas (sem parênteses) faz o React
  // executá-la só na primeira renderização, e não a cada atualização.
  const [reservas, setReservas] = useState(lerReservas);

  // Horário clicado pela pessoa, por exemplo "16/10/2026 17:00".
  // Texto vazio = modal fechado. Texto preenchido = modal aberto.
  const [horarioEscolhido, setHorarioEscolhido] = useState("");

  // Valores digitados no formulário do modal.
  const [form, setForm] = useState(FORM_VAZIO);

  // Mensagem de confirmação exibida abaixo da tabela.
  const [mensagem, setMensagem] = useState("");

  // Controla se a caixa "dados salvos" está visível.
  const [mostrarDados, setMostrarDados] = useState(false);

  // Referência ao elemento <dialog>, necessária para chamar showModal() e close().
  const modalRef = useRef(null);

  // --- Efeitos ---

  // Grava as reservas no localStorage sempre que a lista mudar.
  // O array [reservas] no final define quando o efeito roda.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
    } catch {
      // Sem localStorage disponível, as reservas ficam apenas em memória.
    }
  }, [reservas]);

  // Sincroniza o <dialog> nativo com o estado horarioEscolhido.
  // O React controla o estado; este efeito traduz esse estado em abrir ou fechar o modal.
  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;

    if (horarioEscolhido && !dialog.open) dialog.showModal();
    if (!horarioEscolhido && dialog.open) dialog.close();
  }, [horarioEscolhido]);

  // --- Valores derivados ---
  // São calculados a partir dos estados. Não precisam de useState próprio.

  // Datas das seis colunas da semana exibida.
  // useMemo recalcula somente quando "semana" muda.
  const datas = useMemo(() => DIAS.map((_, i) => pegarData(semana, i)), [semana]);

  // Conjunto com os ids já reservados. Verificar se um id existe em um Set
  // é mais rápido do que percorrer a lista inteira para cada botão da tabela.
  const idsReservados = useMemo(() => new Set(reservas.map((r) => r.id)), [reservas]);

  // Momento atual, usado para bloquear horários que já começaram.
  const agora = new Date();

  // Título da navegação, como "Semana de 19/10 a 24/10".
  // slice(0, 5) mantém só "19/10" do texto "19/10/2026".
  const textoSemana = `Semana de ${formatar(datas[0]).slice(0, 5)} a ${formatar(datas[5]).slice(0, 5)}`;

  // --- Funções de evento ---

  // Fecha o modal e limpa o formulário.
  // Alterar horarioEscolhido para "" aciona o useEffect que chama dialog.close().
  function fecharModal() {
    setHorarioEscolhido("");
    setForm(FORM_VAZIO);
  }

  // Atualiza o campo que foi digitado. Serve para os três inputs.
  // O atributo "name" do input indica qual propriedade do objeto form será alterada.
  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    // Copia o objeto anterior (...anterior) e troca apenas a propriedade alterada.
    // [name] usa o valor da variável como nome da propriedade.
    setForm((anterior) => ({ ...anterior, [name]: value }));
  }

  // Executado quando o formulário é enviado e passa na validação do navegador.
  function enviar(evento) {
    // Impede o comportamento padrão do formulário, que recarregaria a página.
    evento.preventDefault();

    // Cria uma nova lista com as reservas antigas mais a nova.
    // No React o estado não é alterado diretamente (nada de push): sempre se cria uma cópia.
    // O ...form espalha nome, email e telefone dentro do novo objeto.
    setReservas((anterior) => [...anterior, { id: horarioEscolhido, ...form }]);

    setMensagem(`Reserva confirmada para ${horarioEscolhido}!`);
    fecharModal();
  }

  // Apaga todas as reservas do localStorage e da tela.
  function limparReservas() {
    localStorage.removeItem(STORAGE_KEY);
    setReservas([]);
    setMensagem("");
  }

  // 4) JSX (o que será exibido na tela) -------------------
  return (
    // A div com a classe "agendamento" delimita o escopo do CSS do componente.
    <div className="agendamento">
      <main>
        <h1>Agende sua aula experimental</h1>
        <p className="sub">Grátis e sem cadastro. Escolha um horário livre desta semana.</p>

        {/* Legenda de cores. No JSX, style recebe um objeto JavaScript (chaves duplas). */}
        <div className="legenda">
          <span>
            <i style={{ background: "var(--livre)" }} />
            Livre
          </span>
          <span>
            <i style={{ background: "var(--ocupado)" }} />
            Ocupado ou já passou
          </span>
        </div>

        {/* Navegação entre semanas.
            O botão "Anterior" fica desabilitado na semana atual e o "Próxima" na última semana permitida.
            setSemana((s) => s - 1) usa o valor mais recente do estado para calcular o novo. */}
        <div className="nav">
          <button type="button" onClick={() => setSemana((s) => s - 1)} disabled={semana === 0}>
            ← Anterior
          </button>
          <span className="semana-texto">{textoSemana}</span>
          <button
            type="button"
            onClick={() => setSemana((s) => s + 1)}
            disabled={semana === TOTAL_SEMANAS - 1}
          >
            Próxima →
          </button>
        </div>

        {/* Tabela de horários. O div externo permite rolagem horizontal em telas pequenas. */}
        <div className="scroll">
          <table aria-label="Horários da semana">
            <thead>
              <tr>
                {/* Célula vazia no canto superior esquerdo, acima da coluna de horas. */}
                <th />
                {/* Um cabeçalho por dia, com o nome e a data. */}
                {/* O atributo key ajuda o React a identificar cada item da lista. */}
                {DIAS.map((dia, i) => (
                  <th key={dia}>
                    {dia}
                    <small>{formatar(datas[i]).slice(0, 5)}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Uma linha por horário. */}
              {HORAS.map((hora) => (
                <tr key={hora}>
                  <th>{hora}</th>

                  {/* Dentro de cada linha, uma célula por dia da semana. */}
                  {datas.map((data, i) => {
                    // Identificador único do horário, por exemplo "16/10/2026 17:00".
                    const id = `${formatar(data)} ${hora}`;

                    // Monta a data e a hora de início deste horário.
                    // parseInt("17:00", 10) devolve 17, a parte que interessa.
                    const inicio = new Date(data);
                    inicio.setHours(parseInt(hora, 10));

                    // O horário fica indisponível se já foi reservado ou se já começou.
                    // Comparar dois objetos Date com < compara os instantes no tempo.
                    const indisponivel = idsReservados.has(id) || inicio < agora;

                    return (
                      <td key={DIAS[i]}>
                        <button
                          type="button"
                          className="slot"
                          disabled={indisponivel}
                          // Ao clicar, guarda o id escolhido. Isso abre o modal pelo useEffect.
                          onClick={() => setHorarioEscolhido(id)}
                        >
                          {/* Renderização condicional: um texto para cada situação. */}
                          {indisponivel ? "—" : "Livre"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* role="status" e aria-live fazem leitores de tela anunciarem a mensagem quando ela muda. */}
        <div className="status" role="status" aria-live="polite">
          {mensagem}
        </div>

        {/* Botões de apoio para testes. {" "} insere um espaço entre os botões. */}
        <button type="button" className="reset" onClick={limparReservas}>
          Limpar reservas (só para testes)
        </button>{" "}
        <button type="button" className="reset" onClick={() => setMostrarDados((v) => !v)}>
          {/* O texto do botão depende do estado atual. */}
          {mostrarDados ? "Esconder dados salvos" : "Ver dados salvos"}
        </button>

        {/* Renderização condicional com &&: o <pre> só existe quando mostrarDados é true.
            JSON.stringify(valor, null, 2) converte a lista em texto com indentação de 2 espaços. */}
        {mostrarDados && <pre className="dados">{JSON.stringify(reservas, null, 2)}</pre>}
      </main>

      {/* Modal de confirmação, feito com o elemento nativo <dialog>.
          ref liga o elemento ao modalRef.
          onClose dispara quando o modal fecha por qualquer motivo, inclusive pela tecla Esc,
          mantendo o estado do React sincronizado com o que aparece na tela. */}
      <dialog ref={modalRef} onClose={fecharModal}>
        {/* onSubmit só é chamado se todos os campos passarem na validação nativa
            (required, minLength, type="email", pattern). */}
        <form onSubmit={enviar}>
          <h2>Confirmar horário</h2>

          {/* Mostra o horário que a pessoa escolheu. */}
          <div className="resumo">{horarioEscolhido}</div>

          {/* Os três campos são "controlados": o valor exibido vem do estado (value)
              e cada digitação atualiza o estado (onChange). */}
          <label>
            Nome
            <input
              name="nome"
              value={form.nome}
              onChange={atualizarCampo}
              required
              minLength={2}
              autoComplete="name"
            />
          </label>

          <label>
            E-mail
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={atualizarCampo}
              required
              autoComplete="email"
            />
          </label>

          <label>
            Telefone
            <input
              name="telefone"
              type="tel"
              value={form.telefone}
              onChange={atualizarCampo}
              required
              // pattern aceita apenas números, espaços, parênteses, + e hífen, com no mínimo 8 caracteres.
              pattern="[0-9 ()+\-]{8,}"
              // title é o texto exibido pelo navegador quando o pattern não é respeitado.
              title="Use só números, espaços, parênteses ou hífen"
              autoComplete="tel"
            />
          </label>

          {/* Espaço reservado para mensagens de erro do formulário. */}
          <div className="erro-form" />

          <div className="acoes">
            {/* type="button" evita que este botão envie o formulário. */}
            <button type="button" onClick={fecharModal}>
              Cancelar
            </button>
            {/* type="submit" dispara o onSubmit do formulário. */}
            <button type="submit">Reservar</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
