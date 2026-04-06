import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const logoSetec = "https://media.licdn.com/dms/image/v2/D4D0BAQG8ohr1uOx4zw/company-logo_200_200/company-logo_200_200/0/1727114312808/setec_consulting_group_logo?e=1776297600&v=beta&t=KJ9LiGTLK0GB9nIJL3lqGcfc0qNOr62NxwqDuqh5AqY";

const SetecLogisticaUnificada = () => {
  const [viagens, setViagens] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const [formData, setFormData] = useState({
    hospitalEvento: '', projeto: '', dataVisita: '',
    especialistaNome: '', espAereo: '', espCarro: '', espOnibus: '', espTaxiTransfer: '', espHotel: '', espStatus: '', espObs: '',
    medicoNome: '', medAereo: '', medCarro: '', medOnibus: '', medTaxiTransfer: '', medHotel: '', medStatus: '', medObs: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'setec2026') {
      setIsAdmin(true);
      buscarDados();
    }
  }, []);

  const buscarDados = async () => {
    try {
        const res = await fetch("https://formulariosetec.onrender.com/api/viagens");
      if (res.ok) setViagens(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await fetch("http://localhost:5036/api/viagens", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("✅ Logística Completa Gravada!");
        if (isAdmin) buscarDados();
      }
    } catch (e) { alert("Erro ao salvar."); }
    setEnviando(false);
  };

  const renderLogisticaSection = (prefix, titulo) => {
    const isEsp = prefix === 'esp';
    const nomeKey = isEsp ? 'especialistaNome' : 'medicoNome';
    const color = isEsp ? 'text-orange-500' : 'text-blue-400';

    return (
      <div className="bg-black/40 p-8 rounded-[40px] border border-white/5 shadow-2xl space-y-6">
        <h3 className={`text-xl font-black uppercase italic ${color}`}>🔸 Logística: {titulo}</h3>
        <input 
          name={nomeKey} 
          onChange={handleChange} 
          placeholder={`NOME DO CONSULTOR ${titulo.toUpperCase()}`} 
          className="w-full bg-transparent border-b border-slate-800 text-lg font-bold p-2 focus:border-orange-500 outline-none uppercase text-white" 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea name={`${prefix}Aereo`} onChange={handleChange} placeholder="✈️ AVIÃO: Origem/Destino e Horários (Ida/Volta)" className="bg-slate-900/40 p-4 rounded-xl text-xs h-24 border border-white/5 outline-none" />
          <textarea name={`${prefix}Carro`} onChange={handleChange} placeholder="🚗 CARRO: Retirada/Devolução (Data/Hora/Local)" className="bg-slate-900/40 p-4 rounded-xl text-xs h-24 border border-white/5 outline-none" />
          <textarea name={`${prefix}Onibus`} onChange={handleChange} placeholder="🚌 ÔNIBUS: Origem/Destino e Datas (Ida/Volta)" className="bg-slate-900/40 p-4 rounded-xl text-xs h-24 border border-white/5 outline-none" />
          <textarea name={`${prefix}Hotel`} onChange={handleChange} placeholder="🏨 HOTEL: Check-in, Check-out e Indicação" className="bg-slate-900/40 p-4 rounded-xl text-xs h-24 border border-white/5 outline-none" />
          <input name={`${prefix}TaxiTransfer`} onChange={handleChange} placeholder="🚖 TÁXI / TRANSFER: Detalhes de agendamento" className="md:col-span-2 bg-slate-900/40 p-4 rounded-xl text-xs border border-white/5 outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
          <input name={`${prefix}Status`} onChange={handleChange} placeholder="STATUS (Ex: OK)" className="bg-slate-900/50 p-4 rounded-xl text-xs font-black text-orange-500 uppercase" />
          <textarea name={`${prefix}Obs`} onChange={handleChange} placeholder="OBSERVAÇÕES (Notas da Planilha Cris)" className="bg-slate-900/50 p-4 rounded-xl text-xs h-14" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-10 font-sans text-slate-300">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-10">
        
        <header className="flex justify-between items-center bg-black/50 p-8 rounded-[40px] border border-orange-500/20 shadow-2xl">
          <div className="flex items-center gap-4">
            <img src={logoSetec} alt="Setec" className="h-12 w-auto" />
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Setec <span className="text-orange-500">Logística</span></h1>
          </div>
        </header>

        {/* DADOS GERAIS */}
        <section className="bg-white/5 p-8 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-inner">
          <input name="hospitalEvento" onChange={handleChange} placeholder="HOSPITAL / EVENTO" className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs uppercase text-white" required />
          <input name="projeto" onChange={handleChange} placeholder="PROJETO (Ex: LEAN)" className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs uppercase text-white" required />
          <input name="dataVisita" onChange={handleChange} placeholder="DATA (Ex: 06/04 > 07/04)" className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs uppercase text-white" required />
        </section>

        {/* SEÇÕES DE LOGÍSTICA (UMA ABAIXO DA OUTRA) */}
        {renderLogisticaSection('esp', 'Especialista')}
        {renderLogisticaSection('med', 'Médico')}

        <button type="submit" disabled={enviando} className="w-full bg-orange-600 hover:bg-orange-500 text-black font-black py-7 rounded-[35px] text-2xl uppercase tracking-tighter shadow-2xl transition-all active:scale-95">
          {enviando ? "Processando..." : "Registrar Logística Completa"}
        </button>

        {/* DASHBOARD ADMIN */}
        {isAdmin && (
          <section className="bg-black/60 border border-white/5 rounded-[40px] p-10 shadow-2xl overflow-x-auto">
            <h2 className="text-xl font-black text-white uppercase italic mb-8">Monitoramento de Operações</h2>
            <table className="w-full text-left text-[10px] font-bold uppercase tracking-tighter">
              <thead className="text-slate-500 border-b border-white/5">
                <tr>
                  <th className="p-4">Hospital</th>
                  <th className="p-4">Especialista</th>
                  <th className="p-4">Médico</th>
                  <th className="p-4">Status Esp</th>
                </tr>
              </thead>
              <tbody>
                {viagens.map(v => (
                  <tr key={v.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white">{v.hospitalEvento}</td>
                    <td className="p-4 text-orange-500">{v.especialistaNome}</td>
                    <td className="p-4 text-blue-400">{v.medicoNome}</td>
                    <td className="p-4 text-orange-400">{v.espStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </form>
    </div>
  );
};

export default SetecLogisticaUnificada;