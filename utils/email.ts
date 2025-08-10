// utils/email.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
host: process.env.EMAIL_HOST,
port: parseInt(process.env.EMAIL_PORT || '587'),
secure: false,
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
})

export interface ReminderEmailData {
id: string
start_time: string
recipientName: string
role: 'trainer' | 'trainee'
otherPartyName: string
}

export async function sendReminderEmail(email: string, data: ReminderEmailData) {
const sessionDate = new Date(data.start_time)
const formattedDate = sessionDate.toLocaleDateString('en-US', {
weekday: 'long',
year: 'numeric',
month: 'long',
day: 'numeric'
})
const formattedTime = sessionDate.toLocaleTimeString('en-US', {
hour: '2-digit',
minute: '2-digit'
})

const subject = `Session Reminder - Starting in 15 minutes!`

const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #ff6b35; text-align: center;">🔔 Session Starting Soon!</h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ff6b35;">
    <h3 style="margin: 0 0 15px 0; color: #333;">Hi ${data.recipientName}!</h3>
    <p style="font-size: 16px; margin-bottom: 15px;">
        Your training session is starting in <strong>15 minutes</strong>!
    </p>
    
    <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${formattedDate}</p>
        <p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${formattedTime}</p>
        <p style="margin: 5px 0;"><strong>👤 ${data.role === 'trainer' ? 'Trainee' : 'Trainer'}:</strong> ${data.otherPartyName}</p>
    </div>
    
            <div style="text-align: center; margin: 25px 0;">
    <a 
    href="${process.env.NEXT_PUBLIC_BASE_URL}/${data.role === 'trainer' ? 'trainer/sessions' : 'trainee/bookings'}" 
    style="
        background-color: #ff6b35;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        display: inline-block;
    "
    >
    View ${data.role === 'trainer' ? 'Your Sessions' : 'Your Bookings'}
    </a>
</div>

    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 0; color: #2d5a2d;">
        <strong>💡 Quick Reminder:</strong><br>
        ${data.role === 'trainer' 
            ? '• Review your training plan<br>• Ensure you have all necessary equipment<br>• Be ready to motivate and guide!' 
            : '• Have your workout gear ready<br>• Ensure you have water nearby<br>• Be ready to give your best effort!'
        }
        </p>
    </div>
    </div>


    <div style="text-align: center; margin-top: 30px;">
    <p style="color: #666; font-size: 14px;">
        Have a great session! 💪<br>
        <strong>Your Fitness Team</strong>
    </p>
    </div>
</div>
`

const mailOptions = {
from: process.env.EMAIL_FROM || '"Fitness App" <noreply@yourapp.com>',
to: email,
subject,
html,
}

try {
const info = await transporter.sendMail(mailOptions)
console.log(`Reminder email sent to ${email}:`, info.messageId)
return { success: true, messageId: info.messageId }
} catch (error) {
console.error(`Error sending reminder email to ${email}:`, error)
return { success: false, error }
}
}