import { getPosts } from '@/features/blog/actions'
import { BlogPost } from '@prisma/client'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, User } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Blog | Booked Place',
    description: 'Read our latest articles about travel, stays, and experiences.',
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
    const allPosts = await getPosts()

    // Attempt to find a featured post, otherwise use the latest
    const featuredPost = allPosts.find(p => p.isFeatured) || allPosts[0]
    const otherPosts = allPosts.filter(p => p.id !== featuredPost?.id)

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="bg-primary pt-32 md:pt-40 pb-16 px-4">
                <div className="container mx-auto max-w-6xl text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight mb-4">
                        Travel <span className="text-white/80">Journal</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto">
                        Discover hidden gems, expert packing tips, and inspiring itineraries from our community of globetrotters.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl py-12 md:py-20 space-y-20">
                {allPosts.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground bg-card rounded-3xl shadow-sm border border-border p-10 max-w-2xl mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <p className="text-xl font-semibold text-foreground">No articles published yet.</p>
                        <p className="mt-2 text-sm">Check back soon for fresh content!</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Post (Hero) */}
                        {featuredPost && (
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold font-heading text-foreground uppercase tracking-wider">Featured Story</h2>
                                </div>
                                <Link
                                    href={`/blog/${featuredPost.category.toLowerCase()}/${featuredPost.slug}`}
                                    className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-card rounded-[32px] overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-500"
                                >
                                    <div className="relative aspect-square lg:aspect-[4/3] w-full overflow-hidden bg-muted">
                                        <img
                                            src={featuredPost.coverImage || '/placeholder-image.jpg'}
                                            alt={featuredPost.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-6 left-6 flex gap-2">
                                            <span className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                                                {featuredPost.category}
                                            </span>
                                            {featuredPost.isFeatured && (
                                                <span className="bg-amber-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(featuredPost.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-foreground mb-6 leading-tight group-hover:text-primary transition-colors">
                                            {featuredPost.title}
                                        </h3>
                                        <p className="text-lg md:text-xl text-muted-foreground mb-8 line-clamp-3 leading-relaxed">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="font-bold text-primary flex items-center gap-2 text-lg">
                                            Read Full Article <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            </section>
                        )}

                        {/* Recent Articles Grid */}
                        {otherPosts.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold font-heading text-foreground uppercase tracking-wider">Latest Articles</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {otherPosts.map((post: BlogPost) => (
                                        <Link href={`/blog/${post.category.toLowerCase()}/${post.slug}`} key={post.id} className="group h-full flex flex-col bg-card rounded-[24px] overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300">
                                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted flex-shrink-0">
                                                <img
                                                    src={post.coverImage || '/placeholder-image.jpg'}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                                    {post.category}
                                                </span>
                                            </div>
                                            <div className="p-6 md:p-8 flex flex-col flex-grow">
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium mb-3">
                                                    <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-bold font-heading text-foreground mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                    {post.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                                <div className="text-sm font-bold text-primary flex items-center gap-1.5 mt-auto">
                                                    Read More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
