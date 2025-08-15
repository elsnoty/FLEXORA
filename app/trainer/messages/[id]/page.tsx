"use client"

import ChatInterface from '@/components/shared/chat/ChatInterface'
import { getContactsForRole, getMessagesForRole } from '@/components/shared/chat/mockData'

export default function TrainerChatConversation() {
  const contacts = getContactsForRole('trainer')
  const messagesData = getMessagesForRole('trainer')

  return (
    <ChatInterface
      userRole="trainer"
      contacts={contacts}
      messagesData={messagesData}
    />
  )
}
