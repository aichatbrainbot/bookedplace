'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { sendContactMessage } from '@/features/contact/actions'
import { toast } from 'sonner'

export function ContactForm() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Math Captcha State
    const [num1, setNum1] = useState(0)
    const [num2, setNum2] = useState(0)
    const [captchaAnswer, setCaptchaAnswer] = useState('')

    // Generate new captcha numbers when component mounts or on successful submission
    const generateCaptcha = () => {
        setNum1(Math.floor(Math.random() * 10) + 1)
        setNum2(Math.floor(Math.random() * 10) + 1)
        setCaptchaAnswer('')
    }

    useEffect(() => {
        generateCaptcha()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!firstName || !lastName || !email || !message) {
            toast.error("Please fill in all fields.")
            return
        }

        // Validate Captcha locally before sending
        if (parseInt(captchaAnswer) !== num1 + num2) {
            toast.error("Incorrect math answer. Please try again to prove you are human.")
            generateCaptcha() // Reset to prevent brute force
            return
        }

        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append('name', `${firstName} ${lastName}`)
            formData.append('email', email)
            formData.append('message', message)

            // Pass the intended answer as proof (though mostly validated client-side for this simple implementation)
            formData.append('captchaAnswer', captchaAnswer)
            formData.append('expectedCaptcha', (num1 + num2).toString())

            const result = await sendContactMessage(formData)

            if (result.success) {
                toast.success("Message sent successfully! We will get back to you soon.")
                // Reset form
                setFirstName('')
                setLastName('')
                setEmail('')
                setMessage('')
                generateCaptcha()
            } else {
                toast.error(result.error || "Failed to send message.")
            }
        } catch (error) {
            console.error('Submit error:', error)
            toast.error("An unexpected error occurred.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">First name</label>
                    <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="bg-background"
                        disabled={isSubmitting}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last name</label>
                    <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="bg-background"
                        disabled={isSubmitting}
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="bg-background"
                    disabled={isSubmitting}
                    required
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    className="min-h-[150px] bg-background"
                    disabled={isSubmitting}
                    required
                />
            </div>

            {/* Math Captcha Section */}
            <div className="bg-muted p-4 rounded-lg border border-border flex items-center gap-4">
                <div className="flex-1">
                    <label htmlFor="captcha" className="text-sm font-medium text-foreground block mb-2">
                        Security Question: What is {num1} + {num2}?
                    </label>
                    <Input
                        id="captcha"
                        type="number"
                        value={captchaAnswer}
                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                        placeholder="Your answer"
                        className="bg-background w-full md:w-32"
                        disabled={isSubmitting}
                        required
                    />
                </div>
            </div>

            <Button
                type="submit"
                className="w-full h-12 text-lg bg-[#D71616] hover:bg-[#b01212]"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
        </form>
    )
}
