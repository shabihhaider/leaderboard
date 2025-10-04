'use client';

import { useState } from 'react';
import { Trophy, Plus, Minus, Users, TrendingUp, Search } from 'lucide-react';
import { User, Category } from '@/lib/db';
import { WhopUser } from '@/lib/whop';
import { formatNumber } from '@/lib/utils';
import AddPointsModal from './AddPointsModal';

interface Props {
  users: User[];
  categories: Category[];
  whopMembers: WhopUser[];
  companyId: string;
  adminName: string;
}

export default function AdminDashboard({ users, categories, whopMembers, companyId, adminName }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'add' | 'subtract' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalMembers: users.length,
    totalPoints: users.reduce((sum, u) => sum + u.total_points, 0),
    avgPoints: Math.round(users.reduce((sum, u) => sum + u.total_points, 0) / users.length) || 0,
  };

  const handleOpenModal = (user: User, type: 'add' | 'subtract') => {
    setSelectedUser(user);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  const handleSubmitPoints = async (data: any) => {
    setIsLoading(true);
    try {
      const endpoint = modalType === 'add' ? '/api/points/add' : '/api/points/subtract';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whopUserId: selectedUser?.whop_user_id,
          ...data,
        }),
      });

      if (!response.ok) throw new Error('Failed to update points');
      
      window.location.reload();
    } catch (error) {
      alert('Error updating points. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">
          🎯 Admin Dashboard
        </h1>
        <p className="text-slate-400">Welcome back, {adminName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Members</p>
              <p className="text-3xl font-bold">{stats.totalMembers}</p>
            </div>
            <Users className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Points</p>
              <p className="text-3xl font-bold">{formatNumber(stats.totalPoints)}</p>
            </div>
            <Trophy className="w-12 h-12 text-yellow-400" />
          </div>
        </div>

        <div className="glass rounded-xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-1">Avg Points</p>
              <p className="text-3xl font-bold">{formatNumber(stats.avgPoints)}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-400" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass rounded-xl p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-slate-300">#{index + 1}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.username}</p>
                        <p className="text-sm text-slate-400">{user.email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-2xl font-bold text-blue-400">
                      {formatNumber(user.total_points)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleOpenModal(user, 'add')}
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg mr-2 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </button>
                    <button
                      onClick={() => handleOpenModal(user, 'subtract')}
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4 mr-1" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedUser && modalType && (
        <AddPointsModal
          user={selectedUser}
          type={modalType}
          categories={categories}
          onClose={handleCloseModal}
          onSubmit={handleSubmitPoints}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}