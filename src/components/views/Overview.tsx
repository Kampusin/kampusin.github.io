import { motion } from 'framer-motion';
import { Award, BookOpen, Calendar, Megaphone, CreditCard, ChevronRight } from 'lucide-react';

export function Overview() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
    >
      {/* Card 1 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow xl:col-span-2">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-semibold text-slate-500">IPK Kumulatif</h3>
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award size={20} />
          </div>
        </div>
        <div className="text-5xl font-black mb-2">3.72</div>
        <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">+0.14</span> dari semester lalu
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-semibold text-slate-500">SKS Lulus</h3>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <BookOpen size={20} />
          </div>
        </div>
        <div className="text-5xl font-black mb-2">84<span className="text-xl text-slate-400">/144</span></div>
        <div className="text-sm font-medium text-slate-500">
          Semester 4 • TI
        </div>
      </div>

      {/* Card 3 - Schedule */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow xl:col-span-2 row-span-2 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-semibold text-slate-500">Jadwal Hari Ini</h3>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar size={20} />
          </div>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          {[
            { time: '08:00', name: 'Struktur Data', room: 'Lab Komputer 1', color: 'bg-indigo-500' },
            { time: '10:00', name: 'Basis Data Terapan', room: 'Lab Komputer 2', color: 'bg-amber-500' },
            { time: '13:00', name: 'Kecerdasan Buatan', room: 'Ruang A.3.4', color: 'bg-emerald-500' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
              <div className={`w-1 h-10 rounded-full ${s.color}`}></div>
              <div className="flex-1">
                <div className="font-bold text-sm">{s.name}</div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>{s.time}</span> • <span>{s.room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 4 - Announcements */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow xl:col-span-2 row-span-2">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-semibold text-slate-500">Pengumuman Akademik</h3>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Megaphone size={20} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="group cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold tracking-wider uppercase">Penting</span>
              <span className="text-xs text-slate-400">20 Jul 2026</span>
            </div>
            <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Batas Akhir Pembayaran UKT Semester Ganjil</h4>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">Pembayaran Uang Kuliah Tunggal (UKT) semester ganjil tahun akademik 2026/2027 diperpanjang hingga tanggal 10 Agustus 2026.</p>
          </div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="group cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold tracking-wider uppercase">Akademik</span>
              <span className="text-xs text-slate-400">18 Jul 2026</span>
            </div>
            <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Jadwal Pengisian KRS (Kartu Rencana Studi)</h4>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">Pengisian KRS bagi mahasiswa angkatan 2023 dan 2024 akan dibuka mulai tanggal 1 Agustus 2026 melalui portal akademik terpadu.</p>
          </div>
        </div>
        <button className="mt-6 text-sm font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
          Semua pengumuman <ChevronRight size={16} />
        </button>
      </div>

      {/* Card 5 - Tuition Bill */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden xl:col-span-2">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <CreditCard size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-semibold text-slate-500">Tagihan UKT Aktif</h3>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">Belum Lunas</span>
          </div>
          <div className="text-xs text-slate-500 mb-1">Semester Ganjil 2026/2027</div>
          <div className="text-4xl font-black text-slate-900 mb-6">Rp 4.500.000</div>
          
          <div className="flex gap-3">
            <button className="flex-1 bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-colors">
              Bayar Sekarang
            </button>
            <button className="px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors border border-slate-200">
              Rincian
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
