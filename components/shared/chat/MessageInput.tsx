"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Paperclip, Smile } from 'lucide-react'
import { MessageInputProps } from './types'

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex-shrink-0 p-4 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-end gap-3">
        <Button variant="ghost" size="icon" className="shrink-0">
          <Paperclip className="h-5 w-5" />
        </Button>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-4 py-3 pr-12 bg-muted rounded-2xl border border-input resize-none focus:outline-none focus:ring-1 focus:ring-ring text-sm placeholder:text-muted-foreground min-h-[2.75rem] max-h-[7.5rem]"
            rows={1}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 shrink-0"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="shrink-0 rounded-full h-11 w-11 p-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
