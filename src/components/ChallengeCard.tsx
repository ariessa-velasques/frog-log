'use client'

import Link from 'next/link'
import { Challenge, DailyLog } from '@/lib/types'
import HandwrittenTitle from './HandwrittenTitle'

interface ChallengeCardProps {
    challenge: Challenge
    dailyLogs: DailyLog[]
}

export default function ChallengeCard({ challenge, dailyLogs }: ChallengeCardProps) {
    const completedDays = dailyLogs.filter(l => l.status !== 'pending').length
    const successDays = dailyLogs.filter(l => l.status === 'success').length
    const progressPercent = challenge.total_days > 0 ? Math.round((completedDays / challenge.total_days) * 100) : 0

    // Mini board preview (first 14 days or less)
    const previewDays = dailyLogs.slice(0, 14)

    return (
        <Link href={`/challenge/${challenge.id}`} className="block group">
            <div className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-xl p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-green-200">
                <HandwrittenTitle text={challenge.title} as="h3" className="mb-2 group-hover:text-green-600 transition-colors" />

                <div className="flex items-center gap-3 text-sm text-stone-500 mb-4">
                    <span>Dia {completedDays}/{challenge.total_days}</span>
                    <span>•</span>
                    <span>{successDays} ✓</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-stone-100 rounded-full mb-4 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Mini board grid */}
                <div className="grid grid-cols-7 gap-1">
                    {previewDays.map((log) => (
                        <div
                            key={log.id}
                            className={`w-full aspect-square rounded-sm text-[10px] flex items-center justify-center
                ${log.status === 'success' ? 'bg-green-100 text-green-700' :
                                    log.status === 'fail' ? 'bg-stone-200 text-stone-500' :
                                        'bg-stone-50 border border-stone-200 text-stone-400'
                                }`}
                        >
                            {log.day_number}
                        </div>
                    ))}
                    {dailyLogs.length > 14 && (
                        <div className="w-full aspect-square rounded-sm bg-stone-50 border border-dashed border-stone-200 flex items-center justify-center text-[10px] text-stone-400">
                            +{dailyLogs.length - 14}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
