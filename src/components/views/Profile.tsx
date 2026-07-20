import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, BookOpen, Calendar, Award } from 'lucide-react';

interface ProfileProps {
  profile: any;
}

export function Profile({ profile }: ProfileProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="px-6 md:px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-xl bg-indigo-100 text-indigo-700 font-black text-3xl flex items-center justify-center">
                {profile.avatar || 'NN'}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-900">{profile.full_name}</h2>
              <div className="text-slate-500 font-medium mt-1">{profile.nim} • {profile.prodi}</div>
            </div>
            <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold shadow-sm">
              Status: <span className="text-emerald-400">Aktif</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Informasi Pribadi</h3>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={16} /></div>
                <div>
                  <div className="text-xs text-slate-400">Email</div>
                  <div className="font-medium text-slate-700">mahasiswa@kampusin.ac.id</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={16} /></div>
                <div>
                  <div className="text-xs text-slate-400">Telepon</div>
                  <div className="font-medium text-slate-700">+62 812 3456 7890</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={16} /></div>
                <div>
                  <div className="text-xs text-slate-400">Alamat</div>
                  <div className="font-medium text-slate-700">Yogyakarta, Indonesia</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Informasi Akademik</h3>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Calendar size={16} /></div>
                <div>
                  <div className="text-xs text-slate-400">Tahun Masuk</div>
                  <div className="font-medium text-slate-700">2024</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><BookOpen size={16} /></div>
                <div>
                  <div className="text-xs text-slate-400">Fakultas</div>
                  <div className="font-medium text-slate-700">Ilmu Komputer</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><User size={16} /></div>
                <div>
                  <div className="text-xs text-slate-400">Dosen Wali</div>
                  <div className="font-medium text-slate-700">Dr. Budi Santoso</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
