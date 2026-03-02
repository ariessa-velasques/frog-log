'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, LogOut, Sparkles } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { getChallenges } from '@/lib/api/challenges'
import { createClient } from '@/lib/supabase'
import { Challenge, DailyLog } from '@/lib/types'
import ChallengeCard from '@/components/ChallengeCard'
import HandwrittenTitle from '@/components/HandwrittenTitle'

interface ChallengeWithLogs extends Challenge {
  dailyLogs: DailyLog[]
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [challenges, setChallenges] = useState<ChallengeWithLogs[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadChallenges()
    }
  }, [user])

  const loadChallenges = async () => {
    try {
      const data = await getChallenges()
      const supabase = createClient()

      // Fetch daily logs for each challenge
      const challengesWithLogs = await Promise.all(
        data.map(async (challenge) => {
          const { data: logs } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('challenge_id', challenge.id)
            .order('day_number', { ascending: true })
          return { ...challenge, dailyLogs: logs || [] }
        })
      )

      setChallenges(challengesWithLogs)
    } catch (err) {
      console.error('Error loading challenges:', err)
    } finally {
      setLoadingData(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-float">
          <Sparkles size={48} className="text-pink-400" />
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <HandwrittenTitle text="Goal Tracker ✦" as="h1" className="text-2xl! md:text-3xl!" />
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors px-3 py-2 rounded-lg hover:bg-white/60"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {loadingData ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-float">
              <Sparkles size={36} className="text-pink-400" />
            </div>
          </div>
        ) : challenges.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 animate-fadeIn">
            <div className="inline-block mb-6">
              <div className="w-24 h-24 mx-auto bg-pink-100 rounded-full flex items-center justify-center animate-float">
                <Sparkles size={40} className="text-pink-400" />
              </div>
            </div>
            <h2 className="font-handwritten text-3xl text-pink-600 mb-3">
              Comece sua jornada!
            </h2>
            <p className="text-stone-500 mb-8 max-w-sm mx-auto">
              Crie seu primeiro desafio e comece a rastrear seus hábitos com um tabuleiro interativo.
            </p>
            <button
              onClick={() => router.push('/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-xl font-medium shadow-lg shadow-pink-200 hover:shadow-xl hover:from-pink-500 hover:to-pink-600 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Novo Desafio
            </button>
          </div>
        ) : (
          /* Challenge grid */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-handwritten text-2xl text-stone-700">
                Seus Desafios
              </h2>
              <button
                onClick={() => router.push('/new')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:from-pink-500 hover:to-pink-600 transition-all duration-200"
              >
                <Plus size={16} />
                Novo
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  dailyLogs={challenge.dailyLogs}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
