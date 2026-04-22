import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const logoSetec =
  'https://media.licdn.com/dms/image/v2/D4D0BAQG8ohr1uOx4zw/company-logo_200_200/company-logo_200_200/0/1727114312808/setec_consulting_group_logo?e=1776297600&v=beta&t=KJ9LiGTLK0GB9nIJL3lqGcfc0qNOr62NxwqDuqh5AqY';
const API_URL =
  import.meta.env.VITE_API_URL || 'https://formulariosetec.onrender.com/api/viagens';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'setec2026';

const generalFields = [
  { name: 'hospitalEvento', label: 'Hospital / Evento', placeholder: 'Informe o hospital ou evento' },
  { name: 'projeto', label: 'Projeto', placeholder: 'Informe o nome do projeto' },
  { name: 'dataVisita', label: 'Data da visita', placeholder: 'Ex: 25/04/2026' },
];

const logisticsSections = [
  {
    prefix: 'esp',
    title: 'Especialista',
    nameKey: 'especialistaNome',
    accentClass: 'text-orange-400',
    fields: [
      { type: 'textarea', key: 'Aereo', placeholder: 'Aéreo: origem, destino e horários' },
      { type: 'textarea', key: 'Carro', placeholder: 'Carro: retirada, devolução e observações' },
      { type: 'textarea', key: 'Onibus', placeholder: 'Ônibus: datas e horários' },
      { type: 'textarea', key: 'Hotel', placeholder: 'Hotel: check-in, check-out e observações' },
      { type: 'input', key: 'TaxiTransfer', placeholder: 'Táxi / transfer: detalhes do agendamento', span: true },
    ],
  },
  {
    prefix: 'med',
    title: 'Médico',
    nameKey: 'medicoNome',
    accentClass: 'text-sky-400',
    fields: [
      { type: 'textarea', key: 'Aereo', placeholder: 'Aéreo: origem, destino e horários' },
      { type: 'textarea', key: 'Carro', placeholder: 'Carro: retirada, devolução e observações' },
      { type: 'textarea', key: 'Onibus', placeholder: 'Ônibus: datas e horários' },
      { type: 'textarea', key: 'Hotel', placeholder: 'Hotel: check-in, check-out e observações' },
      { type: 'input', key: 'TaxiTransfer', placeholder: 'Táxi / transfer: detalhes do agendamento', span: true },
    ],
  },
];

const createInitialFormData = () => ({
  hospitalEvento: '',
  projeto: '',
  dataVisita: '',
  especialistaNome: '',
  espAereo: '',
  espCarro: '',
  espOnibus: '',
  espTaxiTransfer: '',
  espHotel: '',
  espStatus: '',
  espObs: '',
  medicoNome: '',
  medAereo: '',
  medCarro: '',
  medOnibus: '',
  medTaxiTransfer: '',
  medHotel: '',
  medStatus: '',
  medObs: '',
});

function App() {
  const [viagens, setViagens] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [carregandoPainel, setCarregandoPainel] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [formData, setFormData] = useState(createInitialFormData);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const adminParam = params.get('admin');

    if (adminParam === ADMIN_KEY) {
      setIsAdmin(true);
      void buscarDados();
    }
  }, []);

  async function buscarDados() {
    setCarregandoPainel(true);
    setAdminError('');

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Falha ao carregar painel (${response.status})`);
      }

      const dados = await response.json();
      setViagens(Array.isArray(dados) ? dados : []);
    } catch (fetchError) {
      console.error(fetchError);
      setAdminError('Não foi possível carregar os registros do painel administrativo.');
    } finally {
      setCarregandoPainel(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleAdminUnlock() {
    if (adminInput.trim() !== ADMIN_KEY) {
      setAdminError('Chave administrativa inválida.');
      return;
    }

    setIsAdmin(true);
    setAdminError('');
    void buscarDados();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMensagem('');
    setErro('');
    setEnviando(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(responseText || `Erro ao salvar (${response.status})`);
      }

      setMensagem('Solicitação registrada com sucesso.');
      setFormData(createInitialFormData());

      if (isAdmin) {
        await buscarDados();
      }
    } catch (submitError) {
      console.error(submitError);
      setErro('Não foi possível registrar a solicitação. Verifique a API e tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  function exportarExcel() {
    const worksheet = XLSX.utils.json_to_sheet(viagens);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Logistica_Setec');
    XLSX.writeFile(workbook, `Relatorio_Setec_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  function renderLogisticaSection(section) {
    return (
      <section
        key={section.prefix}
        className="space-y-6 rounded-[32px] border border-white/8 bg-black/40 p-6 shadow-2xl backdrop-blur-sm md:p-8"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-slate-500">
              Logística
            </span>
            <h2 className={`mt-2 text-2xl font-black ${section.accentClass}`}>{section.title}</h2>
          </div>
          <input
            name={section.nameKey}
            value={formData[section.nameKey]}
            onChange={handleChange}
            placeholder={`Nome do profissional ${section.title.toLowerCase()}`}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500 md:max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {section.fields.map((field) => {
            const name = `${section.prefix}${field.key}`;
            const sharedClassName = `rounded-2xl border border-white/8 bg-slate-900/40 p-4 text-sm text-slate-200 outline-none transition focus:border-orange-500 ${
              field.span ? 'md:col-span-2' : ''
            }`;

            if (field.type === 'textarea') {
              return (
                <textarea
                  key={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`${sharedClassName} min-h-28 resize-y`}
                />
              );
            }

            return (
              <input
                key={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={sharedClassName}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-white/8 pt-4 md:grid-cols-[220px_1fr]">
          <input
            name={`${section.prefix}Status`}
            value={formData[`${section.prefix}Status`]}
            onChange={handleChange}
            placeholder="Status"
            className="rounded-2xl border border-white/8 bg-slate-900/50 p-4 text-sm font-bold uppercase text-orange-400 outline-none transition focus:border-orange-500"
          />
          <textarea
            name={`${section.prefix}Obs`}
            value={formData[`${section.prefix}Obs`]}
            onChange={handleChange}
            placeholder="Observações adicionais"
            className="min-h-24 rounded-2xl border border-white/8 bg-slate-900/50 p-4 text-sm text-slate-200 outline-none transition focus:border-orange-500"
          />
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 font-sans text-slate-300 selection:bg-orange-500 selection:text-white md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-[32px] border border-orange-500/20 bg-black/50 p-6 shadow-2xl md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img src={logoSetec} alt="Setec" className="h-14 w-auto rounded-2xl bg-white p-2" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-orange-400">
                  Operação logística
                </p>
                <h1 className="text-3xl font-black text-white">Formulário Setec</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                  Sistema unificado para registrar viagens, hospedagens e acompanhamentos
                  operacionais em um único fluxo.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-400">
              <p className="font-semibold text-white">Acesso administrativo</p>
              <p className="mt-1">
                Use a chave de administrador para liberar o painel de acompanhamento e exportação.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-inner md:grid-cols-[1fr_auto] md:items-end">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {generalFields.map((field) => (
              <label key={field.name} className="space-y-2">
                <span className="ml-1 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-400">
                  {field.label}
                </span>
                <input
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-white outline-none transition focus:border-orange-500"
                  required
                />
              </label>
            ))}
          </div>

          <div className="space-y-3 md:min-w-72">
            {!isAdmin ? (
              <>
                <div className="flex gap-2">
                  <input
                    value={adminInput}
                    onChange={(event) => setAdminInput(event.target.value)}
                    placeholder="Chave administrativa"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAdminUnlock}
                    className="rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-300 transition hover:bg-orange-500/20"
                  >
                    Entrar
                  </button>
                </div>
                {adminError ? <p className="text-sm text-red-400">{adminError}</p> : null}
              </>
            ) : (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                Painel administrativo liberado.
              </div>
            )}
          </div>
        </section>

        {(mensagem || erro) && (
          <section className="space-y-2">
            {mensagem ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {mensagem}
              </div>
            ) : null}
            {erro ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {erro}
              </div>
            ) : null}
          </section>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {logisticsSections.map(renderLogisticaSection)}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-[28px] bg-orange-600 px-6 py-5 text-lg font-black text-black transition hover:bg-orange-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando ? 'Registrando solicitação...' : 'Registrar logística completa'}
          </button>
        </form>

        {isAdmin && (
          <section className="overflow-hidden rounded-[32px] border border-white/8 bg-black/60 p-6 shadow-2xl backdrop-blur-md md:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-slate-500">
                  Painel administrativo
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">Monitoramento de operações</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Acompanhe os registros gravados e exporte a base para análise.
                </p>
              </div>

              <button
                type="button"
                onClick={exportarExcel}
                disabled={!viagens.length}
                className="rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-black transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Exportar relatório
              </button>
            </div>

            {adminError ? (
              <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {adminError}
              </div>
            ) : null}

            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-900/20">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead className="bg-white/5 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
                  <tr>
                    <th className="p-4">Hospital / Projeto</th>
                    <th className="p-4">Especialista</th>
                    <th className="p-4">Médico</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {carregandoPainel ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500">
                        Carregando registros...
                      </td>
                    </tr>
                  ) : viagens.length ? (
                    viagens.map((viagem) => (
                      <tr key={viagem.id} className="transition hover:bg-white/5">
                        <td className="p-4">
                          <div className="font-semibold text-white">{viagem.hospitalEvento}</div>
                          <div className="mt-1 text-xs text-slate-500">{viagem.projeto}</div>
                        </td>
                        <td className="p-4 font-semibold text-orange-400">
                          {viagem.especialistaNome || '-'}
                        </td>
                        <td className="p-4 font-semibold text-sky-400">
                          {viagem.medicoNome || '-'}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase ${
                              viagem.espStatus?.trim().toUpperCase() === 'OK'
                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                                : 'border-orange-500/20 bg-orange-500/10 text-orange-300'
                            }`}
                          >
                            {viagem.espStatus || 'Pendente'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500">
                        Nenhum registro encontrado até o momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
