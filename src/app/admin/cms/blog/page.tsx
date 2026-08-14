import Link from 'next/link'
import { getPosts, deletePost } from '@/features/blog/actions'
import { BlogPost } from '@prisma/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
    // Fetch all posts (published and drafts)
    const posts = await getPosts(false)

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
                    <p className="text-muted-foreground">Manage your articles and SEO content.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/cms/blog/categories">
                        <Button variant="outline">Manage Categories</Button>
                    </Link>
                    <Link href="/admin/cms/blog/new">
                        <Button>Create New Post</Button>
                    </Link>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No posts found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post: BlogPost) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {post.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{post.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/admin/cms/blog/${post.id}`}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                        <form action={deletePost.bind(null, post.id)} className="inline-block">
                                            <Button variant="destructive" size="sm" type="submit">Delete</Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
