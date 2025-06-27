import { supabase } from './supabase'

export interface GuestData {
  checkIns: Array<{
    id: string
    mood: string
    color: string
    notes?: string
    timestamp: string
  }>
  wins: Array<{
    id: string
    text: string
    category: string
    timestamp: string
  }>
  journalEntries: Array<{
    id: string
    content: string
    prompt?: string
    entryType: string
    timestamp: string
  }>
  preferences: {
    language: string
    onboardingData?: any
  }
  visitCount: number
  firstVisit: string
  lastVisit: string
}

const GUEST_DATA_KEY = 'shameless_guest_data'
const VISIT_COUNT_KEY = 'shameless_visit_count'
const FIRST_VISIT_KEY = 'shameless_first_visit'

export class GuestStorageManager {
  private static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  static getGuestSessionId(): string {
    let sessionId = localStorage.getItem('shameless_guest_session_id')
    if (!sessionId) {
      sessionId = 'guest_' + this.generateId()
      localStorage.setItem('shameless_guest_session_id', sessionId)
    }
    return sessionId
  }

  static getGuestData(): GuestData {
    const data = localStorage.getItem(GUEST_DATA_KEY)
    if (!data) {
      const defaultData: GuestData = {
        checkIns: [],
        wins: [],
        journalEntries: [],
        preferences: { language: 'English' },
        visitCount: 0,
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString()
      }
      this.saveGuestData(defaultData)
      return defaultData
    }
    return JSON.parse(data)
  }

  static saveGuestData(data: GuestData): void {
    localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(data))
  }

  static incrementVisitCount(): number {
    const data = this.getGuestData()
    data.visitCount += 1
    data.lastVisit = new Date().toISOString()
    this.saveGuestData(data)
    return data.visitCount
  }

  static shouldShowUpsell(): boolean {
    const data = this.getGuestData()
    return data.visitCount >= 3 && !localStorage.getItem('shameless_upsell_dismissed')
  }

  static dismissUpsell(): void {
    localStorage.setItem('shameless_upsell_dismissed', 'true')
  }

  static addCheckIn(checkIn: Omit<GuestData['checkIns'][0], 'id' | 'timestamp'>): void {
    const data = this.getGuestData()
    data.checkIns.unshift({
      ...checkIn,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    })
    this.saveGuestData(data)
  }

  static addWin(win: Omit<GuestData['wins'][0], 'id' | 'timestamp'>): void {
    const data = this.getGuestData()
    data.wins.unshift({
      ...win,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    })
    this.saveGuestData(data)
  }

  static addJournalEntry(entry: Omit<GuestData['journalEntries'][0], 'id' | 'timestamp'>): void {
    const data = this.getGuestData()
    data.journalEntries.unshift({
      ...entry,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    })
    this.saveGuestData(data)
  }

  static updatePreferences(preferences: Partial<GuestData['preferences']>): void {
    const data = this.getGuestData()
    data.preferences = { ...data.preferences, ...preferences }
    this.saveGuestData(data)
  }

  static async migrateToUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const guestData = this.getGuestData()
      const guestSessionId = this.getGuestSessionId()

      // Migrate check-ins
      if (guestData.checkIns.length > 0) {
        const checkInsToInsert = guestData.checkIns.map(checkIn => ({
          user_id: userId,
          mood: checkIn.mood,
          color: checkIn.color,
          notes: checkIn.notes,
          created_at: checkIn.timestamp
        }))

        const { error: checkInsError } = await supabase
          .from('check_ins')
          .insert(checkInsToInsert)

        if (checkInsError) throw checkInsError
      }

      // Migrate wins
      if (guestData.wins.length > 0) {
        const winsToInsert = guestData.wins.map(win => ({
          user_id: userId,
          text: win.text,
          category: win.category,
          created_at: win.timestamp
        }))

        const { error: winsError } = await supabase
          .from('wins')
          .insert(winsToInsert)

        if (winsError) throw winsError
      }

      // Migrate journal entries
      if (guestData.journalEntries.length > 0) {
        const entriesToInsert = guestData.journalEntries.map(entry => ({
          user_id: userId,
          content: entry.content,
          prompt: entry.prompt,
          entry_type: entry.entryType,
          created_at: entry.timestamp
        }))

        const { error: entriesError } = await supabase
          .from('journal_entries')
          .insert(entriesToInsert)

        if (entriesError) throw entriesError
      }

      return { success: true }
    } catch (error: any) {
      console.error('Migration error:', error)
      return { success: false, error: error.message }
    }
  }

  static clearGuestData(): void {
    localStorage.removeItem(GUEST_DATA_KEY)
    localStorage.removeItem('shameless_guest_session_id')
    localStorage.removeItem('shameless_upsell_dismissed')
  }

  static getDataSummary(): { totalEntries: number; daysSinceFirst: number } {
    const data = this.getGuestData()
    const totalEntries = data.checkIns.length + data.wins.length + data.journalEntries.length
    const daysSinceFirst = Math.floor(
      (new Date().getTime() - new Date(data.firstVisit).getTime()) / (1000 * 60 * 60 * 24)
    )
    return { totalEntries, daysSinceFirst }
  }
}