'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/components/AuthProvider'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import HandwrittenTitle from '@/components/HandwrittenTitle'

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const { signIn, signUp } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setLoading(true)

        try {
            if (isSignUp) {
                const { error } = await signUp(email, password)
                if (error) {
                    setError(error)
                } else {
                    setSuccess('Conta criada! Verifique seu e-mail para confirmar.')
                }
            } else {
                const { error } = await signIn(email, password)
                if (error) {
                    setError(error)
                } else {
                    router.push('/')
                }
            }
        } catch {
            setError('Ocorreu um erro inesperado.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo area */}
                <div className="text-center mb-8 animate-fadeIn">
                    <div className="inline-block mb-4">
                        <div className="animate-float">
                            <Image src="/sapo.png" alt="sapo" width={144} height={144} priority />
                        </div>
                    </div>
                    <HandwrittenTitle text="FrogLog" className="mb-2" />
                    <p className="text-stone-500 text-sm flex items-center justify-center gap-1">
                        Seu diário de metas gamificado
                        <Image src="/sapo2.png" alt="sapo" width={16} height={16} />
                    </p>
                </div>

                {/* Card */}
                <div className="card-paper p-8 animate-slideUp">
                    {/* Tabs */}
                    <div className="flex mb-6 bg-stone-100 rounded-lg p-1">
                        <button
                            onClick={() => { setIsSignUp(false); setError(null); setSuccess(null) }}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${!isSignUp ? 'bg-white shadow-sm text-green-700' : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => { setIsSignUp(true); setError(null); setSuccess(null) }}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${isSignUp ? 'bg-white shadow-sm text-green-700' : 'text-stone-500 hover:text-stone-700'
                                }`}
                        >
                            Criar Conta
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-600 mb-1.5">
                                E-mail
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 bg-white text-stone-700 placeholder:text-stone-400"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-stone-600 mb-1.5">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 bg-white text-stone-700 placeholder:text-stone-400"
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">
                                {success}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 text-white rounded-xl font-medium shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg, #83d45a, #52a033)', boxShadow: '0 4px 14px rgba(131,212,90,0.4)' }}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? 'Criar Conta' : 'Entrar'}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-stone-400 mt-6">
                    Feito com ♡ para criar hábitos
                </p>
            </div>
        </div >
    )
}
