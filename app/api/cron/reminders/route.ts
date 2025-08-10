// app/api/cron/reminders/route.ts
import { NextResponse } from 'next/server'
import { sendReminderEmail } from '@/utils/email'
import { supabaseAdmin } from '@/lib/SupabaseAdmin'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const now = new Date()
    const reminderTime = new Date(now.getTime() + 15 * 60 * 1000) // 15 minutes from now

    // First, get sessions that need reminders
    const { data: sessions, error: sessionsError } = await supabaseAdmin
      .from('sessions')
      .select(`
        id,
        start_time,
        trainee_id,
        trainer_id,
        status
      `)
      .eq('status', 'accepted')
      .eq('reminder_sent', false)
      .gte('start_time', now.toISOString())
      .lte('start_time', reminderTime.toISOString())

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError)
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
    }

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ success: true, message: 'No sessions need reminders', processed: 0 })
    }

    let emailsSent = 0

    // Process each session
    for (const session of sessions) {
      try {
        // Check if user has email reminders enabled and get their details
        const { data: traineeProfile, error: traineeError } = await supabaseAdmin
          .from('profiles')
          .select('name, enable_email_reminders')
          .eq('user_id', session.trainee_id)
          .single()

        const { data: trainerProfile, error: trainerError } = await supabaseAdmin
          .from('profiles')
          .select('name, enable_email_reminders')
          .eq('user_id', session.trainer_id)
          .single()

        // Get user emails from auth.users 
        const { data: traineeUser, error: traineeUserError } = await supabaseAdmin.auth.admin.getUserById(session.trainee_id)
        const { data: trainerUser, error: trainerUserError } = await supabaseAdmin.auth.admin.getUserById(session.trainer_id)

        // Send email to trainee if enabled
        if (
          traineeProfile?.enable_email_reminders && 
          traineeUser?.user?.email &&
          !traineeError && 
          !traineeUserError
        ) {
          await sendReminderEmail(traineeUser.user.email, {
            id: session.id,
            start_time: session.start_time,
            recipientName: traineeProfile.name,
            role: 'trainee',
            otherPartyName: trainerProfile?.name || 'Your trainer'
          })
          emailsSent++
        }

        // Send email to trainer if enabled
        if (
          trainerProfile?.enable_email_reminders && 
          trainerUser?.user?.email &&
          !trainerError && 
          !trainerUserError
        ) {
          await sendReminderEmail(trainerUser.user.email, {
            id: session.id,
            start_time: session.start_time,
            recipientName: trainerProfile.name,
            role: 'trainer',
            otherPartyName: traineeProfile?.name || 'Your trainee'
          })
          emailsSent++
        }

        await supabaseAdmin
          .from('sessions')
          .update({ 
            updated_at: new Date().toISOString(),
            reminder_sent: true // if you add this column
          })
          .eq('id', session.id)

        // Add small delay to avoid overwhelming email service
        await new Promise(resolve => setTimeout(resolve, 500))

      } catch (sessionError) {
        console.error(`Error processing session ${session.id}:`, sessionError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: sessions.length,
      emailsSent: emailsSent
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 🔒 SECURITY: Only allow GET method
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed Bitch 💩' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed Bitch 💩' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed Bitch 💩' }, { status: 405 })
}