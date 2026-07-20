import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';

export function Schedule() {
  const scheduleData = [
    { day: 'Senin', items: [
      { time: '08:00 - 09:40', course: 'Struktur Data', room: 'Lab Komputer 1', type: 'Praktikum', credits: 2 },
      { time: '10:00 - 11:40', course: 'Basis Data Terapan', room: 'Lab Komputer 2', type: 'Praktikum', credits: 2 },
    ]},
    { day: 'Selasa', items: [
      { time: '08:00 - 10:30', course: 'Kecerdasan Buatan', room: 'Ruang A.3.4', type: 'Teori', credits: 3 },
      { time: '13:00 - 15:30', course: 'Rekayasa Perangkat Lunak', room: 'Ruang B.2.1', type: 'Teori', credits: 3 },
    ]},
    { day: 'Rabu', items: [
      { time: '09:00 - 11:30', course: 'Sistem Operasi', room: 'Ruang A.1.2', type: 'Teori', credits: 3 },
    ]},
    { day: 'Kamis', items: [
      { time: '13:00 - 14:40', course: 'Bahasa Indonesia', room: 'Gedung Utama', type: 'Teori', credits: 2 },
    ]},
    { day: 'Jumat', items: [] },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Jadwal Kuliah Mingguan</h2>
          <p className="text-sm text-slate-500 mt-1">Semester Ganjil 2026/2027</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors">Unduh PDF</button>
        </div>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-8">
          {scheduleData.map((dayData, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="md:w-32 flex-shrink-0">
                <div className="font-bold text-slate-900 text-lg sticky top-6">{dayData.day}</div>
              </div>
              <div className="flex-1 flex flex-col gap-3">
                {dayData.items.length === 0 ? (
                  <div className="text-sm text-slate-400 italic py-2">Tidak ada jadwal kuliah.</div>
                ) : (
                  dayData.items.map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all group bg-white">
                      <div>
                        <div className="font-bold text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors">{item.course}</div>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1"><Clock size={14} /> {item.time}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} /> {item.room}</span>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 flex gap-2 sm:flex-col sm:items-end">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold tracking-wide">{item.type}</span>
                        <span className="text-xs font-semibold text-slate-400">{item.credits} SKS</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
