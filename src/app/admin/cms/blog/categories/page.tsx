import { getCategories } from '@/features/blog/category-actions'
import CategoriesManager from './CategoriesManager'

export const metadata = {
    title: 'Blog Categories | Admin',
}

export default async function BlogCategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Blog Categories</h1>
                <p className="text-muted-foreground mt-1">Add or remove blog categories. Categories are used to organize blog posts.</p>
            </div>
            <CategoriesManager categories={categories} />
        </div>
    )
}
