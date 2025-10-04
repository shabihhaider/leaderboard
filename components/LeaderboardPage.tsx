'use client';

import { useState } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { LeaderboardEntry } from '@/lib/db';
import { formatNumber, RANK_EMOJIS, RANK_COLORS } from '@/lib/utils';

interface Props {
  initialLeaderboard: LeaderboardEntry[];
}

export default function LeaderboardPage({ initialLeaderboard }: Props) {
  const [leaderboard] = useState(initialLeaderboard);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4 gradient-text flex items-center justify-center">
          <Trophy className="w-16 h-16 mr-4 text-yellow-400 animate-bounce-slow" />
          Leaderboard
        </h1>
        <p className="text-xl text-slate-400">
          The top performers in our community
        </p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-12 items-end">
          {/* 2nd Place */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="glass rounded-2xl p-6 text-center card-hover">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                <Medal className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl mb-2">🥈</div>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                {leaderboard[1].username.charAt(0).toUpperCase()}
              </div>
              <p className="font-bold text-lg mb-1">{leaderboard[1].username}</p>
              <p className="text-3xl font-bold text-gray-300">
                {formatNumber(leaderboard[1].total_points)}
              </p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="animate-slide-up">
            <div className={`glass rounded-2xl p-6 text-center card-hover bg-gradient-to-br ${RANK_COLORS[1]} bg-opacity-20`}>
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <div className="text-5xl mb-2">🥇</div>
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-3xl border-4 border-yellow-300">
                {leaderboard[0].username.charAt(0).toUpperCase()}
              </div>
              <p className="font-bold text-xl mb-1">{leaderboard[0].username}</p>
              <p className="text-4xl font-bold text-yellow-300">
                {formatNumber(leaderboard[0].total_points)}
              </p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass rounded-2xl p-6 text-center card-hover">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Medal className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl mb-2">🥉</div>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                {leaderboard[2].username.charAt(0).toUpperCase()}
              </div>
              <p className="font-bold text-lg mb-1">{leaderboard[2].username}</p>
              <p className="text-3xl font-bold text-orange-300">
                {formatNumber(leaderboard[2].total_points)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Rankings */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Full Rankings</h2>
        </div>
        
        <div className="divide-y divide-slate-700">
          {leaderboard.map((entry, index) => {
            const position = index + 1;
            const isTopThree = position <= 3;
            const emoji = isTopThree ? RANK_EMOJIS[position as 1 | 2 | 3] : null;

            return (
              <div
                key={entry.id}
                className={`px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-all ${
                  isTopThree ? 'bg-slate-800/20' : ''
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  {/* Rank */}
                  <div className="w-16 text-center">
                    <span className={`text-3xl font-bold ${isTopThree ? '' : 'text-slate-400'}`}>
                      {emoji || `#${position}`}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                      isTopThree
                        ? `bg-gradient-to-br ${RANK_COLORS[position as 1 | 2 | 3]}`
                        : 'bg-gradient-to-br from-blue-400 to-purple-500'
                    }`}
                  >
                    {entry.username.charAt(0).toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div>
                    <p className={`font-bold text-lg ${isTopThree ? 'text-white' : 'text-slate-200'}`}>
                      {entry.username}
                    </p>
                    {entry.email && (
                      <p className="text-sm text-slate-400">{entry.email}</p>
                    )}
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className={`text-3xl font-bold ${isTopThree ? 'gradient-text' : 'text-blue-400'}`}>
                    {formatNumber(entry.total_points)}
                  </p>
                  <p className="text-sm text-slate-400">points</p>
                </div>
              </div>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 text-lg">No rankings yet</p>
            <p className="text-slate-500 text-sm">Start earning points to appear here!</p>
          </div>
        )}
      </div>

      {/* Fun Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-4xl mb-2">🎯</p>
          <p className="text-2xl font-bold text-white">
            {formatNumber(leaderboard.reduce((sum, e) => sum + e.total_points, 0))}
          </p>
          <p className="text-sm text-slate-400">Total Points Earned</p>
        </div>

        <div className="glass rounded-xl p-6 text-center">
          <p className="text-4xl mb-2">👥</p>
          <p className="text-2xl font-bold text-white">{leaderboard.length}</p>
          <p className="text-sm text-slate-400">Active Members</p>
        </div>

        <div className="glass rounded-xl p-6 text-center">
          <p className="text-4xl mb-2">⚡</p>
          <p className="text-2xl font-bold text-white">
            {leaderboard.length > 0
              ? formatNumber(Math.round(leaderboard.reduce((sum, e) => sum + e.total_points, 0) / leaderboard.length))
              : 0}
          </p>
          <p className="text-sm text-slate-400">Average Points</p>
        </div>
      </div>
    </div>
  );
}