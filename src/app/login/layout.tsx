
import "../globals.css"

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
            {/* Toaster is likely already in RootLayout, but if needed specifically here, keep it. 
                However, usually one Toaster at root is enough. checking root layout... 
                RootLayout has Toaster. So removing it here to avoid duplicates. 
            */}
        </>
    )
}
