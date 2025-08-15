"use client"
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChatProps, Contact, Message } from './types'
import ChatArea from './ChatArea'
import ContactsSidebar from './ContactsSidebar'

export default function ChatInterface({ userRole, contacts, messagesData, currentUserId }: ChatProps) {
  const params = useParams()
  const router = useRouter()
  const contactId = currentUserId || parseInt(params.id as string)
  
  const [selectedContact, setSelectedContact] = useState<Contact>(() => 
    contacts.find(c => c.id === contactId) || contacts[0]
  )
  const [messages, setMessages] = useState<Message[]>(() => messagesData[contactId] || [])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Update selected contact and messages when route changes
    const contact = contacts.find(c => c.id === contactId)
    if (contact) {
      setSelectedContact(contact)
      setMessages(messagesData[contactId] || [])
    }
  }, [contactId, contacts, messagesData])

  const handleSendMessage = (messageText: string) => {
    const newMsg: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: userRole,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages([...messages, newMsg])
    
    // Here you would typically send to backend
    console.log('Sending message:', messageText)
  }

  const handleContactClick = (contactId: number) => {
    router.push(`/${userRole}/messages/${contactId}`)
  }

  const handleBackToMessages = () => {
    router.push(`/${userRole}/messages`)
  }

  if (!selectedContact) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-2rem)] bg-background rounded-lg border border-border">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Conversation not found</h2>
          <Button onClick={handleBackToMessages}>Back to Messages</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-background rounded-lg border border-border overflow-hidden shadow-lg">
      <ContactsSidebar
        contacts={contacts}
        selectedContact={selectedContact}
        isMobileMenuOpen={isMobileMenuOpen}
        userRole={userRole}
        onContactClick={handleContactClick}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />
      
      <ChatArea
        selectedContact={selectedContact}
        messages={messages}
        userRole={userRole}
        isMobileMenuOpen={isMobileMenuOpen}
        onSendMessage={handleSendMessage}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onBackToMessages={handleBackToMessages}
      />
    </div>
  )
}
