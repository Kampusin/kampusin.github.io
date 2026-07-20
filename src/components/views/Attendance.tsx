import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export function Attendance() {
  const attendanceData = [
    { course: 'Struktur Data', present: 12, absent: 1, permit: 0, total: 14 },
    { course: 'Basis Data Terapan', present: 13, absent: 0, permit: 0, total: 14 },
    { course: 'Kecerdasan Buatan', present: 10, absent: 2, permit: 1, total: 14 },
    { course: 'Sistem Operasi', present: 14, absent: 0, permit: 0, total: 14 },
    { course: 'Rekayasa Perangkat Lunak', present: 11, absent: 1, permit: 0, total: 14 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-900">Rekapitulasi Absensi</h2>
        <p className="text-sm text-slate-500 mt-1">Syarat kehadiran minimal untuk mengikuti ujian adalah 75%.</p>
      </div>

      <div className="p-4 md:p-8">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="pb-4 font-semibold text-slate-500 text-sm w-1/3">Mata Kuliah</th>
                <th className="pb-4 font-semibold text-slate-500 text-sm text-center">Hadir</th>
                <th className="pb-4 font-semibold text-slate-500 text-sm text-center">Izin/Sakit</th>
                <th className="pb-4 font-semibold text-slate-500 text-sm text-center">Alpa</th>
                <th className="pb-4 font-semibold text-slate-500 text-sm text-right">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((data, idx) => {
                const percentage = Math.round((data.present / data.total) * 100);
                let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
                let Icon = CheckCircle2;
                
                if (percentage < 75) {
                  statusColor = 'text-red-600 bg-red-50 border-red-100';
                  Icon = XCircle;
                } else if (percentage < 85) {
                  statusColor = 'text-amber-600 bg-amber-50 border-amber-100';
                  Icon = AlertCircle;
                }

                return (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 font-bold text-slate-800">{data.course}</td>
                    <td className="py-5 text-center font-medium text-slate-600">{data.present}</td>
                    <td className="py-5 text-center font-medium text-slate-600">{data.permit}</td>
                    <td className="py-5 text-center font-medium text-slate-600">{data.absent}</td>
                    <td className="py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-sm font-bold flex items-center gap-1.5 border ${statusColor}`}>
                          <Icon size={16} />
                          {percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="flex flex-col gap-4 md:hidden">
          {attendanceData.map((data, idx) => {
            const percentage = Math.round((data.present / data.total) * 100);
            let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
            let Icon = CheckCircle2;
            
            if (percentage < 75) {
              statusColor = 'text-red-600 bg-red-50 border-red-100';
              Icon = XCircle;
            } else if (percentage < 85) {
              statusColor = 'text-amber-600 bg-amber-50 border-amber-100';
              Icon = AlertCircle;
            }

            return (
              <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800 pr-2 leading-tight">{data.course}</h3>
                  <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border ${statusColor}`}>
                    <Icon size={14} />
                    {percentage}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm pt-2">
                  <div className="flex flex-col items-center p-2 bg-slate-50 rounded-xl w-[31%] border border-slate-100">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Hadir</span>
                    <span className="font-black text-slate-700">{data.present}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-slate-50 rounded-xl w-[31%] border border-slate-100">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Izin</span>
                    <span className="font-black text-slate-700">{data.permit}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-slate-50 rounded-xl w-[31%] border border-slate-100">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Alpa</span>
                    <span className="font-black text-slate-700">{data.absent}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
