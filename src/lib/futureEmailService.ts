import { supabase } from './supabase'

export interface FutureEmailRequest {
  userId: string
  userEmail: string
  entryId: string
  entryContent: string
  entryTitle?: string
  sendAt: Date
}

export interface FutureEmailResponse {
  success: boolean
  emailId?: string
  error?: string
}

// Schedule a future email to be sent
export async function scheduleFutureEmail(request: FutureEmailRequest): Promise<FutureEmailResponse> {
  try {
    // Store the email schedule in the database
    const { data, error } = await supabase
      .from('scheduled_emails')
      .insert({
        user_id: request.userId,
        user_email: request.userEmail,
        entry_id: request.entryId,
        entry_content: request.entryContent,
        entry_title: request.entryTitle,
        send_at: request.sendAt.toISOString(),
        status: 'scheduled'
      })
      .select()
      .single()

    if (error) {
      console.error('Error scheduling email:', error)
      return { success: false, error: error.message }
    }

    // Call the edge function to set up the email sending
    const { data: edgeResponse, error: edgeError } = await supabase.functions.invoke('schedule-future-email', {
      body: {
        emailId: data.id,
        userEmail: request.userEmail,
        entryContent: request.entryContent,
        entryTitle: request.entryTitle,
        sendAt: request.sendAt.toISOString()
      }
    })

    if (edgeError) {
      console.error('Error calling edge function:', edgeError)
      // Update the record to mark as failed
      await supabase
        .from('scheduled_emails')
        .update({ status: 'failed', error_message: edgeError.message })
        .eq('id', data.id)
      
      return { success: false, error: edgeError.message }
    }

    return { success: true, emailId: data.id }
  } catch (error: any) {
    console.error('Error in scheduleFutureEmail:', error)
    return { success: false, error: error.message }
  }
}

// Get scheduled emails for a user
export async function getScheduledEmails(userId: string): Promise<{ success: boolean; emails?: any[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('scheduled_emails')
      .select('*')
      .eq('user_id', userId)
      .order('send_at', { ascending: true })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, emails: data || [] }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Cancel a scheduled email
export async function cancelScheduledEmail(emailId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('scheduled_emails')
      .update({ status: 'cancelled' })
      .eq('id', emailId)
      .eq('user_id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}