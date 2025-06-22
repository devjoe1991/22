'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client' // Use client component
import { createAsset } from './actions'

interface FileUploadProps {
  characterId: string
}

export default function FileUpload({ characterId }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    const file = acceptedFiles[0]
    setIsUploading(true)
    const toastId = toast.loading(`Uploading ${file.name}...`)

    try {
      // 1. Get a signed URL from our server action
      const { signedUrl, path } = await createAsset(characterId, file.name, file.type)

      if (!signedUrl) {
        throw new Error('Could not get a signed URL.')
      }

      // 2. Upload the file directly to Supabase Storage using the signed URL
      const { error: uploadError } = await supabase.storage
        .from('assets') // Bucket name
        .uploadToSignedUrl(path, signedUrl.token, file, {
          upsert: true, // Overwrite file if it exists
        })

      if (uploadError) {
        throw uploadError
      }

      toast.success('File uploaded successfully!', { id: toastId })
      // Refresh the page to show the new asset
      router.refresh()
    } catch (error: any) {
      console.error('Upload failed:', error)
      toast.error(`Upload failed: ${error.message}`, { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/50 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
          <p>Drag & drop a file here, or click to select a file</p>
        </div>
      )}
    </div>
  )
} 