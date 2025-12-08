import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, X, DollarSign } from 'lucide-react';
import ButtonBack from '../components/buttonBack';

const API_URL = 'http://localhost:3000';

export default function AdminDashboard() {
  const [penghuni, setPenghuni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'password'
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_telp: '',
    alamat: '',
    password: ''
  });
  // Tagihan-related state
  const [kamar, setKamar] = useState([]);
  const [showTagihanModal, setShowTagihanModal] = useState(false);
  const [tagihanForm, setTagihanForm] = useState({
    id_kamar: '',
    id_penghuni: '',
    jatuh_tempo: '',
    jumlah_tagihan: ''
  });
  // User tagihan view + payment
  const [userTagihan, setUserTagihan] = useState([]);
  const [riwayatByTagihan, setRiwayatByTagihan] = useState({});
  const [showUserTagihanModal, setShowUserTagihanModal] = useState(false);
  const [selectedTagihan, setSelectedTagihan] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    tanggal_bayar: '',
    jumlah_dibayar: '',
    metode_bayar: 'Cash',
    keterangan: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get token from localStorage
  const getToken = () => localStorage.getItem('accessToken');

  // Fetch all penghuni
  const fetchPenghuni = async () => {
    try {
      const response = await fetch(`${API_URL}/penghuni`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setPenghuni(data.payload);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Gagal mengambil data penghuni');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch occupied rooms (for tagihan creation)
  const fetchKamar = async () => {
    try {
      const res = await fetch(`${API_URL}/tagihan/kamar/occupied`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) setKamar(data.payload);
    } catch (err) {
      console.error('Gagal mengambil data kamar', err);
    }
  };

  useEffect(() => {
    fetchPenghuni();
    fetchKamar();
  }, []);

  // Fetch tagihan for a specific user (admin view)
  const fetchTagihanForUser = async (id_penghuni) => {
    try {
      const res = await fetch(`${API_URL}/tagihan`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        const list = data.payload.filter(t => String(t.Id_Penghuni) === String(id_penghuni));
        setUserTagihan(list);
        // prefetch riwayat for each tagihan (optional: only fetch when needed)
        // we'll fetch when opening payment for specific tagihan instead to save requests
      } else {
        setError(data.message || 'Gagal mengambil tagihan');
      }
    } catch (err) {
      console.error('Gagal mengambil tagihan', err);
      setError('Gagal mengambil tagihan');
    }
  };

  const closeUserTagihanModal = () => {
    setShowUserTagihanModal(false);
    setUserTagihan([]);
    setSelectedTagihan(null);
    setPaymentForm({ tanggal_bayar: '', jumlah_dibayar: '', metode_bayar: 'Cash', keterangan: '' });
  };

  const openPaymentForTagihan = (tagihan) => {
    // default tanggal_bayar to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setSelectedTagihan(tagihan);
    setPaymentForm({
      tanggal_bayar: `${yyyy}-${mm}-${dd}`,
      jumlah_dibayar: tagihan.Jumlah_Tagihan ?? '',
      metode_bayar: 'Cash',
      keterangan: ''
    });
    // fetch riwayat for this tagihan to show history
    fetchRiwayatForTagihan(tagihan.Id_Tagihan);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedTagihan) {
      setError('Tagihan tidak dipilih');
      return;
    }

    if (!paymentForm.tanggal_bayar || !paymentForm.jumlah_dibayar) {
      setError('Tanggal dan jumlah bayar wajib diisi');
      return;
    }

    try {
      const body = {
        tanggal_bayar: paymentForm.tanggal_bayar,
        jumlah_dibayar: Number(paymentForm.jumlah_dibayar),
        metode_bayar: paymentForm.metode_bayar,
        keterangan: paymentForm.keterangan || null
      };

      const res = await fetch(`${API_URL}/tagihan/${selectedTagihan.Id_Tagihan}/bayar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(data.message || 'Pembayaran berhasil dicatat');
        // refresh tagihan list for user to reflect new status
        if (selectedUser) await fetchTagihanForUser(selectedUser.Id_Penghuni);
        // refresh riwayat for this tagihan so the latest payment appears
        if (selectedTagihan) await fetchRiwayatForTagihan(selectedTagihan.Id_Tagihan);
        // keep modal open briefly to show success, then close payment form
        setTimeout(() => {
          setSelectedTagihan(null);
          setPaymentForm({ tanggal_bayar: '', jumlah_dibayar: '', metode_bayar: 'Cash', keterangan: '' });
          setSuccess('');
        }, 1000);
      } else {
        setError(data.message || 'Gagal mencatat pembayaran');
      }
    } catch (err) {
      console.error('Error saat mencatat pembayaran', err);
      setError('Terjadi kesalahan saat mencatat pembayaran');
    }
  };

  // Fetch riwayat pembayaran for a specific tagihan
  const fetchRiwayatForTagihan = async (id_tagihan) => {
    try {
      const res = await fetch(`${API_URL}/tagihan/riwayat/tagihan/${id_tagihan}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        // store sorted desc by tanggal
        const rows = (data.payload || []).slice().sort((a, b) => new Date(b.Tanggal_Bayar || b.tanggal_bayar || 0) - new Date(a.Tanggal_Bayar || a.tanggal_bayar || 0));
        setRiwayatByTagihan(prev => ({ ...prev, [id_tagihan]: rows }));
      }
    } catch (err) {
      console.error('Gagal mengambil riwayat tagihan', err);
    }
  };

  // Open modal for add/edit
  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setError('');
    setSuccess('');
    
    if (mode === 'add') {
      setFormData({ nama: '', email: '', no_telp: '', alamat: '', password: '' });
    } else if (mode === 'edit' && user) {
      setFormData({ 
        nama: user.Nama, 
        email: user.Email, 
        no_telp: user.No_Telp || '', 
        alamat: user.Alamat || '',
        password: ''
      });
    } else if (mode === 'password' && user) {
      setFormData({ ...formData, password: '' });
    }
    
    setShowModal(true);
  };

  // Open tagihan modal for a specific user
  const openTagihanModal = (user) => {
    setError('');
    setSuccess('');
    // Try to select a kamar that belongs to this penghuni
    const kamarForUser = kamar.find(k => k.Id_Penghuni === user.Id_Penghuni) || null;
    setTagihanForm({
      id_kamar: kamarForUser ? kamarForUser.Id_Kamar : '',
      id_penghuni: user.Id_Penghuni,
      jatuh_tempo: '',
      jumlah_tagihan: kamarForUser ? kamarForUser.Harga : ''
    });
    setSelectedUser(user);
    setShowTagihanModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({ nama: '', email: '', no_telp: '', alamat: '', password: '' });
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let url = `${API_URL}/penghuni`;
      let method = 'POST';
      let body = { ...formData };

      if (modalMode === 'edit') {
        url = `${API_URL}/penghuni/${selectedUser.Id_Penghuni}`;
        method = 'PUT';
        delete body.password; // Don't send password when editing
      } else if (modalMode === 'password') {
        url = `${API_URL}/penghuni/${selectedUser.Id_Penghuni}/password`;
        method = 'PUT';
        body = { password: formData.password };
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          closeModal();
          fetchPenghuni();
        }, 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Terjadi kesalahan');
      console.error(err);
    }
  };

  // Handle delete
  const handleDelete = async (id, nama) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus penghuni "${nama}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/penghuni/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        fetchPenghuni();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message);
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Gagal menghapus penghuni');
      console.error(err);
    }
  };

  // Handle create tagihan submit
  const handleSubmitTagihan = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (!tagihanForm.jatuh_tempo) {
      setError('Jatuh tempo wajib diisi');
      return;
    }

    if (!tagihanForm.jumlah_tagihan || Number(tagihanForm.jumlah_tagihan) <= 0) {
      setError('Jumlah tagihan harus lebih dari 0');
      return;
    }

    try {
      const body = {
        id_kamar: tagihanForm.id_kamar ? tagihanForm.id_kamar : null,
        id_penghuni: tagihanForm.id_penghuni,
        jatuh_tempo: tagihanForm.jatuh_tempo,
        jumlah_tagihan: tagihanForm.jumlah_tagihan ? Number(tagihanForm.jumlah_tagihan) : 0
      };

      const response = await fetch(`${API_URL}/tagihan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          setShowTagihanModal(false);
          fetchPenghuni();
          setSuccess('');
        }, 1200);
      } else {
        setError(data.message || 'Gagal menambahkan tagihan');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat menambahkan tagihan');
    }
  };

  // Filter penghuni based on search
  const filteredPenghuni = penghuni.filter(p => 
    p.Nama.toLowerCase().includes(search.toLowerCase()) ||
    p.Email.toLowerCase().includes(search.toLowerCase()) ||
    (p.No_Telp && p.No_Telp.includes(search))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <ButtonBack />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Manajemen Penghuni
          </h1>
          <p className="text-gray-600">Kelola data penghuni kost</p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}
        {showUserTagihanModal && (
          <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">Tagihan untuk {selectedUser?.Nama}</h2>
                <button
                  onClick={closeUserTagihanModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
                    {success}
                  </div>
                )}

                {userTagihan.length === 0 ? (
                  <div className="text-gray-600">Tidak ada tagihan untuk penghuni ini.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left text-xs text-gray-500 uppercase">
                        <tr>
                          <th className="py-2">ID</th>
                          <th className="py-2">Jatuh Tempo</th>
                          <th className="py-2">Jumlah</th>
                          <th className="py-2">Status</th>
                          <th className="py-2 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {userTagihan.map(t => (
                          <tr key={t.Id_Tagihan} className="hover:bg-gray-50">
                            <td className="py-3">{t.Id_Tagihan}</td>
                            <td className="py-3">{t.Jatuh_Tempo}</td>
                            <td className="py-3">Rp {t.Jumlah_Tagihan}</td>
                            <td className="py-3">{t.Status}</td>
                            <td className="py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openPaymentForTagihan(t)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                  Input Pembayaran
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedTagihan && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Input Pembayaran untuk Tagihan #{selectedTagihan.Id_Tagihan}</h3>
                    <form onSubmit={handleSubmitPayment} className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Tanggal Bayar *</label>
                        <input type="date" value={paymentForm.tanggal_bayar} onChange={(e) => setPaymentForm({...paymentForm, tanggal_bayar: e.target.value})} className="w-full px-3 py-2 border rounded" required />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Jumlah Dibayar (Rp) *</label>
                        <input type="number" value={paymentForm.jumlah_dibayar} onChange={(e) => setPaymentForm({...paymentForm, jumlah_dibayar: e.target.value})} className="w-full px-3 py-2 border rounded" required />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Metode Bayar *</label>
                        <select value={paymentForm.metode_bayar} onChange={(e) => setPaymentForm({...paymentForm, metode_bayar: e.target.value})} className="w-full px-3 py-2 border rounded">
                          <option>Cash</option>
                          <option>Transfer</option>
                          <option>EDC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Keterangan</label>
                        <input type="text" value={paymentForm.keterangan} onChange={(e) => setPaymentForm({...paymentForm, keterangan: e.target.value})} className="w-full px-3 py-2 border rounded" />
                      </div>

                      <div className="flex gap-3 mt-2">
                        <button type="button" onClick={() => { setSelectedTagihan(null); setPaymentForm({ tanggal_bayar: '', jumlah_dibayar: '', metode_bayar: 'Cash', keterangan: '' }); setError(''); setSuccess(''); }} className="flex-1 px-4 py-2 border rounded">Batal</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Bayar</button>
                      </div>
                    </form>
                  </div>
                )}
                {selectedTagihan && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-lg font-medium mb-3">Riwayat Pembayaran (Terbaru)</h4>
                    {(riwayatByTagihan[selectedTagihan.Id_Tagihan] || []).length === 0 ? (
                      <div className="text-gray-600">Belum ada pembayaran untuk tagihan ini.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-left text-xs text-gray-500 uppercase">
                            <tr>
                              <th className="py-2">Tanggal</th>
                              <th className="py-2">Jumlah</th>
                              <th className="py-2">Metode</th>
                              <th className="py-2">Keterangan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {(riwayatByTagihan[selectedTagihan.Id_Tagihan] || []).map(r => (
                              <tr key={r.id_riwayat || r.Id_Riwayat || `${r.tanggal_bayar}-${r.jumlah_dibayar}`} className="hover:bg-gray-50">
                                <td className="py-2">{r.Tanggal_Bayar || r.tanggal_bayar}</td>
                                <td className="py-2">Rp {r.Jumlah_Dibayar || r.jumlah_dibayar}</td>
                                <td className="py-2">{r.Metode_Bayar || r.metode_bayar || '-'}</td>
                                <td className="py-2">{r.Keterangan || r.keterangan || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {showTagihanModal && (
          <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">Tambah Tagihan untuk {selectedUser?.Nama}</h2>
                <button
                  onClick={() => { setShowTagihanModal(false); setSelectedUser(null); setError(''); setSuccess(''); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitTagihan} className="p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
                    {success}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kamar (opsional)</label>
                  <select
                    value={tagihanForm.id_kamar}
                    onChange={(e) => {
                      const val = e.target.value;
                      const selectedKamar = kamar.find(k => String(k.Id_Kamar) === String(val));
                      setTagihanForm({
                        ...tagihanForm,
                        id_kamar: val,
                        jumlah_tagihan: selectedKamar ? selectedKamar.Harga : tagihanForm.jumlah_tagihan
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tidak memilih kamar</option>
                    {kamar.map(k => (
                      <option key={k.Id_Kamar} value={k.Id_Kamar}>
                        {k.Nomor_Kamar} {k.Nama_Penghuni ? `- ${k.Nama_Penghuni}` : ''} ({k.Harga ? `Rp ${k.Harga}` : '-'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jatuh Tempo *</label>
                  <input
                    type="date"
                    value={tagihanForm.jatuh_tempo}
                    onChange={(e) => setTagihanForm({ ...tagihanForm, jatuh_tempo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Tagihan *</label>
                  <input
                    type="number"
                    value={tagihanForm.jumlah_tagihan}
                    onChange={(e) => setTagihanForm({ ...tagihanForm, jumlah_tagihan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowTagihanModal(false); setSelectedUser(null); setError(''); setSuccess(''); }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Tambah Tagihan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {error && !showModal && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Search and Add Button */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari penghuni..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => openModal('add')}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
            >
              <Plus size={20} />
              Tambah Penghuni
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Telp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPenghuni.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data penghuni
                    </td>
                  </tr>
                ) : (
                  filteredPenghuni.map((p) => (
                    <tr key={p.Id_Penghuni} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{p.Nama}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {p.Email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {p.No_Telp || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="max-w-xs truncate">
                          {p.Alamat || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openModal('edit', p)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => openModal('password', p)}
                            className="text-yellow-600 hover:text-yellow-800 p-2 hover:bg-yellow-50 rounded"
                            title="Ubah Password"
                          >
                            🔑
                          </button>
                          <button
                            onClick={() => openTagihanModal(p)}
                            className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded"
                            title="Tambah Tagihan"
                          >
                            <DollarSign size={18} />
                          </button>
                          <button
                            onClick={async () => { setSelectedUser(p); setError(''); setSuccess(''); await fetchTagihanForUser(p.Id_Penghuni); setShowUserTagihanModal(true); }}
                            className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded"
                            title="Lihat Tagihan"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.Id_Penghuni, p.Nama)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  {modalMode === 'add' && 'Tambah Penghuni Baru'}
                  {modalMode === 'edit' && 'Edit Penghuni'}
                  {modalMode === 'password' && 'Ubah Password'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
                    {success}
                  </div>
                )}

                {modalMode !== 'password' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        No. Telepon
                      </label>
                      <input
                        type="text"
                        value={formData.no_telp}
                        onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat
                      </label>
                      <textarea
                        value={formData.alamat}
                        onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {(modalMode === 'add' || modalMode === 'password') && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password {modalMode === 'add' && '*'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={modalMode === 'add'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {modalMode === 'add' && (
                      <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {modalMode === 'add' && 'Tambah'}
                    {modalMode === 'edit' && 'Simpan'}
                    {modalMode === 'password' && 'Ubah Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}