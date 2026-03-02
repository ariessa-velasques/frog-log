'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/components/AuthProvider'
import { createChallenge } from '@/lib/api/challenges'
import { ArrowLeft, Plus, X, Calendar, Hash, Type } from 'lucide-react'
import HandwrittenTitle from '@/components/HandwrittenTitle'
import DatePicker from '@/components/DatePicker'

export default function NewChallengePage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
    const [totalDays, setTotalDays] = useState(31)
    const [customDays, setCustomDays] = useState('')
    const [doRules, setDoRules] = useState<string[]>([''])
    const [dontRules, setDontRules] = useState<string[]>([''])
    const [reminders, setReminders] = useState<string[]>([''])
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    const addRule = (type: 'do' | 'dont') => {
        if (type === 'do') {
            setDoRules([...doRules, ''])
        } else {
            setDontRules([...dontRules, ''])
        }
    }

    const removeRule = (type: 'do' | 'dont', index: number) => {
        if (type === 'do') {
            setDoRules(doRules.filter((_, i) => i !== index))
        } else {
            setDontRules(dontRules.filter((_, i) => i !== index))
        }
    }

    const updateRule = (type: 'do' | 'dont', index: number, value: string) => {
        if (type === 'do') {
            const updated = [...doRules]
            updated[index] = value
            setDoRules(updated)
        } else {
            const updated = [...dontRules]
            updated[index] = value
            setDontRules(updated)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return
        setSubmitting(true)
        setError(null)

        try {
            const days = totalDays === -1 ? parseInt(customDays) : totalDays
            if (!days || days < 1 || days > 365) {
                setError('A duração deve ser entre 1 e 365 dias.')
                setSubmitting(false)
                return
            }

            const id = await createChallenge({
                title: title.trim(),
                start_date: startDate,
                total_days: days,
                doRules: doRules.filter(r => r.trim()),
                dontRules: dontRules.filter(r => r.trim()),
                reminders: reminders.filter(r => r.trim()),
            })
            router.push(`/challenge/${id}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar desafio')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading || !user) return null

    const presetDays = [
        { label: '7 dias', value: 7 },
        { label: '21 dias', value: 21 },
        { label: '31 dias', value: 31 },
        { label: '60 dias', value: 60 },
        { label: '90 dias', value: 90 },
        { label: 'Outro', value: -1 },
    ]

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-stone-200/50">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-white/60 text-stone-500 hover:text-stone-700 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <HandwrittenTitle text="Novo Desafio" as="h1" className="text-2xl!" />
                        <Image src="/sapo2.png" alt="sapo" width={24} height={24} />
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="card-paper p-6 animate-fadeIn">
                        <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
                            <Type size={16} className="text-green-500" />
                            Nome do Desafio
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: No Spend Março, Foco Estudos, 30 Dias Fitness..."
                            required
                            className="w-full px-4 py-3 text-base border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 bg-white/50 text-stone-700 placeholder:text-stone-400"
                        />
                    </div>

                    {/* Date & Duration */}
                    <div className="card-paper p-6 animate-fadeIn" style={{ animationDelay: '0.05s' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <DatePicker
                                    label="Data de Início"
                                    value={startDate}
                                    onChange={setStartDate}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
                                    <Hash size={16} className="text-green-500" />
                                    Duração
                                </label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {presetDays.map(({ label, value }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setTotalDays(value)}
                                            className={`py-2 px-2 text-xs font-medium rounded-lg transition-all duration-200 ${totalDays === value
                                                ? 'bg-green-500 text-white shadow-sm'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                {totalDays === -1 && (
                                    <input
                                        type="number"
                                        value={customDays}
                                        onChange={(e) => setCustomDays(e.target.value)}
                                        placeholder="Número de dias"
                                        min={1}
                                        max={365}
                                        className="w-full mt-2 px-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/50 text-stone-700"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Do Rules */}
                    <div className="card-paper p-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                        <h3 className="font-handwritten text-xl text-green-700 mb-3">
                            ✓ Pode / Permitido
                        </h3>
                        <div className="space-y-2">
                            {doRules.map((rule, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="text-green-500">•</span>
                                    <input
                                        type="text"
                                        value={rule}
                                        onChange={(e) => updateRule('do', index, e.target.value)}
                                        placeholder="Ex: Estudar 2h, Comer frutas, Caminhar..."
                                        className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/50 text-stone-700 placeholder:text-stone-400"
                                    />
                                    {doRules.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRule('do', index)}
                                            className="p-1 text-stone-400 hover:text-red-400 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addRule('do')}
                                className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors mt-1"
                            >
                                <Plus size={14} /> Adicionar regra
                            </button>
                        </div>
                    </div>

                    {/* Don't Rules */}
                    <div className="card-paper p-6 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
                        <h3 className="font-handwritten text-xl text-red-500 mb-3">
                            ✗ Não Pode / Evitar
                        </h3>
                        <div className="space-y-2">
                            {dontRules.map((rule, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="text-red-400">•</span>
                                    <input
                                        type="text"
                                        value={rule}
                                        onChange={(e) => updateRule('dont', index, e.target.value)}
                                        placeholder="Ex: Redes sociais, Doce, Gastar..."
                                        className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 bg-white/50 text-stone-700 placeholder:text-stone-400"
                                    />
                                    {dontRules.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRule('dont', index)}
                                            className="p-1 text-stone-400 hover:text-red-400 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addRule('dont')}
                                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors mt-1"
                            >
                                <Plus size={14} /> Adicionar regra
                            </button>
                        </div>
                    </div>

                    {/* Lembre-se (Reminders) */}
                    <div className="card-paper p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <h3 className="font-handwritten text-xl text-green-700 mb-3 flex items-center gap-2">
                            Lembre-se
                            <Image src="/sapo2.png" alt="sapo" width={20} height={20} />
                        </h3>
                        <p className="text-xs text-stone-400 mb-3">Frases motivacionais para te lembrar nos dias difíceis</p>
                        <div className="space-y-2">
                            {reminders.map((reminder, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Image src="/sapo2.png" alt="sapo" width={16} height={16} className="mt-1 opacity-70" />
                                    <input
                                        type="text"
                                        value={reminder}
                                        onChange={(e) => {
                                            const updated = [...reminders]
                                            updated[index] = e.target.value
                                            setReminders(updated)
                                        }}
                                        placeholder="Ex: Cada real economizado vai te ajudar no futuro"
                                        className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/50 text-stone-700 placeholder:text-stone-400"
                                    />
                                    {reminders.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setReminders(reminders.filter((_, i) => i !== index))}
                                            className="p-1 text-stone-400 hover:text-red-400 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setReminders([...reminders, ''])}
                                className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors mt-1"
                            >
                                <Plus size={14} /> Adicionar lembrete
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={submitting || !title.trim()}
                        className="w-full flex items-center justify-center gap-3 py-4 text-white rounded-xl font-medium text-base shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg, #83d45a, #52a033)', boxShadow: '0 4px 14px rgba(131,212,90,0.4)' }}
                    >
                        {submitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <div className="animate-float">
                                    <Image src="/sapo.png" alt="sapo" width={24} height={24} />
                                </div>
                                Criar Desafio
                            </>
                        )}
                    </button>
                </form>
            </main>
        </div>
    )
}
