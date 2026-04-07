import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadAPI, UPLOAD_URL } from '../lib/api';

const ImageUpload = ({ 
  value, 
  onChange, 
  type = 'general',
  label = 'Featured Image',
  className = '' 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const response = await uploadAPI.uploadImage(file, type);
      const imageUrl = UPLOAD_URL + response.data.url;
      onChange(imageUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  const handleUrlChange = (e) => {
    onChange(e.target.value);
    setError('');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Image Preview */}
      {value && (
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x450?text=Image+Not+Found';
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#4353FF] hover:bg-gray-50 transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#4353FF] animate-spin mb-2" />
              <span className="text-sm text-gray-500">Uploading...</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-700">Click to upload image</span>
              <span className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF, WebP (max 5MB)</span>
            </>
          )}
        </div>
      )}

      {/* URL Input */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Or enter image URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={value}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none"
          />
          {value && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title="Upload new image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
