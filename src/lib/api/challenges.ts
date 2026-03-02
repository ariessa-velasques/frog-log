import { createClient } from '@/lib/supabase'
import { Challenge, ChallengeWithDetails } from '@/lib/types'

export async function getChallenges(): Promise<Challenge[]> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

export async function getChallengeWithDetails(id: string): Promise<ChallengeWithDetails | null> {
    const supabase = createClient()

    const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single()

    if (challengeError || !challenge) return null

    const [rulesResult, logsResult] = await Promise.all([
        supabase.from('rules').select('*').eq('challenge_id', id),
        supabase.from('daily_logs').select('*').eq('challenge_id', id).order('day_number', { ascending: true }),
    ])

    return {
        ...challenge,
        rules: rulesResult.data || [],
        daily_logs: logsResult.data || [],
    }
}

export async function createChallenge(data: {
    title: string
    start_date: string
    total_days: number
    doRules: string[]
    dontRules: string[]
    reminders: string[]
}): Promise<string> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Create challenge
    const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .insert({
            user_id: user.id,
            title: data.title,
            start_date: data.start_date,
            total_days: data.total_days,
            reminders: data.reminders.filter(r => r.trim()),
        })
        .select('id')
        .single()

    if (challengeError || !challenge) throw challengeError || new Error('Failed to create challenge')

    // Create rules
    const allRules = [
        ...data.doRules.filter(r => r.trim()).map(r => ({
            challenge_id: challenge.id,
            type: 'do' as const,
            description: r.trim(),
        })),
        ...data.dontRules.filter(r => r.trim()).map(r => ({
            challenge_id: challenge.id,
            type: 'dont' as const,
            description: r.trim(),
        })),
    ]

    if (allRules.length > 0) {
        const { error: rulesError } = await supabase.from('rules').insert(allRules)
        if (rulesError) throw rulesError
    }

    // Auto-generate daily logs
    const startDate = new Date(data.start_date + 'T00:00:00')
    const dailyLogs = Array.from({ length: data.total_days }, (_, i) => {
        const logDate = new Date(startDate)
        logDate.setDate(logDate.getDate() + i)
        return {
            challenge_id: challenge.id,
            day_number: i + 1,
            log_date: logDate.toISOString().split('T')[0],
            status: 'pending' as const,
        }
    })

    const { error: logsError } = await supabase.from('daily_logs').insert(dailyLogs)
    if (logsError) throw logsError

    return challenge.id
}

export async function deleteChallenge(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('challenges').delete().eq('id', id)
    if (error) throw error
}
