'use server'

export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get('file') as File
        if (!file) {
            return { success: false, error: 'No file uploaded' }
        }

        // Limit file size to 4.5MB for serverless payload compatibility
        if (file.size > 4.5 * 1024 * 1024) {
            return { success: false, error: 'File size exceeds 4.5MB limit. Please choose a smaller image or paste an external URL.' }
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const mimeType = file.type || 'image/jpeg'
        const base64 = buffer.toString('base64')
        const dataUrl = `data:${mimeType};base64,${base64}`

        return { success: true, url: dataUrl }
    } catch (error) {
        console.error('Upload Error:', error)
        return { success: false, error: 'Upload failed' }
    }
}

