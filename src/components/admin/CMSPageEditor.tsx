'use client'

import { useState } from 'react'
import { updateSiteContent } from '@/app/actions/content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ShieldCheck, Info, Plus, Trash2 } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type SiteContent = {
    id: number
    key: string
    value: string
    category: string | null
}

export default function CMSPageEditor({ pageId, initialContent }: { pageId: string, initialContent: SiteContent[] }) {
    const [formData, setFormData] = useState<Record<string, string>>(
        initialContent.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {})
    )
    const [isSaving, setIsSaving] = useState(false)

    // Filter items based on the pageId logic
    const visibleItems = initialContent.filter((item) => {
        if (pageId === 'home') return item.key.startsWith('home_') || item.key.startsWith('widget_home')
        if (pageId === 'contact') return item.key.startsWith('contact_')
        if (pageId === 'blog') return item.key.startsWith('blog_')
        if (pageId === 'privacy') return item.key.startsWith('privacy_')
        if (pageId === 'terms') return item.key.startsWith('terms_')
        if (pageId === 'about') return item.key.startsWith('about_')
        if (pageId === 'flights') return item.key.startsWith('flights_') || item.key === 'widget_flights'
        return true
    })

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleSaveAll = async () => {
        setIsSaving(true)
        let errorCount = 0
        let successCount = 0

        const promises = visibleItems.map(async (item) => {
            const currentValue = formData[item.key]
            if (currentValue !== item.value) {
                const result = await updateSiteContent(item.key, currentValue)
                if (result.success) successCount++
                else errorCount++
            }
        })

        try {
            await Promise.all(promises)
            if (errorCount === 0) {
                if (successCount > 0) toast.success('Changes saved successfully')
                else toast.info('No changes to save')
            } else {
                toast.warning(`Saved ${successCount} items, failed ${errorCount}`)
            }
        } catch (e) {
            console.error(e)
            toast.error('An unexpected error occurred')
        } finally {
            setIsSaving(false)
        }
    }

    const handleClearWidget = (key: string) => {
        handleInputChange(key, '')
        toast.info('Widget cleared. Click Save to persist.')
    }

    return (
        <Card className="border-none shadow-sm bg-card">
            <CardHeader className="border-b border-border bg-card sticky top-16 z-10 rounded-t-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl capitalize">{pageId} Content</CardTitle>
                        <CardDescription>
                            Edit texts, headers, and widgets for the {pageId} page.
                        </CardDescription>
                    </div>

                    {visibleItems.length > 0 && (
                        <Button
                            onClick={handleSaveAll}
                            disabled={isSaving}
                            size="sm"
                            className="bg-[#D71616] hover:bg-[#8A0000] text-white shadow-sm"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
                {visibleItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No editable content found for this section.
                    </div>
                ) : (
                    (() => {
                        // Special handling for Home Page Hero Section to create a beautiful "Sentence Builder" UI
                        const heroKeys = [
                            'home_h1', 'home_rotating_words', 'home_h1_suffix', 'home_h2',
                            'home_rotating_color', 'home_rotating_bg',
                            'home_trusted_badge_text', 'home_show_trusted_badge', 'home_trusted_badge_icon_url'
                        ]
                        const heroItems = pageId === 'home' ? visibleItems.filter(i => heroKeys.includes(i.key)) : []

                        const serviceTabsKeys = [
                            'home_show_service_tabs', 'home_service_tabs_color',
                            'home_tab_flights_show', 'home_tab_flights_label', 'home_tab_flights_icon', 'widget_home',
                            'home_tab_stays_show', 'home_tab_stays_label', 'home_tab_stays_icon', 'widget_stays',
                            'home_tab_cars_show', 'home_tab_cars_label', 'home_tab_cars_icon', 'widget_cars',
                            'home_tab_activities_show', 'home_tab_activities_label', 'home_tab_activities_icon', 'widget_activities'
                        ]
                        const serviceTabsItems = pageId === 'home' ? visibleItems.filter(i => serviceTabsKeys.includes(i.key)) : []

                        const topCategoriesKeys = [
                            'home_top_categories_show', 'home_top_cat_title',
                            'home_top_cat_1_title', 'home_top_cat_1_desc', 'home_top_cat_1_image',
                            'home_top_cat_2_title', 'home_top_cat_2_desc', 'home_top_cat_2_image',
                            'home_top_cat_3_title', 'home_top_cat_3_desc', 'home_top_cat_3_image'
                        ]
                        const topCatItems = pageId === 'home' ? visibleItems.filter(i => topCategoriesKeys.includes(i.key)) : []

                        const popularLocationsKeys = [
                            'home_popular_locations_show', 'home_popular_locations_title', 'home_popular_locations_subtitle', 'home_popular_locations_list', 'google_places_api_key'
                        ]
                        const popLocItems = pageId === 'home' ? visibleItems.filter(i => popularLocationsKeys.includes(i.key)) : []

                        const faqKeys = [
                            'home_faq_show', 'home_faq_title', 'home_faq_list'
                        ]
                        const faqItems = pageId === 'home' ? visibleItems.filter(i => faqKeys.includes(i.key)) : []

                        const aboutHeroKeys = ['about_hero_show', 'about_hero_bg_color', 'about_hero_text_color', 'about_hero_tag', 'about_hero_title', 'about_hero_desc', 'about_hero_btn_text', 'about_hero_btn_link', 'about_hero_image']
                        const aboutGlobalKeys = ['about_global_show', 'about_global_bg_color', 'about_global_text_color', 'about_global_tag', 'about_global_title', 'about_global_desc', 'about_global_image']
                        const aboutNumbersKeys = ['about_numbers_show', 'about_numbers_bg_color', 'about_numbers_text_color', 'about_numbers_title', 'about_numbers_desc', 'about_numbers_image']
                        const aboutPartnerKeys = ['about_partner_show', 'about_partner_bg_color', 'about_partner_text_color', 'about_partner_title', 'about_partner_desc', 'about_partner_link_text', 'about_partner_link_url', 'about_partner_image']
                        const aboutTreesKeys = ['about_trees_show', 'about_trees_bg_color', 'about_trees_text_color', 'about_trees_tag', 'about_trees_title', 'about_trees_desc', 'about_trees_link_text', 'about_trees_link_url', 'about_trees_image']
                        const aboutJoinKeys = ['about_join_show', 'about_join_bg_color', 'about_join_text_color', 'about_join_title', 'about_join_desc', 'about_join_link_text', 'about_join_link_url', 'about_join_image']
                        const aboutCtaKeys = ['about_cta_show', 'about_cta_bg_color', 'about_cta_text_color', 'about_cta_title', 'about_cta_desc', 'about_cta_btn_text', 'about_cta_btn_link']

                        const aboutHeroItems = pageId === 'about' ? visibleItems.filter(i => aboutHeroKeys.includes(i.key)) : []
                        const aboutGlobalItems = pageId === 'about' ? visibleItems.filter(i => aboutGlobalKeys.includes(i.key)) : []
                        const aboutNumbersItems = pageId === 'about' ? visibleItems.filter(i => aboutNumbersKeys.includes(i.key)) : []
                        const aboutPartnerItems = pageId === 'about' ? visibleItems.filter(i => aboutPartnerKeys.includes(i.key)) : []
                        const aboutTreesItems = pageId === 'about' ? visibleItems.filter(i => aboutTreesKeys.includes(i.key)) : []
                        const aboutJoinItems = pageId === 'about' ? visibleItems.filter(i => aboutJoinKeys.includes(i.key)) : []
                        const aboutCtaItems = pageId === 'about' ? visibleItems.filter(i => aboutCtaKeys.includes(i.key)) : []

                        const deprecatedKeys = [
                            'home_cheap_flights_show', 'home_cheap_flights_title', 'home_cheap_flights_subtitle', 'home_tp_api_token', 'home_tp_partner_id'
                        ]

                        // Separate other groups
                        const carouselItems = visibleItems.filter(i => i.key.match(/_bg_\d+$/))

                        const normalItems = visibleItems.filter(i =>
                            !i.key.match(/_bg_\d+$/) &&
                            !(pageId === 'home' && i.key.startsWith('widget_')) &&
                            !heroKeys.includes(i.key) &&
                            !serviceTabsKeys.includes(i.key) &&
                            !topCategoriesKeys.includes(i.key) &&
                            !popularLocationsKeys.includes(i.key) &&
                            !faqKeys.includes(i.key) &&
                            !aboutHeroKeys.includes(i.key) &&
                            !aboutGlobalKeys.includes(i.key) &&
                            !aboutNumbersKeys.includes(i.key) &&
                            !aboutPartnerKeys.includes(i.key) &&
                            !aboutTreesKeys.includes(i.key) &&
                            !aboutJoinKeys.includes(i.key) &&
                            !aboutCtaKeys.includes(i.key) &&
                            !deprecatedKeys.includes(i.key) &&
                            i.key !== 'home_hero_bg'
                        )

                        const getHeroItem = (key: string) => heroItems.find(i => i.key === key)
                        const getTabItem = (key: string) => serviceTabsItems.find(i => i.key === key)

                        return (
                            <>
                                {/* Custom Hero Editor for Home Page */}
                                {pageId === 'home' && heroItems.length > 0 && (
                                    <div className="space-y-6 p-6 bg-gradient-to-br from-background to-muted/20 rounded-xl border border-border shadow-sm mb-8">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold tracking-tight">Hero Banner Content</h3>
                                            <p className="text-sm text-muted-foreground">Configure the main headline structure and rotating styling.</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">

                                            {/* Top Badge Section */}
                                            <div className="flex flex-col md:flex-row gap-4 items-end pb-4 border-b border-dashed border-border/60">
                                                {getHeroItem('home_trusted_badge_text') && (
                                                    <div className="flex-1 space-y-2">
                                                        <Label htmlFor="home_trusted_badge_text" className="text-xs font-semibold uppercase tracking-wider text-yellow-600 flex items-center gap-1">
                                                            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1 animate-pulse" />
                                                            Trusted Badge Text
                                                        </Label>
                                                        <Input
                                                            id="home_trusted_badge_text"
                                                            value={formData['home_trusted_badge_text'] || ''}
                                                            onChange={(e) => handleInputChange('home_trusted_badge_text', e.target.value)}
                                                            className="h-10 text-sm bg-yellow-50/50 border-yellow-200 text-yellow-800 focus-visible:ring-yellow-400"
                                                            placeholder="e.g. Trusted by 1 Million+ Travelers"
                                                        />
                                                    </div>
                                                )}

                                                {getHeroItem('home_show_trusted_badge') && (
                                                    <div className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card h-10 mb-0.5">
                                                        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Show Badge</span>
                                                        <Switch
                                                            checked={formData['home_show_trusted_badge'] === 'true'}
                                                            onCheckedChange={(checked) => handleInputChange('home_show_trusted_badge', String(checked))}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Badge Icon Upload */}
                                            {getHeroItem('home_trusted_badge_icon_url') && (
                                                <div className="space-y-2 pb-4 border-b border-dashed border-border/60">
                                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                                        Trusted Badge Icon
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground mb-2">Upload a custom SVG icon (optional). Leave empty to use default.</p>
                                                    <div className="bg-background p-2 rounded-lg border border-border w-full max-w-sm">
                                                        <ImageUploader
                                                            value={formData['home_trusted_badge_icon_url']}
                                                            onChange={(url) => handleInputChange('home_trusted_badge_icon_url', url)}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Headline Row */}
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                                {/* Start Phrase */}
                                                {getHeroItem('home_h1') && (
                                                    <div className="md:col-span-4 space-y-2">
                                                        <Label htmlFor="home_h1" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Headline Start</Label>
                                                        <Input
                                                            id="home_h1"
                                                            value={formData['home_h1'] || ''}
                                                            onChange={(e) => handleInputChange('home_h1', e.target.value)}
                                                            className="h-11 text-base bg-background"
                                                            placeholder="e.g. Booked Place, Where"
                                                        />
                                                    </div>
                                                )}

                                                {/* Rotating Words */}
                                                {getHeroItem('home_rotating_words') && (
                                                    <div className="md:col-span-4 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor="home_rotating_words" className="text-xs font-semibold uppercase tracking-wider text-red-500">Rotating Words</Label>
                                                            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Comma Separated</span>
                                                        </div>
                                                        <Input
                                                            id="home_rotating_words"
                                                            value={formData['home_rotating_words'] || ''}
                                                            onChange={(e) => handleInputChange('home_rotating_words', e.target.value)}
                                                            className="h-11 text-base bg-red-50/50 border-red-200 text-red-700 focus-visible:ring-red-500"
                                                            placeholder="e.g. Foodies, Travelers"
                                                        />
                                                    </div>
                                                )}

                                                {/* End Phrase */}
                                                {getHeroItem('home_h1_suffix') && (
                                                    <div className="md:col-span-4 space-y-2">
                                                        <Label htmlFor="home_h1_suffix" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Headline End</Label>
                                                        <Input
                                                            id="home_h1_suffix"
                                                            value={formData['home_h1_suffix'] || ''}
                                                            onChange={(e) => handleInputChange('home_h1_suffix', e.target.value)}
                                                            className="h-11 text-base bg-background"
                                                            placeholder="e.g. Meet"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Style Controls Row */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed border-border/60">
                                                {/* Color Selector */}
                                                {getHeroItem('home_rotating_color') && (
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rotating Text Color</Label>
                                                        <Select
                                                            value={formData['home_rotating_color'] || 'red'}
                                                            onValueChange={(val) => handleInputChange('home_rotating_color', val)}
                                                        >
                                                            <SelectTrigger className="h-10">
                                                                <SelectValue placeholder="Select color" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="red">Red</SelectItem>
                                                                <SelectItem value="blue">Blue</SelectItem>
                                                                <SelectItem value="green">Green</SelectItem>
                                                                <SelectItem value="yellow">Yellow</SelectItem>
                                                                <SelectItem value="orange">Orange</SelectItem>
                                                                <SelectItem value="purple">Purple</SelectItem>
                                                                <SelectItem value="pink">Pink</SelectItem>
                                                                <SelectItem value="white">White</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}

                                                {/* Background Toggle */}
                                                {getHeroItem('home_rotating_bg') && (
                                                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                                                        <div className="space-y-0.5">
                                                            <Label className="text-sm font-medium">Glass Background</Label>
                                                            <p className="text-xs text-muted-foreground">Show translucent backdrop behind words</p>
                                                        </div>
                                                        <Switch
                                                            checked={formData['home_rotating_bg'] === 'true'}
                                                            onCheckedChange={(checked) => handleInputChange('home_rotating_bg', String(checked))}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Subheadline Layout */}
                                            {getHeroItem('home_h2') && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="home_h2" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subheadline</Label>
                                                    <Textarea
                                                        id="home_h2"
                                                        value={formData['home_h2'] || ''}
                                                        onChange={(e) => handleInputChange('home_h2', e.target.value)}
                                                        rows={2}
                                                        className="min-h-[80px] text-base resize-y bg-background"
                                                        placeholder="Enter the subtitle text..."
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Service Tabs Configuration */}
                                {pageId === 'home' && serviceTabsItems.length > 0 && (
                                    <div className="space-y-6 pt-6 border-t border-border mt-8">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold tracking-tight text-orange-600 dark:text-orange-500">Service Tabs Configurations</h3>
                                            <p className="text-sm text-muted-foreground">Manage the visibility, labels, icons, and widget codes for all tabs inside the hero banner.</p>
                                        </div>

                                        {/* Main Toggles */}
                                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                                            {getTabItem('home_show_service_tabs') && (
                                                <div className="flex bg-card p-4 rounded-xl border border-border items-center justify-between w-full md:w-1/2">
                                                    <div>
                                                        <h4 className="font-semibold text-sm">Enable Entire Feature</h4>
                                                        <p className="text-xs text-muted-foreground">Toggles the entire Kayak-style tabs banner.</p>
                                                    </div>
                                                    <Switch
                                                        checked={formData['home_show_service_tabs'] === 'true'}
                                                        onCheckedChange={(checked) => handleInputChange('home_show_service_tabs', String(checked))}
                                                    />
                                                </div>
                                            )}
                                            {getTabItem('home_service_tabs_color') && (
                                                <div className="flex bg-card p-4 rounded-xl border border-border items-center justify-between w-full md:w-1/2">
                                                    <div>
                                                        <h4 className="font-semibold text-sm">Active Tab Color</h4>
                                                        <p className="text-xs text-muted-foreground">Select the gradient theme for the active tab.</p>
                                                    </div>
                                                    <Select
                                                        value={formData['home_service_tabs_color'] || 'orange'}
                                                        onValueChange={(val) => handleInputChange('home_service_tabs_color', val)}
                                                    >
                                                        <SelectTrigger className="w-32 h-8">
                                                            <SelectValue placeholder="Theme" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="red">Red</SelectItem>
                                                            <SelectItem value="orange">Orange</SelectItem>
                                                            <SelectItem value="blue">Blue</SelectItem>
                                                            <SelectItem value="green">Green</SelectItem>
                                                            <SelectItem value="yellow">Yellow</SelectItem>
                                                            <SelectItem value="purple">Purple</SelectItem>
                                                            <SelectItem value="pink">Pink</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                        </div>

                                        {/* Individual Tabs */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {[
                                                { id: 'flights', title: 'Flights Section', codeKey: 'widget_home' },
                                                { id: 'stays', title: 'Stays Section', codeKey: 'widget_stays' },
                                                { id: 'cars', title: 'Cars Section', codeKey: 'widget_cars' },
                                                { id: 'activities', title: 'Activities Section', codeKey: 'widget_activities' }
                                            ].map((tab) => (
                                                <div key={tab.id} className="space-y-4 p-5 bg-card border border-border rounded-xl shadow-sm transition-opacity" style={{ opacity: formData[`home_tab_${tab.id}_show`] === 'false' ? 0.6 : 1 }}>
                                                    <div className="flex items-center justify-between bg-muted/50 p-2 rounded-lg -m-2 mb-2">
                                                        <h4 className="font-semibold text-sm capitalize">{tab.title}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-medium text-muted-foreground">Show</span>
                                                            <Switch
                                                                checked={formData[`home_tab_${tab.id}_show`] === 'true'}
                                                                onCheckedChange={(checked) => handleInputChange(`home_tab_${tab.id}_show`, String(checked))}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`home_tab_${tab.id}_label`} className="text-xs text-muted-foreground">Display Name</Label>
                                                            <Input
                                                                id={`home_tab_${tab.id}_label`}
                                                                value={formData[`home_tab_${tab.id}_label`] || ''}
                                                                onChange={(e) => handleInputChange(`home_tab_${tab.id}_label`, e.target.value)}
                                                                className="bg-background h-9 text-sm"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`home_tab_${tab.id}_icon`} className="text-xs text-muted-foreground">Custom Icon (SVG/PNG)</Label>
                                                            <div className="bg-background p-2 rounded-lg border border-border flex items-center justify-center min-h-[5rem]">
                                                                <ImageUploader
                                                                    value={formData[`home_tab_${tab.id}_icon`]}
                                                                    onChange={(url) => handleInputChange(`home_tab_${tab.id}_icon`, url)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 pt-2 border-t border-border">
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor={tab.codeKey} className="text-xs text-muted-foreground">Widget Injection Code</Label>
                                                            <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-sm">
                                                                <ShieldCheck size={12} /> Safe Mode
                                                            </div>
                                                        </div>
                                                        <Textarea
                                                            id={tab.codeKey}
                                                            value={formData[tab.codeKey] || ''}
                                                            onChange={(e) => handleInputChange(tab.codeKey, e.target.value)}
                                                            rows={6}
                                                            className="font-mono text-xs bg-gray-900 text-gray-100 border-gray-800"
                                                            placeholder="<script>...</script>"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* About Page Sections UI */}
                                {pageId === 'about' && [
                                    { title: 'Hero Banner Section', desc: 'Main banner at the top of the About page', items: aboutHeroItems },
                                    { title: 'Global Presence Section', desc: 'Section highlighting worldwide reach', items: aboutGlobalItems },
                                    { title: 'Stats & Numbers Section', desc: 'Highlighting company facts and numbers', items: aboutNumbersItems },
                                    { title: 'Partner / Affiliate Section', desc: 'Call to action for potential partners', items: aboutPartnerItems },
                                    { title: 'Eco-Friendly Mission (Trees)', desc: 'Section concerning carbon footprint and green initiatives', items: aboutTreesItems },
                                    { title: 'Join Our Team (Careers)', desc: 'Recruitment and remote work section', items: aboutJoinItems },
                                    { title: 'Bottom Call to Action', desc: 'Final hook for users to engage', items: aboutCtaItems },
                                ].map(section => {
                                    if (section.items.length === 0) return null;
                                    return (
                                        <div key={section.title} className="space-y-6 pt-6 border-t border-border mt-8">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold tracking-tight">{section.title}</h3>
                                                <p className="text-sm text-muted-foreground">{section.desc}</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-5 bg-card border border-border rounded-xl shadow-sm">
                                                {section.items.map(item => {
                                                    const isFullWidth = item.key.includes('_desc') || item.key.includes('_text') || item.key.includes('_image')
                                                    return (
                                                        <div key={item.key} className={`space-y-2 ${isFullWidth ? 'md:col-span-2' : ''}`}>
                                                            {!item.key.includes('_show') && (
                                                                <Label htmlFor={item.key} className="text-sm font-semibold capitalize text-muted-foreground block mb-2">
                                                                    {item.key.includes('_bg_color') ? 'Background Color' : item.key.includes('_text_color') ? 'Text Color' : item.key.split('_').slice(2).join(' ')}
                                                                </Label>
                                                            )}

                                                            {item.key.includes('_show') ? (
                                                                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border border-border">
                                                                    <Switch
                                                                        id={item.key}
                                                                        checked={formData[item.key] === 'true'}
                                                                        onCheckedChange={(checked) => handleInputChange(item.key, checked ? 'true' : 'false')}
                                                                    />
                                                                    <Label htmlFor={item.key} className="text-sm font-bold cursor-pointer">
                                                                        Show Section
                                                                    </Label>
                                                                </div>
                                                            ) : item.key.includes('_color') ? (
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        type="color"
                                                                        id={item.key}
                                                                        value={formData[item.key] || '#ffffff'}
                                                                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                                                                        className="w-12 h-10 p-1 cursor-pointer bg-background"
                                                                    />
                                                                    <Input
                                                                        type="text"
                                                                        value={formData[item.key] || '#ffffff'}
                                                                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                                                                        className="flex-1 bg-background h-10 text-sm font-mono uppercase"
                                                                    />
                                                                </div>
                                                            ) : item.key.includes('_desc') ? (
                                                                <Textarea
                                                                    id={item.key}
                                                                    value={formData[item.key] || ''}
                                                                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                                                                    rows={3}
                                                                    className="bg-background text-sm resize-y"
                                                                />
                                                            ) : item.key.includes('_image') ? (
                                                                <div className="bg-background p-2 rounded-lg border border-border">
                                                                    <ImageUploader
                                                                        value={formData[item.key]}
                                                                        onChange={(url) => handleInputChange(item.key, url)}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <Input
                                                                    id={item.key}
                                                                    value={formData[item.key] || ''}
                                                                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                                                                    className="bg-background h-10 text-sm"
                                                                />
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}

                                {/* Normal Items */}
                                {normalItems.length > 0 && normalItems.map((item) => {
                                    const isWidget = item.key.startsWith('widget_')
                                    return (
                                        <div key={item.key} className="space-y-3 p-4 bg-muted/30 rounded-xl border border-border">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor={item.key} className="text-sm font-semibold text-foreground capitalize">
                                                    {item.key === 'home_h1' ? 'Headline Start (Before Rotating)' :
                                                        item.key === 'home_h1_suffix' ? 'Headline End (After Rotating)' :
                                                            item.key === 'home_rotating_words' ? 'Rotating Words' :
                                                                item.key.replace(/_/g, ' ').replace(pageId + ' ', '')}
                                                </Label>
                                                {isWidget && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-medium border border-green-100">
                                                            <ShieldCheck size={12} />
                                                            Safe Mode
                                                        </div>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-6 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">Clear</Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Clear Widget?</AlertDialogTitle>
                                                                    <AlertDialogDescription>This will remove the code. Cannot be undone.</AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleClearWidget(item.key)} className="bg-destructive">Clear</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                )}
                                            </div>

                                            {isWidget ? (
                                                <div className="relative">
                                                    <Textarea
                                                        id={item.key}
                                                        value={formData[item.key] || ''}
                                                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                                                        rows={8}
                                                        className="font-mono text-xs bg-gray-900 text-gray-100 border-gray-800 focus-visible:ring-gray-400"
                                                        placeholder="<script>...</script>"
                                                    />
                                                    <div className="absolute top-2 right-2 flex gap-1">
                                                        <div className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-help" title="Scripts are sandboxed">
                                                            <Info size={12} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                formData[item.key]?.length > 60 || item.key.includes('_p') ? (
                                                    <Textarea
                                                        id={item.key}
                                                        value={formData[item.key] || ''}
                                                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                                                        rows={3}
                                                        className="bg-background"
                                                    />
                                                ) : item.key.endsWith('_image') || item.key.includes('_bg') ? (
                                                    <div className="bg-background p-2 rounded-lg border border-border">
                                                        <ImageUploader
                                                            value={formData[item.key]}
                                                            onChange={(url) => handleInputChange(item.key, url)}
                                                        />
                                                    </div>
                                                ) : item.key.endsWith('_html') || item.key.endsWith('_body') || item.key.endsWith('_content') ? (
                                                    <RichTextEditor
                                                        value={formData[item.key] || ''}
                                                        onChange={(html) => handleInputChange(item.key, html)}
                                                    />
                                                ) : (
                                                    <Input
                                                        id={item.key}
                                                        value={formData[item.key] || ''}
                                                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                                                        className="bg-background"
                                                    />
                                                )
                                            )}
                                        </div>
                                    )
                                })}

                                {carouselItems.length > 0 && (
                                    <div className="space-y-4 pt-4 border-t border-border">
                                        <h3 className="text-lg font-semibold capitalize">Background Carousel Images</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {carouselItems.map((item) => (
                                                <div key={item.key} className="space-y-2 p-3 bg-muted/30 rounded-xl border border-border">
                                                    <Label htmlFor={item.key} className="text-xs font-semibold text-foreground capitalize">
                                                        Image {item.key.split('_').pop()}
                                                    </Label>
                                                    <div className="bg-background p-2 rounded-lg border border-border">
                                                        <ImageUploader
                                                            value={formData[item.key]}
                                                            onChange={(url) => handleInputChange(item.key, url)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Top Categories UI */}
                                {topCatItems.length > 0 && (
                                    <div className="space-y-6 pt-6 border-t border-border mt-8">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold tracking-tight">Top Categories Section</h3>
                                            <p className="text-sm text-muted-foreground">Configure the three main feature cards shown on the homepage.</p>
                                        </div>

                                        <div className="flex bg-card p-4 rounded-xl border border-border items-center justify-between mb-4">
                                            <div>
                                                <h4 className="font-semibold text-sm">Enable Top Categories Section</h4>
                                                <p className="text-xs text-muted-foreground">Toggles the entire three-card container on the homepage.</p>
                                            </div>
                                            <Switch
                                                checked={formData['home_top_categories_show'] === 'true'}
                                                onCheckedChange={(checked) => handleInputChange('home_top_categories_show', String(checked))}
                                            />
                                        </div>

                                        <div className="space-y-2 p-4 bg-muted/20 border border-border rounded-xl">
                                            <Label htmlFor="home_top_cat_title" className="text-sm font-semibold">Section Title</Label>
                                            <Input
                                                id="home_top_cat_title"
                                                value={formData['home_top_cat_title'] || ''}
                                                onChange={(e) => handleInputChange('home_top_cat_title', e.target.value)}
                                                className="bg-background max-w-md"
                                                placeholder="e.g. Pour les pros du voyage"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {[1, 2, 3].map((num) => (
                                                <div key={`cat-${num}`} className="space-y-4 p-5 bg-card border border-border rounded-xl shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold px-2 py-1 bg-muted/50 rounded-md inline-block text-sm">Card {num}</h4>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor={`home_top_cat_${num}_title`} className="text-xs text-muted-foreground">Title</Label>
                                                        <Input
                                                            id={`home_top_cat_${num}_title`}
                                                            value={formData[`home_top_cat_${num}_title`] || ''}
                                                            onChange={(e) => handleInputChange(`home_top_cat_${num}_title`, e.target.value)}
                                                            className="bg-background h-9 text-sm font-semibold"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor={`home_top_cat_${num}_desc`} className="text-xs text-muted-foreground">Subtitle / Description</Label>
                                                        <Textarea
                                                            id={`home_top_cat_${num}_desc`}
                                                            value={formData[`home_top_cat_${num}_desc`] || ''}
                                                            onChange={(e) => handleInputChange(`home_top_cat_${num}_desc`, e.target.value)}
                                                            rows={2}
                                                            className="bg-background text-sm resize-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-2 pt-2 border-t border-dashed border-border/50">
                                                        <Label className="text-xs text-muted-foreground">Image Display (PNG/SVG)</Label>
                                                        <div className="bg-background p-2 rounded-lg border border-border border-dashed h-40 flex items-center justify-center relative overflow-hidden">
                                                            <ImageUploader
                                                                value={formData[`home_top_cat_${num}_image`]}
                                                                onChange={(url) => handleInputChange(`home_top_cat_${num}_image`, url)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Popular Locations UI */}
                                {popLocItems.length > 0 && (
                                    <div className="space-y-6 pt-6 border-t border-border mt-8">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold tracking-tight text-indigo-900 dark:text-indigo-400">Popular Locations Section</h3>
                                                <p className="text-sm text-muted-foreground">Configure the locations grid driven by Google Places API.</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="home_popular_locations_show"
                                                    checked={formData['home_popular_locations_show'] === 'true'}
                                                    onCheckedChange={(checked) => handleInputChange('home_popular_locations_show', checked ? 'true' : 'false')}
                                                />
                                                <Label htmlFor="home_popular_locations_show">Visible</Label>
                                            </div>
                                        </div>

                                        <div className="space-y-4 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl shadow-sm">
                                            {/* API Key */}
                                            <div className="space-y-2 pb-4 border-b border-indigo-100 dark:border-indigo-900/50">
                                                <Label htmlFor="google_places_api_key" className="text-sm font-semibold flex items-center gap-2">
                                                    Google Places API Key
                                                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 uppercase font-bold tracking-wider">Required</span>
                                                </Label>
                                                <p className="text-xs text-muted-foreground">Used to fetch high-res location photos and coordinates.</p>
                                                <div className="relative">
                                                    <Input
                                                        id="google_places_api_key"
                                                        type="password"
                                                        value={formData['google_places_api_key'] || ''}
                                                        onChange={(e) => handleInputChange('google_places_api_key', e.target.value)}
                                                        className="bg-background max-w-lg font-mono text-sm pr-10"
                                                        placeholder="AIzaSy..."
                                                    />
                                                    <ShieldCheck className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="home_popular_locations_title" className="text-sm font-semibold">Section Title</Label>
                                                    <Input
                                                        id="home_popular_locations_title"
                                                        value={formData['home_popular_locations_title'] || ''}
                                                        onChange={(e) => handleInputChange('home_popular_locations_title', e.target.value)}
                                                        className="bg-background"
                                                        placeholder="e.g. Popular Locations"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="home_popular_locations_subtitle" className="text-sm font-semibold">Section Subtitle</Label>
                                                    <Textarea
                                                        id="home_popular_locations_subtitle"
                                                        value={formData['home_popular_locations_subtitle'] || ''}
                                                        onChange={(e) => handleInputChange('home_popular_locations_subtitle', e.target.value)}
                                                        rows={2}
                                                        className="bg-background text-sm resize-y min-h-[42px]"
                                                        placeholder="e.g. Connecting Needs with Offers..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2 pt-2">
                                                <Label htmlFor="home_popular_locations_list" className="text-sm font-semibold text-indigo-900 dark:text-indigo-400">Locations List</Label>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    Enter cities or countries separated by commas. These will be fetched via the Google Places API.<br />
                                                    <strong>Format:</strong> <code className="bg-muted px-1 rounded">Denmark, Belgium, Mexico, Indonesia, Romania, India</code>
                                                </p>
                                                <Textarea
                                                    id="home_popular_locations_list"
                                                    value={formData['home_popular_locations_list'] || ''}
                                                    onChange={(e) => handleInputChange('home_popular_locations_list', e.target.value)}
                                                    rows={3}
                                                    className="bg-background text-sm font-medium leading-relaxed font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* FAQ Section UI */}
                                {faqItems.length > 0 && (
                                    <div className="space-y-6 pt-6 border-t border-border mt-8">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold tracking-tight text-blue-900 dark:text-blue-400">FAQ Section</h3>
                                                <p className="text-sm text-muted-foreground">Manage the Frequently Asked Questions displayed on the landing page.</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="home_faq_show"
                                                    checked={formData['home_faq_show'] === 'true'}
                                                    onCheckedChange={(checked) => handleInputChange('home_faq_show', checked ? 'true' : 'false')}
                                                />
                                                <Label htmlFor="home_faq_show">Visible</Label>
                                            </div>
                                        </div>

                                        <div className="space-y-4 p-5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 rounded-xl shadow-sm">
                                            <div className="space-y-2">
                                                <Label htmlFor="home_faq_title" className="text-sm font-semibold">Section Title</Label>
                                                <Input
                                                    id="home_faq_title"
                                                    value={formData['home_faq_title'] || ''}
                                                    onChange={(e) => handleInputChange('home_faq_title', e.target.value)}
                                                    className="bg-background max-w-md"
                                                    placeholder="e.g. Frequently Asked Questions"
                                                />
                                            </div>

                                            <div className="space-y-3 pt-4 border-t border-blue-100 dark:border-blue-900/50">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-sm font-semibold text-blue-900 dark:text-blue-400">Questions & Answers</Label>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 gap-1.5 bg-white dark:bg-neutral-900"
                                                        onClick={() => {
                                                            try {
                                                                const list = JSON.parse(formData['home_faq_list'] || '[]');
                                                                list.push({ question: 'New Question', answer: 'New Answer' });
                                                                handleInputChange('home_faq_list', JSON.stringify(list));
                                                            } catch (e) {
                                                                handleInputChange('home_faq_list', JSON.stringify([{ question: 'New Question', answer: 'New Answer' }]));
                                                            }
                                                        }}
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                        Add Q&A
                                                    </Button>
                                                </div>

                                                <div className="space-y-4">
                                                    {(() => {
                                                        let faqList: { question: string, answer: string }[] = [];
                                                        try {
                                                            faqList = JSON.parse(formData['home_faq_list'] || '[]');
                                                        } catch (e) {
                                                            faqList = [];
                                                        }

                                                        if (faqList.length === 0) {
                                                            return <p className="text-xs text-muted-foreground italic">No questions added yet.</p>
                                                        }

                                                        return faqList.map((item, index) => (
                                                            <div key={index} className="flex gap-4 p-4 bg-background border border-border rounded-lg shadow-sm relative group">
                                                                <div className="flex-1 space-y-3">
                                                                    <div className="space-y-1">
                                                                        <Label className="text-xs text-muted-foreground">Question</Label>
                                                                        <Input
                                                                            value={item.question}
                                                                            onChange={(e) => {
                                                                                const newList = [...faqList];
                                                                                newList[index] = { ...item, question: e.target.value };
                                                                                handleInputChange('home_faq_list', JSON.stringify(newList));
                                                                            }}
                                                                            className="text-sm font-medium"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <Label className="text-xs text-muted-foreground">Answer</Label>
                                                                        <Textarea
                                                                            value={item.answer}
                                                                            onChange={(e) => {
                                                                                const newList = [...faqList];
                                                                                newList[index] = { ...item, answer: e.target.value };
                                                                                handleInputChange('home_faq_list', JSON.stringify(newList));
                                                                            }}
                                                                            rows={2}
                                                                            className="text-sm resize-none"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity self-start mt-6 bg-red-50 hover:bg-red-100 hover:text-red-700 dark:bg-red-950/20 dark:hover:bg-red-900/50"
                                                                    onClick={() => {
                                                                        const newList = faqList.filter((_, i) => i !== index);
                                                                        handleInputChange('home_faq_list', JSON.stringify(newList));
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ))
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )
                    })()
                )}
            </CardContent>


        </Card>
    )
}
