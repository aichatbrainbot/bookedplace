'use client'

import { useState } from 'react'
import { updateSiteContent } from '@/app/actions/content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Search, Globe } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'

type SiteContent = {
    key: string
    value: string
}

export default function SEOEditor({ initialContent }: { initialContent: SiteContent[] }) {
    // Helper to find value or string empty
    const getValue = (key: string) => initialContent.find(i => i.key === key)?.value || ''

    const [formData, setFormData] = useState({
        seo_site_title: getValue('seo_site_title'),
        seo_description: getValue('seo_description'),
        seo_keywords: getValue('seo_keywords'),
        seo_og_image: getValue('seo_og_image'),
        seo_google_verification: getValue('seo_google_verification'),
        seo_bing_verification: getValue('seo_bing_verification'),
        seo_yandex_verification: getValue('seo_yandex_verification'),
        seo_google_analytics_id: getValue('seo_google_analytics_id'),
        settings_site_url: getValue('settings_site_url'),
    })
    const [isSaving, setIsSaving] = useState(false)

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        let tempErrors = 0

        try {
            for (const [key, value] of Object.entries(formData)) {
                const result = await updateSiteContent(key, value)
                if (!result.success) tempErrors++
            }

            if (tempErrors === 0) toast.success('SEO Settings updated successfully')
            else toast.warning('Some settings failed to save')
        } catch {
            toast.error('Error saving settings')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Card className="border-none shadow-sm bg-card">
            <CardHeader className="border-b border-border bg-card sticky top-16 z-10 rounded-t-xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                        <Search size={20} />
                    </div>
                    <h2 className="text-xl font-bold">SEO Configuration</h2>
                </div>
                <CardDescription>
                    Manage global search engine settings. These affect how your site appears in Google and social media.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="settings_site_url">Global Site URL</Label>
                        <Input
                            id="settings_site_url"
                            placeholder="e.g. https://www.bookedplace.com"
                            value={formData.settings_site_url}
                            onChange={(e) => handleInputChange('settings_site_url', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">The base URL for open graph images and canonical links.</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="seo_site_title">Global Site Title</Label>
                        <Input
                            id="seo_site_title"
                            placeholder="e.g. Booked Place - Best Hotels & Flights"
                            value={formData.seo_site_title}
                            onChange={(e) => handleInputChange('seo_site_title', e.target.value)}
                        />
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                            <p>Appended to page titles (e.g. &quot;Stays | Global Site Title&quot;).</p>
                            <p className="text-amber-600 font-medium">💡 Optimal length: 50-60 characters for best display on Google.</p>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="seo_description">Meta Description</Label>
                        <Textarea
                            id="seo_description"
                            placeholder="A brief description of your website for search results..."
                            rows={3}
                            value={formData.seo_description}
                            onChange={(e) => handleInputChange('seo_description', e.target.value)}
                        />
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                            <p>A brief description of your website for search results.</p>
                            <p className="text-amber-600 font-medium">💡 Optimal length: 110-160 characters to avoid being cut off.</p>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="seo_keywords">Keywords (Comma separated)</Label>
                        <Input
                            id="seo_keywords"
                            placeholder="travel, hotels, flights, cheap booking"
                            value={formData.seo_keywords}
                            onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Social Sharing Image URL (OG:Image)</Label>
                        <ImageUploader
                            value={formData.seo_og_image}
                            onChange={(url) => handleInputChange('seo_og_image', url)}
                        />
                        <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2 text-xs text-blue-600">
                                <Globe size={12} />
                                <span>This image will show when sharing links on Facebook, X (Twitter), Discord, etc.</span>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-xs text-amber-800 space-y-2">
                                <p className="font-semibold flex items-center gap-1">💡 Best Practices for High Click-Through Rate (CTR):</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li><strong>Recommended Size:</strong> 1200x630px. Images larger/smaller may be cropped.</li>
                                    <li><strong>Clear Headline:</strong> Include a strong, readable text title inside the image itself.</li>
                                    <li><strong>Call to Action:</strong> Add a visual button or text (like &quot;Read Now&quot;) to encourage clicks.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Globe size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Webmaster & Analytics</h2>
                    </div>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="seo_google_verification">Google Site Verification Content</Label>
                            <Input
                                id="seo_google_verification"
                                placeholder="Paste the 'content' value from the meta tag"
                                value={formData.seo_google_verification || ''}
                                onChange={(e) => handleInputChange('seo_google_verification', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="seo_bing_verification">Bing Webmaster (msvalidate.01)</Label>
                            <Input
                                id="seo_bing_verification"
                                placeholder="Paste the 'content' value"
                                value={formData.seo_bing_verification || ''}
                                onChange={(e) => handleInputChange('seo_bing_verification', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="seo_yandex_verification">Yandex Site Verification</Label>
                            <Input
                                id="seo_yandex_verification"
                                placeholder="Paste the 'content' value"
                                value={formData.seo_yandex_verification || ''}
                                onChange={(e) => handleInputChange('seo_yandex_verification', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="seo_google_analytics_id">Google Analytics 4 Measurement ID</Label>
                            <Input
                                id="seo_google_analytics_id"
                                placeholder="e.g. G-XXXXXXXXXX"
                                value={formData.seo_google_analytics_id || ''}
                                onChange={(e) => handleInputChange('seo_google_analytics_id', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="border-t border-border bg-muted/40 p-4 sticky bottom-0 z-10 rounded-b-xl flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {isSaving ? 'Saving...' : 'Update SEO Settings'}
                </Button>
            </CardFooter>
        </Card>
    )
}
