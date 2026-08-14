import { getContactMessages } from '@/features/contact/adminActions'
import MessagesDashboard from '@/components/admin/MessagesDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
    const messages = await getContactMessages()

    return <MessagesDashboard initialMessages={messages} />
}
