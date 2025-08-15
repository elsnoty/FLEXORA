import { Contact, Message } from "./types"


// Mock contacts data - you can customize this based on user role
export const mockContacts: Contact[] = [
  { id: 1, name: 'John Smith', lastMessage: 'Great session today!', time: '2:30 PM', avatar: '/placeholder-avatar.jpg', unread: 2, online: true },
  { id: 2, name: 'Sarah Johnson', lastMessage: 'Can we reschedule?', time: '1:15 PM', avatar: '/placeholder-avatar.jpg', unread: 0, online: false },
  { id: 3, name: 'Mike Wilson', lastMessage: 'Thanks for the tips', time: '12:45 PM', avatar: '/placeholder-avatar.jpg', unread: 1, online: true },
  { id: 4, name: 'Emma Davis', lastMessage: 'See you tomorrow', time: '11:30 AM', avatar: '/placeholder-avatar.jpg', unread: 0, online: false },
  { id: 5, name: 'Alex Rodriguez', lastMessage: 'Perfect workout plan!', time: '10:20 AM', avatar: '/placeholder-avatar.jpg', unread: 3, online: true },
  { id: 6, name: 'Lisa Chen', lastMessage: 'Thanks for the motivation', time: '9:45 AM', avatar: '/placeholder-avatar.jpg', unread: 0, online: false },
  { id: 7, name: 'David Brown', lastMessage: 'Ready for next week?', time: '9:10 AM', avatar: '/placeholder-avatar.jpg', unread: 1, online: true },
  { id: 8, name: 'Maria Garcia', lastMessage: 'Great progress today', time: '8:30 AM', avatar: '/placeholder-avatar.jpg', unread: 0, online: false },
  { id: 9, name: 'Tom Anderson', lastMessage: 'New diet plan looks good', time: '8:00 AM', avatar: '/placeholder-avatar.jpg', unread: 2, online: true },
  { id: 10, name: 'Jessica Taylor', lastMessage: 'Can\'t wait for tomorrow', time: 'Yesterday', avatar: '/placeholder-avatar.jpg', unread: 0, online: false },
  { id: 11, name: 'Chris Miller', lastMessage: 'Recovery going well', time: 'Yesterday', avatar: '/placeholder-avatar.jpg', unread: 1, online: true },
  { id: 12, name: 'Amanda White', lastMessage: 'See you next session', time: 'Yesterday', avatar: '/placeholder-avatar.jpg', unread: 0, online: false },
]

// Mock messages data - different conversations for different contacts
export const mockMessagesData: Record<number, Message[]> = {
  1: [
    { id: 1, text: 'Hey! How are you doing?', sender: 'trainer', time: '2:20 PM', avatar: '/placeholder-avatar.jpg' },
    { id: 2, text: 'I\'m doing great! Ready for our session today?', sender: 'trainee', time: '2:22 PM' },
    { id: 3, text: 'Absolutely! I\'ve prepared a new workout routine for you', sender: 'trainer', time: '2:25 PM', avatar: '/placeholder-avatar.jpg' },
    { id: 4, text: 'That sounds awesome! What should I bring?', sender: 'trainee', time: '2:26 PM' },
    { id: 5, text: 'Just your water bottle and a towel. I\'ll provide the rest of the equipment', sender: 'trainer', time: '2:28 PM', avatar: '/placeholder-avatar.jpg' },
    { id: 6, text: 'Perfect! See you at 3 PM', sender: 'trainee', time: '2:30 PM' },
  ],
  2: [
    { id: 1, text: 'Hi Sarah! Hope you\'re doing well', sender: 'trainee', time: '1:10 PM' },
    { id: 2, text: 'Hey! I\'m good, thanks for asking', sender: 'trainer', time: '1:12 PM', avatar: '/placeholder-avatar.jpg' },
    { id: 3, text: 'Can we reschedule our session this week?', sender: 'trainer', time: '1:15 PM', avatar: '/placeholder-avatar.jpg' },
  ],
  3: [
    { id: 1, text: 'The workout you gave me was incredible!', sender: 'trainee', time: '12:40 PM' },
    { id: 2, text: 'I\'m so glad you enjoyed it!', sender: 'trainer', time: '12:42 PM', avatar: '/placeholder-avatar.jpg' },
    { id: 3, text: 'Thanks for the tips on proper form', sender: 'trainee', time: '12:45 PM' },
  ],
  4: [
    { id: 1, text: 'Good morning Emma!', sender: 'trainer', time: '11:25 AM', avatar: '/placeholder-avatar.jpg' },
    { id: 2, text: 'Morning! Ready for today\'s challenge?', sender: 'trainee', time: '11:27 AM' },
    { id: 3, text: 'Always ready! What are we focusing on today?', sender: 'trainee', time: '11:28 AM' },
    { id: 4, text: 'We\'ll work on strength training and core stability', sender: 'trainer', time: '11:30 AM', avatar: '/placeholder-avatar.jpg' },
  ],
  5: [
    { id: 1, text: 'Alex, your progress has been amazing!', sender: 'trainer', time: '10:15 AM', avatar: '/placeholder-avatar.jpg' },
    { id: 2, text: 'Thank you! I feel stronger every day', sender: 'trainee', time: '10:17 AM' },
    { id: 3, text: 'The nutrition plan is working great too', sender: 'trainee', time: '10:18 AM' },
    { id: 4, text: 'Perfect workout plan! When\'s our next session?', sender: 'trainee', time: '10:20 AM' },
  ],
  // Add more conversations as needed
}

// Helper function to get contacts based on user role perspective
export function getContactsForRole(userRole: 'trainer' | 'trainee'): Contact[] {
  // You can customize the contacts list based on the user role
  // For example, trainers might see trainees, and trainees might see trainers
  return mockContacts
}

// Helper function to get messages with correct sender perspective
export function getMessagesForRole(userRole: 'trainer' | 'trainee'): Record<number, Message[]> {
  return mockMessagesData
}
