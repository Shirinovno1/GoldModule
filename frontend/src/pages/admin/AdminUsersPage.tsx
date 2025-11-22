import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { ProtectedRoute } from '../../components/ProtectedRoute';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  createdAt: string;
  lastLogin?: string;
}

export const AdminUsersPage = () => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin',
  });

  // Fetch admin users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get('/admin/users');
      return response.data.data.users;
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof formData) => {
      const response = await api.post('/admin/users', userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowCreateForm(false);
      setShowPassword(false);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
      alert('İstifadəçi uğurla yaradıldı!');
    },
    onError: (error: any) => {
      alert('Xəta: ' + (error.response?.data?.error?.message || 'Naməlum xəta'));
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: Partial<typeof formData> }) => {
      const response = await api.put(`/admin/users/${id}`, userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setEditingUser(null);
      setShowPassword(false);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
      alert('İstifadəçi uğurla yeniləndi!');
    },
    onError: (error: any) => {
      alert('Xəta: ' + (error.response?.data?.error?.message || 'Naməlum xəta'));
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      alert('İstifadəçi uğurla silindi!');
    },
    onError: (error: any) => {
      alert('Xəta: ' + (error.response?.data?.error?.message || 'Naməlum xəta'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser._id, userData: formData });
    } else {
      createUserMutation.mutate(formData);
    }
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowCreateForm(true);
  };

  const handleDelete = (user: AdminUser) => {
    if (confirm(`"${user.name}" istifadəçisini silmək istədiyinizə əminsiniz?`)) {
      deleteUserMutation.mutate(user._id);
    }
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingUser(null);
    setShowPassword(false);
    setFormData({ name: '', email: '', password: '', role: 'admin' });
  };

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">İstifadəçi İdarəsi</h1>
            <p className="text-gray-400">Admin istifadəçilərini idarə edin</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-black rounded-xl font-semibold hover-lift shadow-lg flex items-center gap-2"
          >
            <span className="material-symbols-outlined">person_add</span>
            Yeni İstifadəçi
          </button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="glass rounded-3xl p-8 border-2 border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingUser ? 'İstifadəçini Redaktə Et' : 'Yeni İstifadəçi Yarat'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Ad</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Şifrə {editingUser && '(boş buraxın dəyişmək istəmirsinizsə)'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-primary"
                      required={!editingUser}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Rol</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'super_admin' })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-black rounded-xl font-semibold hover-lift shadow-lg disabled:opacity-50"
                >
                  {editingUser ? 'Yenilə' : 'Yarat'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  Ləğv Et
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        <div className="glass rounded-3xl p-8 border-2 border-primary/20">
          <h2 className="text-2xl font-bold text-white mb-6">İstifadəçilər</h2>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-white">Yüklənir...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Heç bir istifadəçi tapılmadı</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-white font-semibold">Ad</th>
                    <th className="text-left py-4 px-4 text-white font-semibold">Email</th>
                    <th className="text-left py-4 px-4 text-white font-semibold">Rol</th>
                    <th className="text-left py-4 px-4 text-white font-semibold">Yaradılma Tarixi</th>
                    <th className="text-left py-4 px-4 text-white font-semibold">Son Giriş</th>
                    <th className="text-left py-4 px-4 text-white font-semibold">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: AdminUser) => (
                    <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-4 px-4 text-white font-medium">{user.name}</td>
                      <td className="py-4 px-4 text-gray-300">{user.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'super_admin' 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString('az-AZ')}
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('az-AZ') : 'Heç vaxt'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Redaktə et"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};