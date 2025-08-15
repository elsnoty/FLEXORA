"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react'
import { MessageInput } from './MessageInput'
import { ChatAreaProps } from './types'
import MessagesList from './MessagesList'

export default function ChatArea({
selectedContact,
messages,
userRole,
isMobileMenuOpen,
onSendMessage,
onOpenMobileMenu,
onBackToMessages
}: ChatAreaProps) {
return (
    <div className={`flex-1 flex flex-col h-full ${isMobileMenuOpen ? 'hidden' : 'flex'} md:flex`}>
    {/* Chat Header - Fixed */}
    <div className="flex-shrink-0 p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onOpenMobileMenu}
            >
            <MoreVertical className="h-5 w-5" />
            </Button>
            <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={onBackToMessages}
            >
            <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="relative">
            <Avatar className="h-10 w-10">
                <AvatarImage src={selectedContact.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {selectedContact.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
            </Avatar>
            {selectedContact.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
            )}
            </div>
            <div>
            <h3 className="font-medium text-foreground">{selectedContact.name}</h3>
            <p className="text-sm text-muted-foreground">
                {selectedContact.online ? 'Active now' : 'Last seen 2h ago'}
            </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
            </Button>
        </div>
        </div>
    </div>

    {/* Messages Container - Scrollable */}
    <MessagesList 
        messages={messages}
        selectedContact={selectedContact}
        userRole={userRole}
    />

    {/* Message Input - Fixed */}
    <MessageInput onSendMessage={onSendMessage} />
    </div>
)
}
