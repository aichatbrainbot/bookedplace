import { getSiteContent } from '@/app/actions/content'
import { Mail, MapPin, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact/ContactForm'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
    const { data: content } = await getSiteContent()

    const getValue = (key: string, fallback: string) => {
        return content?.find(c => c.key === key)?.value || fallback
    }

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col">
            {/* Page Header */}
            <div className="bg-primary pt-32 md:pt-40 pb-16 px-4">
                <div className="container mx-auto max-w-6xl text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight mb-4">
                        {getValue('contact_h1', 'Get in Touch')}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto">
                        {getValue('contact_p', "We'd love to hear from you. Our team is always here to chat.")}
                    </p>
                </div>
            </div>

            <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>
                        <ContactForm />
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                            <p className="text-muted-foreground text-lg mb-8">
                                {getValue('contact_info_text', 'Have questions about our services? Need help with a booking? Reach out to us directly.')}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-sm border border-border">
                                <div className="p-3 bg-red-50 text-[#D71616] rounded-lg">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Email Us</h3>
                                    <p className="text-muted-foreground mt-1">{getValue('contact_email', 'support@bookplace.com')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-sm border border-border">
                                <div className="p-3 bg-red-50 text-[#D71616] rounded-lg">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Call Us</h3>
                                    <p className="text-muted-foreground mt-1">{getValue('contact_phone', '+1 (555) 123-4567')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-sm border border-border">
                                <div className="p-3 bg-red-50 text-[#D71616] rounded-lg">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Visit Us</h3>
                                    <p className="text-muted-foreground mt-1">{getValue('contact_address', '123 Travel Street, New York, NY 10001')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
