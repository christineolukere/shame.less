import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface EmailRequest {
  emailId: string
  userEmail: string
  entryContent: string
  entryTitle?: string
  sendAt: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { emailId, userEmail, entryContent, entryTitle, sendAt }: EmailRequest = await req.json()

    // Validate input
    if (!emailId || !userEmail || !entryContent || !sendAt) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate send date (must be in the future)
    const sendDate = new Date(sendAt)
    const now = new Date()
    if (sendDate <= now) {
      return new Response(
        JSON.stringify({ error: 'Send date must be in the future' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Rate limiting: Check if user has too many scheduled emails
    const { data: existingEmails, error: countError } = await supabaseClient
      .from('scheduled_emails')
      .select('id')
      .eq('user_email', userEmail)
      .eq('status', 'scheduled')

    if (countError) {
      console.error('Error checking existing emails:', countError)
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Limit to 10 scheduled emails per user
    if (existingEmails && existingEmails.length >= 10) {
      return new Response(
        JSON.stringify({ error: 'Too many scheduled emails. Maximum 10 allowed.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Schedule the email using a simple timeout approach
    // In production, you'd want to use a proper job queue like pg_cron or external service
    const delay = sendDate.getTime() - now.getTime()
    
    // For demonstration, we'll just log the scheduling
    // In a real implementation, you'd use a job queue or cron job
    console.log(`Email ${emailId} scheduled to be sent to ${userEmail} in ${delay}ms`)
    
    // Update the scheduled email status to confirm it's been processed
    const { error: updateError } = await supabaseClient
      .from('scheduled_emails')
      .update({ 
        status: 'scheduled',
        error_message: null
      })
      .eq('id', emailId)

    if (updateError) {
      console.error('Error updating email status:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update email status' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // For now, we'll simulate the email being scheduled successfully
    // In production, you would integrate with an email service like SendGrid, Resend, etc.
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email scheduled successfully',
        emailId: emailId,
        scheduledFor: sendAt
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in schedule-future-email function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})