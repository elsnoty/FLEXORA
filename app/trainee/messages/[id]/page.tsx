//trainee/messages/[id]/page
"use client"
import ChatInterface from '@/components/shared/chat/ChatInterface'
import { getContactsForRole, getMessagesForRole } from '@/components/shared/chat/mockData'

export default function TraineeChatConversation() {
  const contacts = getContactsForRole('trainee')
  const messagesData = getMessagesForRole('trainee')
console.log('ChatInterface:', ChatInterface)
  return (
    <ChatInterface
      userRole="trainee"
      contacts={contacts}
      messagesData={messagesData}
    />
  )
}
