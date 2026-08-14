'use client'

import { useState } from 'react'
import { updateSiteContent } from '@/app/actions/content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Settings, Image as ImageIcon, AtSign, Link as LinkIcon, PlusCircle } from 'lucide-react'
import ImageUploader from '@/components/admin/ImageUploader'

type SiteContent = {
    key: string
    value: string
}

export default function SettingsEditor({ initialContent }: { initialContent: SiteContent[] }) {
    const getValue = (key: string) => initialContent.find(i => i.key === key)?.value || ''

    const [formData, setFormData] = useState({
        settings_site_title: getValue('settings_site_title'),
        settings_logo_url: getValue('settings_logo_url'),
        settings_favicon_url: getValue('settings_favicon_url'),
        settings_footer_logo_url: getValue('settings_footer_logo_url'),
        settings_footer_description: getValue('settings_footer_description'),
        settings_contact_email: getValue('settings_contact_email'),
        settings_facebook: getValue('settings_facebook'),
        settings_instagram: getValue('settings_instagram'),
        settings_twitter: getValue('settings_twitter'),
        settings_footer_show_blog: getValue('settings_footer_show_blog') !== 'false',
        settings_footer_show_activities: getValue('settings_footer_show_activities') !== 'false',
        settings_footer_show_stays: getValue('settings_footer_show_stays') !== 'false',
        settings_footer_show_contact: getValue('settings_footer_show_contact') !== 'false',
        settings_footer_show_admin: getValue('settings_footer_show_admin') !== 'false',
        settings_footer_show_privacy: getValue('settings_footer_show_privacy') !== 'false',
        settings_footer_show_terms: getValue('settings_footer_show_terms') !== 'false',

        // Custom Footer Link
        settings_footer_custom_link_show: getValue('settings_footer_custom_link_show') === 'true',
        settings_footer_custom_link_name: getValue('settings_footer_custom_link_name') || '',
        settings_footer_custom_link_url: getValue('settings_footer_custom_link_url') || '',
        settings_footer_custom_link_section: getValue('settings_footer_custom_link_section') || 'discover',
    })
    const [isSaving, setIsSaving] = useState(false)

    const handleInputChange = (key: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        let tempErrors = 0

        try {
            for (const [key, value] of Object.entries(formData)) {
                const strValue = typeof value === 'boolean' ? String(value) : value
                const result = await updateSiteContent(key, strValue)
                if (!result.success) tempErrors++
            }

            if (tempErrors === 0) toast.success('Settings updated successfully')
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
                    <div className="p-2 bg-muted text-muted-foreground rounded-lg">
                        <Settings size={20} />
                    </div>
                    <h2 className="text-xl font-bold">General Settings</h2>
                </div>
                <CardDescription>
                    Configure your site&apos;s branding and contact information.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
                <div className="space-y-6">
                    {/* Branding */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Branding</h3>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="settings_site_title">Site Title (Brand Name)</Label>
                                <Input
                                    id="settings_site_title"
                                    placeholder="Booked.Place"
                                    value={formData.settings_site_title}
                                    onChange={(e) => handleInputChange('settings_site_title', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="settings_logo_url" className="flex items-center gap-2">
                                    <ImageIcon size={14} /> Main Logo
                                </Label>
                                <ImageUploader
                                    value={formData.settings_logo_url}
                                    onChange={(url) => handleInputChange('settings_logo_url', url)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="settings_favicon_url" className="flex items-center gap-2">
                                    <ImageIcon size={14} /> Favicon
                                </Label>
                                <ImageUploader
                                    value={formData.settings_favicon_url}
                                    onChange={(url) => handleInputChange('settings_favicon_url', url)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Content */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Footer Setup</h3>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="settings_footer_logo_url" className="flex items-center gap-2">
                                    <ImageIcon size={14} /> Footer Logo
                                </Label>
                                <ImageUploader
                                    value={formData.settings_footer_logo_url}
                                    onChange={(url) => handleInputChange('settings_footer_logo_url', url)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="settings_footer_description">Footer Description</Label>
                                <Input
                                    id="settings_footer_description"
                                    placeholder="Your site description..."
                                    value={formData.settings_footer_description}
                                    onChange={(e) => handleInputChange('settings_footer_description', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Footer URLs Visibility Toggles */}
                        <div className="mt-6 pt-4 border-t border-border border-dashed">
                            <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                                <LinkIcon size={14} /> Footer Links Visibility
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 bg-muted/20 p-4 rounded-xl border border-border/50">
                                {[
                                    { key: 'settings_footer_show_blog', label: 'Blog Link' },
                                    { key: 'settings_footer_show_activities', label: 'Activities Link' },
                                    { key: 'settings_footer_show_stays', label: 'Stays Link' },
                                    { key: 'settings_footer_show_contact', label: 'Contact Us Link' },
                                    { key: 'settings_footer_show_admin', label: 'Admin Login Link' },
                                    { key: 'settings_footer_show_privacy', label: 'Privacy Policy Link' },
                                    { key: 'settings_footer_show_terms', label: 'Terms of Service Link' },
                                ].map(({ key, label }) => (
                                    <div key={key} className="flex items-center justify-between space-x-2">
                                        <Label htmlFor={key} className="text-sm text-foreground/80 cursor-pointer">{label}</Label>
                                        <Switch
                                            id={key}
                                            checked={formData[key as keyof typeof formData] as boolean}
                                            onCheckedChange={(checked) => handleInputChange(key, checked)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Custom Footer Link Setup */}
                        <div className="mt-6 pt-6 border-t border-border border-dashed">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <PlusCircle size={14} /> Custom Footer Link
                                </h4>
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="settings_footer_custom_link_show" className="text-sm font-medium">Show Custom Link</Label>
                                    <Switch
                                        id="settings_footer_custom_link_show"
                                        checked={formData.settings_footer_custom_link_show as boolean}
                                        onCheckedChange={(checked) => handleInputChange('settings_footer_custom_link_show', checked)}
                                    />
                                </div>
                            </div>

                            {formData.settings_footer_custom_link_show && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/10 p-4 rounded-xl border border-border/40">
                                    <div className="grid gap-2">
                                        <Label htmlFor="settings_footer_custom_link_name">Link Name</Label>
                                        <Input
                                            id="settings_footer_custom_link_name"
                                            placeholder="e.g. Our Partners"
                                            value={formData.settings_footer_custom_link_name as string}
                                            onChange={(e) => handleInputChange('settings_footer_custom_link_name', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="settings_footer_custom_link_url">Link URL</Label>
                                        <Input
                                            id="settings_footer_custom_link_url"
                                            placeholder="https://..."
                                            value={formData.settings_footer_custom_link_url as string}
                                            onChange={(e) => handleInputChange('settings_footer_custom_link_url', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Footer Column</Label>
                                        <Select
                                            value={formData.settings_footer_custom_link_section as string}
                                            onValueChange={(value) => handleInputChange('settings_footer_custom_link_section', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select column" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="discover">Discover</SelectItem>
                                                <SelectItem value="support">Support</SelectItem>
                                                <SelectItem value="legal">Legal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Contact Info</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="settings_contact_email" className="flex items-center gap-2">
                                <AtSign size={14} /> Contact Email
                            </Label>
                            <Input
                                id="settings_contact_email"
                                placeholder="support@booked.place"
                                value={formData.settings_contact_email}
                                onChange={(e) => handleInputChange('settings_contact_email', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Social Media</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="settings_facebook">Facebook URL</Label>
                                <Input
                                    id="settings_facebook"
                                    placeholder="https://facebook.com/..."
                                    value={formData.settings_facebook}
                                    onChange={(e) => handleInputChange('settings_facebook', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="settings_instagram">Instagram URL</Label>
                                <Input
                                    id="settings_instagram"
                                    placeholder="https://instagram.com/..."
                                    value={formData.settings_instagram}
                                    onChange={(e) => handleInputChange('settings_instagram', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="settings_twitter">Twitter/X URL</Label>
                                <Input
                                    id="settings_twitter"
                                    placeholder="https://twitter.com/..."
                                    value={formData.settings_twitter}
                                    onChange={(e) => handleInputChange('settings_twitter', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="border-t border-border bg-muted/40 p-4 sticky bottom-0 z-10 rounded-b-xl flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
            </CardFooter>
        </Card>
    )
}
