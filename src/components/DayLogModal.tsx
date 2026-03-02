'use client'

import { useState } from 'react'
import { X, Check, XCircle } from 'lucide-react'
import { DailyLog, DayStatus } from '@/lib/types'
import { updateDayStatus } from '@/lib/api/daily-logs'

interface DayLogModalProps {
    log: DailyLog
    onClose: () => void
    onUpdate: (updatedLog: DailyLog) => void
}

export default function DayLogModal({ log, onClose, onUpdate }: DayLogModalProps) {
    const [notes, setNotes] = useState(log.notes || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleStatus = async (status: DayStatus) => {
        setLoading(true)
        setError(null)
        try {
            const updated = await updateDayStatus(log.id, status, notes)
            onUpdate(updated)
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao atualizar')
        } finally {
            setLoading(false)
        }
    }

    const formattedDate = new Date(log.log_date + 'T00:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
    })

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-slideUp">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-5">
                    <h3 className="font-handwritten text-2xl text-green-700">
                        Dia {log.day_number}
                    </h3>
                    <p className="text-sm text-stone-500 mt-1">{formattedDate}</p>
                </div>

                {/* Notes */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-stone-600 mb-2">
                        📝 Diário de bordo
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Como foi o dia? Ex: Fui pra academia hoje..."
                        className="w-full p-3 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 resize-none bg-stone-50/50 text-stone-700 placeholder:text-stone-400"
                        rows={3}
                    />
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-500 text-sm text-center mb-3">{error}</p>
                )}

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleStatus('success')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl font-medium text-sm shadow-sm hover:shadow-md hover:from-green-500 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
                    >
                        <Check size={18} />
                        Sucesso!
                    </button>
                    <button
                        onClick={() => handleStatus('fail')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-stone-100 text-stone-600 rounded-xl font-medium text-sm border border-stone-200 hover:bg-stone-200 transition-all duration-200 disabled:opacity-50"
                    >
                        <XCircle size={18} />
                        Falha
                    </button>
                </div>

                {/* Already filled? Allow reset */}
                {log.status !== 'pending' && (
                    <button
                        onClick={() => handleStatus('pending')}
                        disabled={loading}
                        className="w-full mt-3 py-2 text-xs text-stone-400 hover:text-stone-600 transition-colors"
                    >
                        Desfazer marcação
                    </button>
                )}
            </div>
        </div>
    )
}
