'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { getChallengeWithDetails, deleteChallenge } from '@/lib/api/challenges'
import { ChallengeWithDetails, DailyLog } from '@/lib/types'
import { ArrowLeft, Trash2, Sparkles, CalendarDays, Target } from 'lucide-react'
import HandwrittenTitle from '@/components/HandwrittenTitle'
import BoardGrid from '@/components/BoardGrid'
import RuleCard from '@/components/RuleCard'
import DayLogModal from '@/components/DayLogModal'
import ConfirmModal from '@/components/ConfirmModal'

export default function ChallengeDetailPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [challenge, setChallenge] = useState<ChallengeWithDetails | null>(null)
    const [loadingData, setLoadingData] = useState(true)
    const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    useEffect(() => {
        if (user && id) {
            loadChallenge()
        }
    }, [user, id])

    const loadChallenge = async () => {
        try {
            const data = await getChallengeWithDetails(id)
            if (!data) {
                router.push('/')
                return
            }
            setChallenge(data)
        } catch (err) {
            console.error('Error loading challenge:', err)
        } finally {
            setLoadingData(false)
        }
    }

    const handleDayClick = (log: DailyLog) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const logDate = new Date(log.log_date + 'T00:00:00')
        if (logDate > today) return
        setSelectedLog(log)
    }

    const handleLogUpdate = (updatedLog: DailyLog) => {
        if (!challenge) return
        setChallenge({
            ...challenge,
            daily_logs: challenge.daily_logs.map(l =>
                l.id === updatedLog.id ? updatedLog : l
            ),
        })
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await deleteChallenge(id)
            router.push('/')
        } catch (err) {
            console.error('Error deleting:', err)
            setDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    if (loading || loadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-float">
                    <Sparkles size={48} className="text-pink-400" />
                </div>
            </div>
        )
    }

    if (!challenge || !user) return null

    const doRules = challenge.rules.filter(r => r.type === 'do')
    const dontRules = challenge.rules.filter(r => r.type === 'dont')

    const successCount = challenge.daily_logs.filter(l => l.status === 'success').length
    const failCount = challenge.daily_logs.filter(l => l.status === 'fail').length
    const completedCount = successCount + failCount

    const formattedStart = new Date(challenge.start_date + 'T00:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })

    const reminders = challenge.reminders || []

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-stone-200/50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 rounded-lg hover:bg-white/60 text-stone-500 hover:text-stone-700 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <HandwrittenTitle text={challenge.title} as="h1" className="text-2xl! md:text-3xl!" />
                    </div>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={deleting}
                        className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Excluir desafio"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Stats bar */}
                <div className="card-paper p-4 mb-6 animate-fadeIn">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600">
                        <div className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-pink-400" />
                            <span>Início: {formattedStart}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target size={16} className="text-pink-400" />
                            <span>Dia {completedCount}/{challenge.total_days}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-md bg-pink-300" />
                            <span>{successCount} sucesso{successCount !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-md bg-stone-200 border border-dashed border-red-300" />
                            <span>{failCount} falha{failCount !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-stone-100 rounded-full mt-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-pink-300 to-pink-400 rounded-full transition-all duration-700"
                            style={{ width: `${challenge.total_days > 0 ? (completedCount / challenge.total_days) * 100 : 0}%` }}
                        />
                    </div>
                </div>

                {/* Board — snake path game board */}
                <div className="mb-6 animate-fadeIn overflow-x-auto" style={{ animationDelay: '0.05s' }}>
                    <BoardGrid
                        dailyLogs={challenge.daily_logs}
                        onDayClick={handleDayClick}
                        columns={8}
                    />
                </div>

                {/* Rules */}
                {(doRules.length > 0 || dontRules.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                        {doRules.length > 0 && (
                            <RuleCard title="Pode ✓" rules={doRules} type="do" />
                        )}
                        {dontRules.length > 0 && (
                            <RuleCard title="Não Pode ✗" rules={dontRules} type="dont" />
                        )}
                    </div>
                )}

                {/* Lembre-se (Reminders/Motivations) */}
                {reminders.length > 0 && (
                    <div className="card-paper p-6 mb-6 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
                        <h3 className="font-handwritten text-2xl text-pink-600 mb-4">Lembre-se:</h3>
                        <ul className="space-y-3">
                            {reminders.map((reminder, index) => (
                                <li key={index} className="flex items-start gap-2 text-stone-600">
                                    <span className="text-pink-400 font-bold mt-0.5">✦</span>
                                    <span className="text-sm leading-relaxed">{reminder}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Motivational footer */}
                <div className="card-paper p-6 text-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                    <p className="font-handwritten text-2xl text-pink-500 mb-2">You can do it! ✦</p>
                    <p className="text-sm text-stone-500">
                        Cada dia marcado é um passo mais perto do seu objetivo.
                    </p>
                </div>
            </main>

            {/* Day Log Modal */}
            {selectedLog && (
                <DayLogModal
                    log={selectedLog}
                    onClose={() => setSelectedLog(null)}
                    onUpdate={handleLogUpdate}
                />
            )}

            {/* Delete Confirm Modal */}
            {showDeleteConfirm && (
                <ConfirmModal
                    title="Excluir desafio?"
                    message="Essa ação não pode ser desfeita. Todos os dias e regras serão perdidos."
                    confirmLabel="Excluir"
                    cancelLabel="Cancelar"
                    loading={deleting}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </div>
    )
}
