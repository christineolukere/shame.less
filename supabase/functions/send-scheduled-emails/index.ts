import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Get all emails that should be sent now
    const now = new Date().toISOString()
    const { data: emailsToSend, error: fetchError } = await supabaseClient
      .from('scheduled_emails')
      .select('*')
      .eq('status', 'scheduled')
      .lte('send_at', now)
      .limit(50) // Process in batches

    if (fetchError) {
      console.error('Error fetching emails to send:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch emails' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!emailsToSend || emailsToSend.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No emails to send', processed: 0 }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let successCount = 0
    let errorCount = 0

    // Process each email
    for (const email of emailsToSend) {
      try {
        // Create the email content
        const subject = "A gentle reminder from your past self 💌"
        const emailBody = createEmailBody(email)

        // In a real implementation, you would send the email here using a service like:
        // - SendGrid
        // - Resend
        // - AWS SES
        // - Postmark
        // etc.
        
        // For now, we'll simulate sending the email
        console.log(`Sending email to ${email.user_email}:`)
        console.log(`Subject: ${subject}`)
        console.log(`Body: ${emailBody}`)
        
        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Mark email as sent
        const { error: updateError } = await supabaseClient
          .from('scheduled_emails')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', email.id)

        if (updateError) {
          console.error(`Error updating email ${email.id}:`, updateError)
          errorCount++
        } else {
          successCount++
        }

      } catch (emailError) {
        console.error(`Error processing email ${email.id}:`, emailError)
        
        // Mark email as failed
        await supabaseClient
          .from('scheduled_emails')
          .update({ 
            status: 'failed',
            error_message: emailError.message
          })
          .eq('id', email.id)
        
        errorCount++
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Email processing completed',
        processed: emailsToSend.length,
        successful: successCount,
        failed: errorCount
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-scheduled-emails function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function createEmailBody(email: any): string {
  const createdDate = new Date(email.created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A gentle reminder from your past self</title>
    <style>
        body { font-family: 'Georgia', serif; line-height: 1.6; color: #4a5568; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
        .content { background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px; }
        .entry-content { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #68d391; margin: 20px 0; }
        .footer { text-align: center; color: #718096; font-size: 14px; }
        h1 { color: #2d3748; margin: 0; font-size: 24px; }
        h2 { color: #4a5568; font-size: 18px; margin-bottom: 15px; }
        .date { color: #718096; font-size: 14px; margin-bottom: 10px; }
        .signature { font-style: italic; color: #68d391; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>💌 A gentle reminder from your past self</h1>
        <p>Seven days ago, you took a moment to reflect and asked us to send this to you today.</p>
    </div>
    
    <div class="content">
        <div class="date">Written on ${createdDate}</div>
        
        ${email.entry_title ? `<h2>${email.entry_title}</h2>` : ''}
        
        <div class="entry-content">
            ${email.entry_content.split('\n').map(paragraph => 
              paragraph.trim() ? `<p>${paragraph}</p>` : ''
            ).join('')}
        </div>
        
        <div class="signature">
            With love from who you were seven days ago ✨
        </div>
    </div>
    
    <div class="footer">
        <p>This email was sent from shame.less, your gentle daily companion.</p>
        <p>You scheduled this reminder as part of your healing journey.</p>
        <p>Continue nurturing yourself with kindness. You deserve it. 💛</p>
    </div>
</body>
</html>
  `.trim()
}