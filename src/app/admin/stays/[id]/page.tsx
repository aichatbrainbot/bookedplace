import { notFound } from 'next/navigation'
import { getProperty } from '@/features/stays/db'
import EditStayForm from '@/components/admin/EditStayForm'

export const dynamic = 'force-dynamic'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const property = await getProperty(id)

    if (!property) {
        notFound()
    }

    return <EditStayForm property={property} />
}
