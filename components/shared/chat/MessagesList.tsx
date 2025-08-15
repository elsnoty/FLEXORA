"use client"

import { useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessagesListProps } from './types'

export default function MessagesList({ messages, selectedContact, userRole }: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Determine the opposite role for message styling
  const otherRole = userRole === 'trainer' ? 'trainee' : 'trainer'

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === userRole ? 'flex-row-reverse' : ''}`}
              >
                {message.sender === otherRole && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={message.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                      {selectedContact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex flex-col ${message.sender === userRole ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                      message.sender === userRole
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 px-2">{message.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  )
}
