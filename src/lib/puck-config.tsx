import React from 'react'
import type { Config } from '@measured/puck'

export type ComponentProps = {
    Hero: {
        title: string
        subtitle: string
        buttonText: string
        buttonUrl: string
        bgGradient: string
    }
    Heading: {
        title: string
        level: 'h1' | 'h2' | 'h3'
        align: 'left' | 'center' | 'right'
    }
    Text: {
        text: string
        align: 'left' | 'center' | 'right'
    }
    Button: {
        text: string
        url: string
        variant: 'primary' | 'secondary' | 'outline'
    }
    Image: {
        src: string
        alt: string
        caption?: string
    }
    Columns: {
        columns: Array<{ title: string; description: string }>
    }
    CustomHtml: {
        html: string
        css: string
    }
}

export const puckConfig: Config<ComponentProps> = {
    components: {
        Hero: {
            fields: {
                title: { type: 'text' },
                subtitle: { type: 'textarea' },
                buttonText: { type: 'text' },
                buttonUrl: { type: 'text' },
                bgGradient: {
                    type: 'select',
                    options: [
                        { label: 'Dark Purple', value: 'from-slate-900 via-purple-950 to-slate-900' },
                        { label: 'Blue Gradient', value: 'from-blue-900 via-indigo-950 to-slate-950' },
                        { label: 'Dark Emerald', value: 'from-slate-950 via-emerald-950 to-slate-900' },
                    ]
                }
            },
            defaultProps: {
                title: 'Welcome to Booked Place',
                subtitle: 'Discover unmissable stays, flights, and activities across the globe.',
                buttonText: 'Explore Now',
                buttonUrl: '/stays',
                bgGradient: 'from-slate-900 via-purple-950 to-slate-900',
            },
            render: ({ title, subtitle, buttonText, buttonUrl, bgGradient }: ComponentProps['Hero']) => (
                <div className={`w-full py-20 px-6 bg-gradient-to-br ${bgGradient} text-white text-center rounded-2xl my-4 shadow-xl border border-white/10`}>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 max-w-3xl mx-auto">{title}</h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8 font-light">{subtitle}</p>
                    {buttonText && (
                        <a
                            href={buttonUrl || '#'}
                            className="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-full shadow-lg hover:opacity-90 transition-opacity"
                        >
                            {buttonText}
                        </a>
                    )}
                </div>
            )
        },

        Heading: {
            fields: {
                title: { type: 'text' },
                level: {
                    type: 'select',
                    options: [
                        { label: 'H1 (Large)', value: 'h1' },
                        { label: 'H2 (Medium)', value: 'h2' },
                        { label: 'H3 (Small)', value: 'h3' },
                    ]
                },
                align: {
                    type: 'radio',
                    options: [
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                    ]
                }
            },
            defaultProps: {
                title: 'Section Heading',
                level: 'h2',
                align: 'left',
            },
            render: ({ title, level, align }: ComponentProps['Heading']) => {
                const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
                if (level === 'h1') return <h1 className={`text-4xl font-extrabold my-6 ${alignClass}`}>{title}</h1>
                if (level === 'h3') return <h3 className={`text-xl font-bold my-4 ${alignClass}`}>{title}</h3>
                return <h2 className={`text-3xl font-bold my-5 ${alignClass}`}>{title}</h2>
            }
        },

        Text: {
            fields: {
                text: { type: 'textarea' },
                align: {
                    type: 'radio',
                    options: [
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                    ]
                }
            },
            defaultProps: {
                text: 'Add your paragraph content here. Puck allows full inline text customization.',
                align: 'left',
            },
            render: ({ text, align }: ComponentProps['Text']) => (
                <p className={`text-base text-gray-700 dark:text-gray-300 leading-relaxed my-3 ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`}>
                    {text}
                </p>
            )
        },

        Button: {
            fields: {
                text: { type: 'text' },
                url: { type: 'text' },
                variant: {
                    type: 'select',
                    options: [
                        { label: 'Primary', value: 'primary' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Outline', value: 'outline' },
                    ]
                }
            },
            defaultProps: {
                text: 'Click Here',
                url: '#',
                variant: 'primary',
            },
            render: ({ text, url, variant }: ComponentProps['Button']) => {
                const btnStyle = variant === 'outline'
                    ? 'border-2 border-primary text-primary hover:bg-primary/10'
                    : variant === 'secondary'
                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'

                return (
                    <div className="my-4">
                        <a href={url} className={`inline-block px-6 py-3 font-semibold rounded-xl shadow-md transition-colors ${btnStyle}`}>
                            {text}
                        </a>
                    </div>
                )
            }
        },

        Image: {
            fields: {
                src: { type: 'text' },
                alt: { type: 'text' },
                caption: { type: 'text' },
            },
            defaultProps: {
                src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80',
                alt: 'Travel Image',
                caption: 'Beautiful travel destination',
            },
            render: ({ src, alt, caption }: ComponentProps['Image']) => (
                <div className="my-6">
                    <img src={src} alt={alt} className="w-full max-h-[450px] object-cover rounded-2xl shadow-md" />
                    {caption && <p className="text-xs text-center text-gray-500 mt-2 font-medium">{caption}</p>}
                </div>
            )
        },

        Columns: {
            fields: {
                columns: {
                    type: 'array',
                    getItemTitle: (item, idx) => item.title || `Column ${idx + 1}`,
                    arrayFields: {
                        title: { type: 'text' },
                        description: { type: 'textarea' },
                    }
                }
            },
            defaultProps: {
                columns: [
                    { title: 'Best Stays', description: 'Curated luxury & cozy stays worldwide.' },
                    { title: 'Easy Flight Search', description: 'Compare prices and book your next flight seamlessly.' },
                    { title: 'Top Activities', description: 'Discover unmissable local experiences and tours.' },
                ]
            },
            render: ({ columns }: ComponentProps['Columns']) => (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    {columns?.map((col: { title: string; description: string }, idx: number) => (
                        <div key={idx} className="p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">{col.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{col.description}</p>
                        </div>
                    ))}
                </div>
            )
        },

        CustomHtml: {
            fields: {
                html: { type: 'textarea' },
                css: { type: 'textarea' },
            },
            defaultProps: {
                html: '<div className="p-4 bg-purple-50 text-purple-900 rounded-lg">Custom HTML Block</div>',
                css: '',
            },
            render: ({ html, css }: ComponentProps['CustomHtml']) => (
                <div className="my-4">
                    {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
                    {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
                </div>
            )
        }
    }
}
