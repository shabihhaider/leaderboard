'use client';

import { Trophy, TrendingUp, Award, Clock } from 'lucide-react';
import { User, PointTransaction, LeaderboardEntry } from '@/lib/db';
import { formatNumber, formatDate, RANK_EMOJIS } from '@/lib/utils';

interface Props {
  user: User;
  rank: number;
  history: PointTransaction[];
  leaderboard: LeaderboardEntry[];
}

export default function MemberExperience({ user, rank, history, leaderboard }: Props) {
  const topThreeRank = rank <= 3 ? (rank as 1 | 2 | 3) : null;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2 gradient-text">
          {topThreeRank ? RANK_EMOJIS[topThreeRank] : '🏆'} Your Dashboard
        </h1>
        <p className="text-slate-400">Track your progress and compete with others</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Points */}
        <div className="glass rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <span className="text-sm text-slate-400">Total Points</span>
          </div>
          <p className="text-5xl font-bold gradient-text mb-2">
            {formatNumber(user.total_points)}
          </p>
          <p className="text-sm text-slate-400">Keep earning more!</p>
        </div>

        {/* Current Rank */}
        <div className="glass rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-slate-400">Your Rank</span>
          </div>
          <p className="text-5xl font-bold text-blue-400 mb-2">
            #{rank}
          </p>
          <p className="text-sm text-slate-400">Out of all members</p>
        </div>

        {/* Progress */}
        <div className="glass rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <span className="text-sm text-slate-400">Progress</span>
          </div>
          <p className="text-5xl font-bold text-green-400 mb-2">
            {history.filter(h => h.amount > 0).length}
          </p>
          <p className="text-sm text-slate-400">Points gained</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-purple-400" />
            Recent Activity
          </h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No activity yet</p>
            ) : (
              history.map((transaction) => (
                <div
                  key={transaction.id}
                  className="glass-dark rounded-lg p-4 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-2xl font-bold ${
                        transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </span>
                    {transaction.category_name && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: transaction.category_color + '20',
                          color: transaction.category_color,
                        }}
                      >
                        {transaction.category_name}
                      </span>
                    )}
                  </div>
                  {transaction.reason && (
                    <p className="text-sm text-slate-300 mb-2">{transaction.reason}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Performers */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
            Top 10 Leaderboard
          </h2>
          
          <div className="space-y-2">
            {leaderboard.slice(0, 10).map((entry, index) => {
              const isCurrentUser = entry.whop_user_id === user.whop_user_id;
              const position = index + 1;
              const emoji = position <= 3 ? RANK_EMOJIS[position as 1 | 2 | 3] : null;

              return (
                <div
                  key={entry.id}
                  className={`glass-dark rounded-lg p-3 flex items-center justify-between transition-all ${
                    isCurrentUser ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold w-8 text-center">
                      {emoji || `#${position}`}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {entry.username} {isCurrentUser && '(You)'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-blue-400">
                    {formatNumber(entry.total_points)}
                  </span>
                </div>
              );
            })}
          </div>

          <a
            href="/discover"
            className="block mt-4 text-center py-3 glass-dark rounded-lg hover:bg-slate-700/50 transition-colors text-blue-400 font-medium"
          >
            View Full Leaderboard →
          </a>
        </div>
      </div>
    </div>
  );
}