export interface Contact {
    id: number
    name: string
    lastMessage: string
    time: string
    avatar: string
    unread: number
    online: boolean
}

export interface Message {
    id: number
    text: string
    sender: 'user' | 'trainer' | 'trainee'
    time: string
    avatar?: string
}

export interface ChatProps {
    userRole: 'trainer' | 'trainee'
    contacts: Contact[]
    messagesData: Record<number, Message[]>
    currentUserId?: number
}

export interface ContactsSidebarProps {
    contacts: Contact[]
    selectedContact: Contact
    isMobileMenuOpen: boolean
    userRole: 'trainer' | 'trainee'
    onContactClick: (contactId: number) => void
    onCloseMobileMenu: () => void
}

export interface ChatAreaProps {
    selectedContact: Contact
    messages: Message[]
    userRole: 'trainer' | 'trainee'
    isMobileMenuOpen: boolean
    onSendMessage: (message: string) => void
    onOpenMobileMenu: () => void
    onBackToMessages: () => void
}

export interface MessageInputProps {
    onSendMessage: (message: string) => void
}

export interface MessagesListProps {
    messages: Message[]
    selectedContact: Contact
    userRole: 'trainer' | 'trainee'
}
