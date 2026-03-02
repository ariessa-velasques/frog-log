import { createClient } from '@/lib/supabase'
import { DailyLog, DayStatus } from '@/lib/types'

export async function updateDayStatus(
    logId: string,
    status: DayStatus,
    notes?: string
): Promise<DailyLog> {
    const supabase = createClient()

    // First fetch the log to validate the date
    const { data: log, error: fetchError } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('id', logId)
        .single()

    if (fetchError || !log) throw fetchError || new Error('Log not found')

    // Business rule: cannot mark future dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const logDate = new Date(log.log_date + 'T00:00:00')

    if (logDate > today) {
        throw new Error('Não é possível preencher dias futuros')
    }

    const { data, error } = await supabase
        .from('daily_logs')
        .update({
            status,
            notes: notes || null,
        })
        .eq('id', logId)
        .select()
        .single()

    if (error) throw error
    return data
}
