import Link from 'next/link'
import { Plus, MoreHorizontal, MapPin, Building2, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge'
import { getStays } from '@/features/stays/db'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AdminStaysPage() {
    const stays = await getStays()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
                    <p className="text-muted-foreground">{stays.length} properties listed</p>
                </div>
                <Link href="/admin/stays/new">
                    <Button className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Add Property
                    </Button>
                </Link>
            </div>

            <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stays.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Building2 className="h-8 w-8 mb-2 opacity-20" />
                                        <p>No properties found.</p>
                                        <Link href="/admin/stays/new" className="text-primary hover:underline mt-1 text-sm">
                                            Create your first property
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            stays.map((stay) => {
                                let image = '/stays-hero.jpg'
                                try { image = JSON.parse(stay.images)[0] || image } catch { }

                                return (
                                    <TableRow key={stay.id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell>
                                            <div className="h-12 w-20 rounded-md overflow-hidden relative border border-border">
                                                <Image
                                                    src={image}
                                                    alt={stay.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{stay.title}</span>
                                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">{stay.description?.substring(0, 50)}...</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-muted-foreground text-sm">
                                                <MapPin className="mr-1 h-3 w-3" />
                                                {stay.location}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium flex items-center">
                                                <DollarSign className="h-3 w-3 text-muted-foreground mr-0.5" />
                                                {Number(stay.price).toFixed(2)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">
                                                {stay.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/stays/${stay.id}`}>Edit Details</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                        Delete Property
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
