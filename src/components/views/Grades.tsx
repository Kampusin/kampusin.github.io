import { motion } from 'framer-motion';

export function Grades() {
  const gradesData = [
    { code: 'TI101', course: 'Kalkulus 1', credits: 3, grade: 'A', score: 4.0 },
    { code: 'TI102', course: 'Fisika Dasar', credits: 3, grade: 'B+', score: 3.5 },
    { code: 'TI103', course: 'Algoritma & Pemrograman', credits: 4, grade: 'A', score: 4.0 },
    { code: 'TI104', course: 'Logika Informatika', credits: 3, grade: 'A-', score: 3.75 },
    { code: 'TI105', course: 'Pendidikan Agama', credits: 2, grade: 'A', score: 4.0 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kartu Hasil Studi (KHS)</h2>
          <p className="text-sm text-slate-500 mt-1">Semester Ganjil 2025/2026</p>
        </div>
        <div className="flex gap-4 items-center bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-center px-2 border-r border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-400">IPS</div>
            <div className="font-black text-indigo-600">3.85</div>
          </div>
          <div className="text-center px-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total SKS</div>
            <div className="font-black text-slate-800">15</div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="pb-4 font-semibold text-slate-500 text-sm">Kode</th>
                <th className="pb-4 font-semibold text-slate-500 text-sm">Mata Kuliah</th>
                <th className="pb-4 font-semibold text-slate-500 text-sm text-center">SKS</th>
                <th className="pb-4 font-semibold text-slate-500 text-sm text-center">Nilai Mutu</th>
                <th className="pb-4 font-semibold text-slate-500 text-sm text-center">Indeks</th>
              </tr>
            </thead>
            <tbody>
              {gradesData.map((data, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 text-sm font-medium text-slate-500">{data.code}</td>
                  <td className="py-4 font-bold text-slate-800">{data.course}</td>
                  <td className="py-4 text-center font-medium text-slate-600">{data.credits}</td>
                  <td className="py-4 text-center font-bold text-indigo-600">{data.grade}</td>
                  <td className="py-4 text-center font-medium text-slate-600">{data.score.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="flex flex-col gap-4 md:hidden">
          {gradesData.map((data, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{data.code}</span>
                  <h3 className="font-bold text-slate-800 mt-1">{data.course}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center shrink-0 border border-indigo-100">
                  {data.grade}
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{data.credits}</span> SKS
                </div>
                <div className="text-xs text-slate-500">
                  Indeks: <span className="font-semibold text-slate-700">{data.score.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
