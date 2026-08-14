'use client'

import { useState } from 'react'
import { createProperty } from '@/features/stays/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ImageUploader from '@/components/admin/ImageUploader'
import { X } from 'lucide-react'

export default function NewPropertyPage() {
    const [images, setImages] = useState<string[]>([])

    const addImage = (url: string) => {
        if (url) setImages([...images, url])
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    return (
        <form action={createProperty} className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Add New Property</h2>
                    <p className="text-muted-foreground">Create a new listing for your platform.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>Discard</Button>
                    <Button type="submit">Publish Property</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Information */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>Basic details about the property.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Property Title</Label>
                                <Input id="title" name="title" placeholder="e.g. Luxury Ocean Villa" required className="text-lg" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe the property highlights, amenities, and surroundings..."
                                    className="min-h-[200px] resize-y"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="widgetCode">Widget Code (Optional)</Label>
                                <Textarea
                                    id="widgetCode"
                                    name="widgetCode"
                                    placeholder="Paste Travelpayouts or other widget HTML/JS here..."
                                    className="min-h-[150px] resize-y font-mono text-xs"
                                />
                                <p className="text-xs text-muted-foreground">This code will be rendered on the property page instead of the default booking card if provided.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Location & Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price per night ($)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input id="price" name="price" type="number" step="0.01" required className="pl-7" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" name="location" placeholder="e.g. Bali, Indonesia" required />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Settings & Media */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="category">Property Type</Label>
                                <Select name="category" defaultValue="STAY">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="STAY">Unique Stay</SelectItem>
                                        <SelectItem value="FLIGHT">Flight (Legacy)</SelectItem>
                                        <SelectItem value="ACTIVITY">Activity (Legacy)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Media Gallery</CardTitle>
                            <CardDescription>Upload property images.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Hidden input to pass the array to formData */}
                            <input type="hidden" name="images" value={JSON.stringify(images)} />

                            {images.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {images.map((url, idx) => (
                                        <div key={idx} className="relative aspect-video bg-muted rounded-md overflow-hidden group">
                                            <img src={url} alt={`Property image ${idx + 1}`} className="object-cover w-full h-full" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Add New Image</Label>
                                <ImageUploader
                                    value=""
                                    onChange={(url) => {
                                        if (url) addImage(url)
                                    }}
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Upload images one by one. The first image will be used as the primary cover photo.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
