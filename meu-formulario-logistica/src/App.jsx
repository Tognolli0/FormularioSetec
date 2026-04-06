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

    // URL da sua API no Render
    const API_URL = "https://formulariosetec.onrender.com/api/viagens";

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('admin') === 'setec2026') {
            setIsAdmin(true);
            buscarDados();
        }
    }, []);

    const buscarDados = async () => {
        try {
            const res = await fetch(API_URL);
            if (res.ok) {
                const dados = await res.json();
                setViagens(dados);
            }
        } catch (e) {
            console.error("Erro ao buscar dados:", e);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("✅ Logística Gravada com Sucesso!");
                setFormData({
                    hospitalEvento: '', projeto: '', dataVisita: '',
                    especialistaNome: '', espAereo: '', espCarro: '', espOnibus: '', espTaxiTransfer: '', espHotel: '', espStatus: '', espObs: '',
                    medicoNome: '', medAereo: '', medCarro: '', medOnibus: '', medTaxiTransfer: '', medHotel: '', medStatus: '', medObs: ''
                });
                if (isAdmin) buscarDados();
            } else {
                alert("Erro ao salvar: " + res.status);
            }
        } catch (e) {
            alert("Erro de conexão com o servidor.");
        }
        setEnviando(false);
    };

    const exportarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(viagens);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Logistica_Setec");
        XLSX.writeFile(wb, `Relatorio_Setec_${new Date().toLocaleDateString()}.xlsx`);
    };

    const renderLogisticaSection = (prefix, titulo) => {
        const isEsp = prefix === 'esp';
        const nomeKey = isEsp ? 'especialistaNome' : 'medicoNome';
        const color = isEsp ? 'text-orange-500' : 'text-blue-400';

        return (
            <div className="bg-black/40 p-8 rounded-[40px] border border-white/5 shadow-2xl space-y-6 backdrop-blur-sm">
                <h3 className={`text-xl font-black uppercase italic ${color}`}>🔸 Logística: {titulo}</h3>
                <input
                    name={nomeKey}
                    value={formData[nomeKey]}
                    onChange={handleChange}
                    placeholder={`NOME DO CONSULTOR ${titulo.toUpperCase()}`}
                    className="w-full bg-transparent border-b border-slate-800 text-lg font-bold p-2 focus:border-orange-500 outline-none uppercase text-white transition-all"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea name={`${prefix}Aereo`} value={formData[`${prefix}Aereo`]} onChange={handleChange} placeholder="✈️ AVIÃO: Origem/Destino e Horários" className="bg-slate-900/40 p-4 rounded-xl text-xs h-24 border border-white/5 outline-none focus:bg-slate-900/60" />
                    <textarea name={`${prefix}Carro`} value={formData[`${prefix}Carro`]} onChange={handleChange} placeholder="🚗 CARRO: Retirada/Devolução" className="bg-slate-900/40 p-4 rounded-xl text-xs h-24 border border-white/5 outline-none focus:bg-slate-900/60" />
                    <textarea name={`${prefix}Onibus`} value={formData[`${prefix}Onibus`]} onChange={handleChange} placeholder="🚌 ÔNIBUS: Datas e Horários" className="bg-slate-900/40 p-4 rounded-xl text-xs h-24 border border-white/5 outline-none focus:bg-slate-900/60" />
                    <textarea name={`${prefix}Hotel`} value={formData[`${prefix}Hotel`]} onChange={handleChange} placeholder="🏨 HOTEL: Check-in e Check-out" className="bg-slate-900/40 p-4 rounded-xl text-xs h-24 border border-white/5 outline-none focus:bg-slate-900/60" />
                    <input name={`${prefix}TaxiTransfer`} value={formData[`${prefix}TaxiTransfer`]} onChange={handleChange} placeholder="🚖 TÁXI / TRANSFER: Detalhes de agendamento" className="md:col-span-2 bg-slate-900/40 p-4 rounded-xl text-xs border border-white/5 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <input name={`${prefix}Status`} value={formData[`${prefix}Status`]} onChange={handleChange} placeholder="STATUS (Ex: OK)" className="bg-slate-900/50 p-4 rounded-xl text-xs font-black text-orange-500 uppercase" />
                    <textarea name={`${prefix}Obs`} value={formData[`${prefix}Obs`]} onChange={handleChange} placeholder="OBSERVAÇÕES" className="bg-slate-900/50 p-4 rounded-xl text-xs h-14" />
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-10 font-sans text-slate-300 selection:bg-orange-500 selection:text-white">
            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-10">

                <header className="flex justify-between items-center bg-black/50 p-8 rounded-[40px] border border-orange-500/20 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <img src={logoSetec} alt="Setec" className="h-12 w-auto" />
                        <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Setec <span className="text-orange-500">Logística</span></h1>
                    </div>
                    <div className="hidden md:block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sistema Unificado v2.0</div>
                </header>

                {/* DADOS GERAIS */}
                <section className="bg-white/5 p-8 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-inner">
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-orange-500 ml-2">HOSPITAL / EVENTO</label>
                        <input name="hospitalEvento" value={formData.hospitalEvento} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs uppercase text-white focus:border-orange-500 outline-none" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-orange-500 ml-2">PROJETO</label>
                        <input name="projeto" value={formData.projeto} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs uppercase text-white focus:border-orange-500 outline-none" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-orange-500 ml-2">DATA DA VISITA</label>
                        <input name="dataVisita" value={formData.dataVisita} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs uppercase text-white focus:border-orange-500 outline-none" required />
                    </div>
                </section>

                {renderLogisticaSection('esp', 'Especialista')}
                {renderLogisticaSection('med', 'Médico')}

                <button type="submit" disabled={enviando} className="w-full bg-orange-600 hover:bg-orange-500 text-black font-black py-7 rounded-[35px] text-2xl uppercase tracking-tighter shadow-2xl transition-all active:scale-95 disabled:opacity-50">
                    {enviando ? "Processando..." : "Registrar Logística Completa"}
                </button>

                {/* DASHBOARD ADMIN */}
                {isAdmin && (
                    <section className="bg-black/60 border border-white/5 rounded-[40px] p-8 shadow-2xl overflow-hidden backdrop-blur-md">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Monitoramento de Operações</h2>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Controle em Tempo Real</p>
                            </div>
                            <button
                                type="button"
                                onClick={exportarExcel}
                                className="bg-green-600 hover:bg-green-500 text-black font-black px-6 py-3 rounded-2xl text-xs uppercase flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-900/20"
                            >
                                📊 Exportar Relatório Excel
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-900/20">
                            <table className="w-full text-left text-[11px] font-bold uppercase tracking-tighter border-collapse">
                                <thead className="bg-white/5 text-slate-400 text-[9px] tracking-widest">
                                    <tr>
                                        <th className="p-5 border-b border-white/5">Hospital / Projeto</th>
                                        <th className="p-5 border-b border-white/5">Especialista</th>
                                        <th className="p-5 border-b border-white/5">Médico</th>
                                        <th className="p-5 border-b border-white/5 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {viagens.length > 0 ? viagens.map(v => (
                                        <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-5">
                                                <div className="text-white group-hover:text-orange-500 transition-colors">{v.hospitalEvento}</div>
                                                <div className="text-[9px] text-slate-600 italic font-normal">{v.projeto}</div>
                                            </td>
                                            <td className="p-5 text-orange-500 font-black">{v.especialistaNome || "---"}</td>
                                            <td className="p-5 text-blue-400 font-black">{v.medicoNome || "---"}</td>
                                            <td className="p-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[9px] ${v.espStatus?.toUpperCase() === 'OK' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                                                    {v.espStatus || "PENDENTE"}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="p-10 text-center text-slate-600 italic">Buscando registros no banco de dados...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </form>
        </div>
    );
};

export default SetecLogisticaUnificada;