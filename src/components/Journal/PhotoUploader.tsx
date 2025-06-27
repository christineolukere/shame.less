import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Check, AlertCircle, Image } from 'lucide-react'
import { validateFile } from '../../lib/journalStorage'

interface PhotoUploaderProps {
  onPhotoSelected: (photoFile: File) => void
  onCancel: () => void
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onPhotoSelected, onCancel }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    setError(null)
    
    // Validate file
    const validation = validateFile(file, 'photo')
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setSelectedPhoto(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
    
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const clearSelection = () => {
    setSelectedPhoto(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setError(null)
    
    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const confirmSelection = () => {
    if (selectedPhoto) {
      onPhotoSelected(selectedPhoto)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl p-6 border border-sage-100 space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-serif text-sage-800 mb-2">Add Photo</h3>
        <p className="text-sm text-sage-600">Share a moment, mood, or memory</p>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Selection Interface */}
      {!selectedPhoto ? (
        <div className="space-y-4">
          {/* Drag and Drop Area */}
          <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging 
                ? 'border-terracotta-400 bg-terracotta-50' 
                : 'border-sage-200 hover:border-sage-300'
            }`}
          >
            <Image className="w-12 h-12 text-sage-400 mx-auto mb-4" />
            <p className="text-sage-600 mb-2">Drag and drop a photo here</p>
            <p className="text-sm text-sage-500">or choose from the options below</p>
          </motion.div>

          {/* Upload Options */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={() => cameraInputRef.current?.click()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-terracotta-50 border border-terracotta-200 rounded-xl hover:bg-terracotta-100 transition-colors flex flex-col items-center space-y-2"
            >
              <Camera className="w-6 h-6 text-terracotta-600" />
              <span className="text-sm font-medium text-terracotta-800">Take Photo</span>
            </motion.button>

            <motion.button
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-sage-50 border border-sage-200 rounded-xl hover:bg-sage-100 transition-colors flex flex-col items-center space-y-2"
            >
              <Upload className="w-6 h-6 text-sage-600" />
              <span className="text-sm font-medium text-sage-800">Choose File</span>
            </motion.button>
          </div>

          {/* File Size Info */}
          <div className="text-center text-xs text-sage-500">
            Maximum file size: 2MB • Supported formats: JPG, PNG, WebP
          </div>
        </div>
      ) : (
        /* Photo Preview */
        <div className="space-y-4">
          <div className="relative">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={previewUrl || ''}
              alt="Selected photo"
              className="w-full h-64 object-cover rounded-xl"
            />
            
            <motion.button
              onClick={clearSelection}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="text-center text-sm text-sage-600">
            {selectedPhoto.name} • {(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {selectedPhoto ? (
          <>
            <motion.button
              onClick={confirmSelection}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-terracotta-500 text-white rounded-lg font-medium hover:bg-terracotta-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Use This Photo</span>
            </motion.button>
            
            <motion.button
              onClick={clearSelection}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors"
            >
              Choose Different
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-sage-100 text-sage-700 rounded-lg font-medium hover:bg-sage-200 transition-colors"
          >
            Cancel
          </motion.button>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </motion.div>
  )
}

export default PhotoUploader