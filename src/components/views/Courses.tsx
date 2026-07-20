import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2 } from 'lucide-react';

export function Courses() {
  const coursesData = [
    { code: 'TI301', course: 'Struktur Data', credits: 2, type: 'Wajib', lecturer: 'Dr. Budi Santoso' },
    { code: 'TI302', course: 'Basis Data Terapan', credits: 2, type: 'Wajib', lecturer: 'Siti Aminah, M.Kom' },
    { code: 'TI303', course: 'Kecerdasan Buatan', credits: 3, type: 'Wajib', lecturer: 'Prof. Dr. Anton' },
    { code: 'TI304', course: 'Sistem Operasi', credits: 3, type: 'Wajib', lecturer: 'Rina Wati, M.Eng' },
    { code: 'TI305', course: 'Rekayasa Perangkat Lunak', credits: 3, type: 'Wajib', lecturer: 'Dr. Joko Widodo' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kartu Rencana Studi (KRS)</h2>
          <p className="text-sm text-slate-500 mt-1">Semester Ganjil 2026/2027</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
          <CheckCircle2 size={14} /> Disetujui Dosen Wali
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coursesData.map((data, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{data.code}</span>
                <span className="text-xs font-semibold text-slate-400">{data.type}</span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{data.course}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <BookOpen size={14} /> {data.credits} SKS
              </div>
              <div className="text-xs text-slate-400 pt-3 border-t border-slate-50">
                Dosen: <span className="font-medium text-slate-600">{data.lecturer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
