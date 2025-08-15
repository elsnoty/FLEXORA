"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MoreVertical, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getContactsForRole } from '@/components/shared/chat/mockData'

export default function TrainerMessagesPage() {
  const router = useRouter()
  const contacts = getContactsForRole('trainer')

  const handleContactClick = (contactId: number) => {
    router.push(`/trainer/messages/${contactId}`)
  }

  return (
    <div className="h-[calc(100vh-2rem)] bg-background rounded-lg border border-border overflow-hidden shadow-lg">
      {/* Messages Overview */}
      <div className="w-full bg-card flex flex-col h-full">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
              <p className="text-sm text-muted-foreground mt-1">Connect with your trainees and community</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border border-input text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Contacts List - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="grid gap-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => handleContactClick(contact.id)}
                    className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 group"
                  >
                    <div className="relative">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-card rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground group-hover:text-accent-foreground truncate">{contact.name}</h3>
                        <span className="text-sm text-muted-foreground">{contact.time}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-muted-foreground truncate">{contact.lastMessage}</p>
                        {contact.unread > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[1.5rem] h-6 flex items-center justify-center ml-2">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`w-2 h-2 rounded-full ${contact.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-xs text-muted-foreground">
                          {contact.online ? 'Active now' : 'Last seen 2h ago'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
