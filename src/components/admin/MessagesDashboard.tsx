'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns'
import { Check, Mail, MessageSquare, Download, Loader2 } from 'lucide-react'
import { toggleMessageReadStatus } from '@/features/contact/adminActions'
import { toast } from 'sonner'
import { ContactMessage } from '@prisma/client'

export default function MessagesDashboard({ initialMessages }: { initialMessages: ContactMessage[] }) {
    const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleToggleRead = async (id: string, currentStatus: boolean) => {
        setLoadingId(id)
        try {
            const result = await toggleMessageReadStatus(id, !currentStatus)
            if (result.success) {
                setMessages(messages.map(m => m.id === id ? { ...m, isRead: !currentStatus } : m))
                toast.success(`Message marked as ${!currentStatus ? 'read' : 'unread'}`)
            } else {
                toast.error(result.error || "Failed to update status")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoadingId(null)
        }
    }

    const handleDownloadEmails = () => {
        // Extract unique emails from all messages
        const uniqueEmails = Array.from(new Set(messages.map(m => m.email)))

        if (uniqueEmails.length === 0) {
            toast.info("No emails found to export.")
            return
        }

        const textContent = uniqueEmails.join('\n')

        // Create a blob and trigger download
        const blob = new Blob([textContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `bookplace_contact_emails_${format(new Date(), 'yyyy-MM-dd')}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success(`Exported ${uniqueEmails.length} emails successfully.`)
    }

    const unreadCount = messages.filter(m => !m.isRead).length

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
                    <p className="text-muted-foreground mt-2">
                        View and manage messages from your website visitors.
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <Badge variant={unreadCount > 0 ? "destructive" : "secondary"} className="text-sm px-3 py-1">
                        {unreadCount} Unread
                    </Badge>
                    <Button onClick={handleDownloadEmails} variant="outline" className="gap-2">
                        <Download size={16} />
                        Download Emails (.txt)
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Sender</TableHead>
                                <TableHead className="w-[250px]">Email</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead className="w-[150px]">Date</TableHead>
                                <TableHead className="w-[100px] text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {messages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No messages found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                messages.map((msg) => (
                                    <TableRow key={msg.id} className={!msg.isRead ? "bg-muted/50 font-medium" : ""}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="bg-primary/10 p-2 rounded-full hidden sm:block">
                                                    <MessageSquare size={16} className="text-primary" />
                                                </div>
                                                {msg.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail size={14} />
                                                <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="line-clamp-2 max-w-[400px] text-sm text-foreground/80" title={msg.message}>
                                                {msg.message}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {format(new Date(msg.createdAt), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleRead(msg.id, msg.isRead)}
                                                disabled={loadingId === msg.id}
                                                className={msg.isRead ? "text-muted-foreground" : "text-primary font-semibold"}
                                            >
                                                {loadingId === msg.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : msg.isRead ? (
                                                    "Mark Unread"
                                                ) : (
                                                    <span className="flex items-center gap-1"><Check size={14} /> Mark Read</span>
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
