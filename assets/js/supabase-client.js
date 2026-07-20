/* ============================================================
   Kampusin — Supabase REST client (zero-dependency)
   ------------------------------------------------------------
   Menggunakan fetch() langsung ke Supabase REST API.
   Tidak butuh npm install, jalan di GitHub Pages (static).

   auth.uid() di Postgres RLS membaca JWT dari header Authorization.
   apikey + Authorization Bearer diperlukan untuk semua request.
   ============================================================ */
(function(window) {
  'use strict';

  // ---------- CONFIG ----------
  // anon key AMAN untuk frontend — keamanan dijaga Row Level Security
  const SUPABASE_URL = 'https://ohviyawkiwacafwodbbr.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odml5YXdraXdhY2Fmd29kYmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NDUyMDksImV4cCI6MjEwMDEyMTIwOX0.tO0VYOYK3WNw4MiA_6oYfER8sLd7c9owsmTtz0qQUW8';

  const REST = SUPABASE_URL + '/rest/v1';
  const AUTH = SUPABASE_URL + '/auth/v1';
  const TOKEN_KEY = 'kampusin_sb_token';

  // ---------- Token storage ----------
  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
  }
  function setToken(t) {
    try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); }
    catch (e) {}
  }

  // ---------- Core fetch ----------
  async function request(path, { method = 'GET', query, body, token } = {}) {
    const url = new URL(path);
    if (query) {
      Object.entries(query).forEach(([k, v]) => {
        // Supabase filter header style: ?key=eq.value
        url.searchParams.set(k, typeof v === 'string' ? v : JSON.stringify(v));
      });
    }
    const headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    const t = token || getToken();
    if (t) headers['Authorization'] = 'Bearer ' + t;

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) return null;
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

    if (!res.ok) {
      const msg = (data && (data.message || data.error || data.msg)) || ('HTTP ' + res.status);
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  // ---------- AUTH ----------
  async function signInWithEmail(email, password) {
    const data = await request(AUTH + '/token?grant_type=password', {
      method: 'POST',
      body: { email, password },
      token: SUPABASE_ANON_KEY, // sebelum login, pakai anon sebagai bearer
    });
    if (data.access_token) setToken(data.access_token);
    return {
      token: data.access_token,
      user: data.user,
      expiresAt: Date.now() + (data.expires_in * 1000),
    };
  }

  function signOut() {
    setToken(null);
    try { localStorage.removeItem('kampusin_session_v1'); } catch (e) {}
  }

  // ---------- DATA ACCESS (REST) ----------
  // Helper: select dari tabel dengan kolom + filter + order
  function from(table) {
    return {
      select(columns = '*', filter = {}, opts = {}) {
        const query = { select: columns };
        Object.entries(filter).forEach(([k, v]) => {
          query[k] = 'eq.' + v;
        });
        if (opts.order) {
          query.order = opts.order.column + '.' + (opts.order.ascending ? 'asc' : 'desc');
        }
        if (opts.limit) query.limit = opts.limit;
        return request(`${REST}/${table}`, { query });
      },
      insert(row) {
        return request(`${REST}/${table}`, { method: 'POST', body: row, query: { select: '*' } });
      },
      update(filter, patch) {
        const query = {};
        Object.entries(filter).forEach(([k, v]) => { query[k] = 'eq.' + v; });
        query.select = '*';
        return request(`${REST}/${table}`, { method: 'PATCH', body: patch, query });
      },
    };
  }

  // ---------- Health check ----------
  async function ping() {
    try {
      // Cuma cek apakah endpoint hidup & key valid
      await request(`${REST}/announcements?select=id&limit=1`, {
        token: SUPABASE_ANON_KEY,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  // ---------- Expose ----------
  window.KampusinBackend = {
    URL: SUPABASE_URL,
    getToken, setToken,
    request,
    signInWithEmail, signOut,
    from,
    ping,
  };

})(window);
