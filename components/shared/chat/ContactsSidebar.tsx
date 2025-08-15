"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MoreVertical, Search } from 'lucide-react'
import { ContactsSidebarProps } from './types'

export default function ContactsSidebar({
  contacts,
  selectedContact,
  isMobileMenuOpen,
  userRole,
  onContactClick,
  onCloseMobileMenu
}: ContactsSidebarProps) {
  return (
    <div className={`w-full md:w-80 bg-card border-r border-border flex flex-col h-full ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
      {/* Contacts Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Messages</h2>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onCloseMobileMenu}>
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-input text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Contacts List - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => onContactClick(contact.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                  selectedContact.id === contact.id ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate text-foreground">{contact.name}</h3>
                    <span className="text-xs text-muted-foreground">{contact.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                    {contact.unread > 0 && selectedContact.id !== contact.id && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[1.25rem] h-5 flex items-center justify-center">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
