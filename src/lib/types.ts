export type DayStatus = 'success' | 'fail' | 'pending'
export type RuleType = 'do' | 'dont'

export interface Challenge {
    id: string
    user_id: string
    title: string
    start_date: string
    total_days: number
    reminders: string[] | null
    created_at: string
}

export interface Rule {
    id: string
    challenge_id: string
    type: RuleType
    description: string
}

export interface DailyLog {
    id: string
    challenge_id: string
    day_number: number
    log_date: string
    status: DayStatus
    notes: string | null
}

export interface ChallengeWithDetails extends Challenge {
    rules: Rule[]
    daily_logs: DailyLog[]
}
