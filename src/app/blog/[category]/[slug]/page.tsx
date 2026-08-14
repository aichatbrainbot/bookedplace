import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlugAndCategory, getPosts } from '@/features/blog/actions'
import { calculateReadingTime } from '@/lib/utils'
import ReadingProgressBar from '@/components/blog/ReadingProgressBar'
import TableOfContents from '@/components/blog/TableOfContents'
import StickyShare from '@/components/blog/StickyShare'
import NewsletterWidget from '@/components/blog/NewsletterWidget'

interface PageProps {
    params: Promise<{ category: string; slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { category, slug } = await params
    const post = await getPostBySlugAndCategory(category, slug)

    if (!post) {
        return {
            title: 'Not Found',
            description: 'The page you are looking for does not exist.'
        }
    }

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        keywords: post.keywords?.split(',').map((k: string) => k.trim()),
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || '',
            url: `/blog/${category}/${post.slug}`,
            type: 'article',
            images: post.coverImage ? [post.coverImage] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || '',
            images: post.coverImage ? [post.coverImage] : [],
        }
    }
}

export default async function BlogPostPage({ params }: PageProps) {
    const { category, slug } = await params
    const post = await getPostBySlugAndCategory(category, slug)

    if (!post) notFound()

    const categoryLabel = post.category.charAt(0) + post.category.slice(1).toLowerCase()

    // Fetch latest posts for the bottom section
    const allPosts = await getPosts(true)
    const latestPosts = allPosts.filter(p => p.id !== post.id).slice(0, 3)

    const schemaOrgJSONLD = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        image: post.coverImage ? [post.coverImage] : [],
        datePublished: post.publishedAt || post.createdAt,
        author: {
            '@type': 'Person',
            name: post.author?.name || 'Admin',
        }
    }

    const finalSchema = post.schemaJson && post.schemaJson.trim() !== ''
        ? post.schemaJson
        : JSON.stringify(schemaOrgJSONLD)

    return (
        <article className="min-h-screen bg-background pb-16 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: finalSchema }}
            />
            {/* Solid Brand Color Header */}
            <div className="w-full bg-primary pt-36 md:pt-48 pb-32 md:pb-40 px-4 md:px-8">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-6 flex items-center justify-start gap-2 text-sm font-bold text-white/90 uppercase tracking-widest flex-wrap">
                        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                        <span>›</span>
                        <Link href={`/blog/category/${post.category}`} className="hover:text-white transition-colors">{categoryLabel}</Link>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold font-heading text-white leading-[1.3] md:leading-[1.1] mb-6 text-left tracking-tight break-words">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed font-normal max-w-3xl text-left mb-8">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Author Info moved to Hero */}
                    <div className="flex items-center gap-6 text-white flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl shrink-0 backdrop-blur-sm">
                                {(post.author?.name || 'A')[0].toUpperCase()}
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-lg">{post.author?.name || 'Admin'}</p>
                                <p className="text-sm text-white/80 font-medium">
                                    {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:block w-px h-8 bg-white/30"></div>
                        <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {calculateReadingTime(post.content)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlapping Image & Content */}
            <ReadingProgressBar />

            <div className="container mx-auto px-4 -mt-24 md:-mt-32 max-w-6xl relative z-10">
                {post.coverImage && (
                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[20px] shadow-2xl mb-12 bg-muted max-w-4xl mx-auto">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-12 relative items-start">

                    {/* Left Sticky Share (Desktop only) */}
                    <div className="hidden lg:block w-16 shrink-0 relative">
                        <StickyShare title={post.title} url={`/blog/${category}/${slug}`} />
                    </div>

                    {/* Main Content (70%) */}
                    <div className="w-full lg:flex-1 bg-background article-content">
                        {/* Mobile Share */}
                        <div className="lg:hidden flex justify-end mb-8 border-b border-border pb-6">
                            <button className="text-primary hover:bg-primary/5 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors w-fit border border-primary/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
                                Share Article
                            </button>
                        </div>

                        {/* Content Body */}
                        <div
                            className="prose max-w-none dark:prose-invert 
                            prose-headings:font-heading prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-foreground
                            prose-headings:scroll-mt-24
                            prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6 md:prose-h2:mt-16 md:prose-h2:mb-8
                            prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-4 md:prose-h3:mt-12 md:prose-h3:mb-6
                            prose-p:text-foreground/80 prose-p:text-lg md:prose-p:text-xl prose-p:leading-8 md:prose-p:leading-9 prose-p:mb-8
                            prose-a:text-primary prose-a:font-semibold prose-a:underline hover:prose-a:text-primary-hover
                            prose-img:rounded-2xl prose-img:shadow-md prose-img:my-10 md:prose-img:my-12
                            prose-ul:list-disc prose-ul:pl-6 prose-li:mb-4 prose-li:text-lg md:prose-li:text-xl prose-li:leading-8 md:prose-li:leading-9 prose-li:text-foreground/80
                            prose-blockquote:bg-muted/50 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:font-medium prose-blockquote:text-xl md:prose-blockquote:text-2xl prose-blockquote:my-12 prose-blockquote:not-italic"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    {/* Right Sticky Sidebar (30%) */}
                    <aside className="w-full lg:w-[320px] shrink-0 space-y-8 sticky top-24 pb-20">
                        <TableOfContents />
                        <NewsletterWidget />
                    </aside>
                </div>
            </div>

            {/* Latest Articles Section */}
            {latestPosts.length > 0 && (
                <div className="bg-muted/30 py-16 md:py-24 mt-16 border-t border-border">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-3xl font-bold font-heading mb-10 text-foreground">
                            Latest articles
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {latestPosts.map((latestPost) => (
                                <Link
                                    key={latestPost.id}
                                    href={`/blog/${latestPost.category.toLowerCase()}/${latestPost.slug}`}
                                    className="group block bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                        <img
                                            src={latestPost.coverImage || '/placeholder-image.jpg'}
                                            alt={latestPost.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                                {latestPost.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-sm text-muted-foreground font-medium mb-3">
                                            {new Date(latestPost.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <h3 className="text-xl font-bold font-heading leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                            {latestPost.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </article>
    )
}
