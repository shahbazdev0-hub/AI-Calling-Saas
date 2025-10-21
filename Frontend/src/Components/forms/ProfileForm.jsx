

// Updated Profile.jsx - Unified Primary Color Styling
import { useState, useRef } from "react"
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Camera, 
  Save,
  Upload
} from "lucide-react"
import Card from "../../Components/ui/Card"
import Button from "../../Components/ui/Button"
import Input from "../../Components/ui/Input"
import { useAuth } from "../../hooks/useAuth"
import { toast } from "react-hot-toast"

const Profile = () => {
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [profileData, setProfileData] = useState({
    first_name: user?.full_name?.split(' ')[0] || '',
    last_name: user?.full_name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company_name: user?.company || '',
    bio: user?.bio || '',
    address: user?.address || '',
    website: user?.website || ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setImageLoading(true)
    try {
      const previewUrl = URL.createObjectURL(file)
      setProfileImage(previewUrl)
      toast.success('Profile image updated successfully!')
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setImageLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const updatedData = {
        ...profileData,
        full_name: `${profileData.first_name} ${profileData.last_name}`.trim()
      }
      console.log('Saving profile data:', updatedData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = () => {
    const name = user?.full_name || user?.email || 'User'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Image Section */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-700">
                    {getInitials()}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={imageLoading}
              className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {imageLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900">Change Profile Picture</h4>
            <p className="text-sm text-gray-500 mb-3">
              Upload a new profile picture. JPG, PNG or GIF. Max size 5MB.
            </p>
            <Button
              variant="outline"
              size="small"
              onClick={() => fileInputRef.current?.click()}
              disabled={imageLoading}
              className="border-primary-600 text-primary-600 hover:bg-primary-50"
              leftIcon={<Upload className="h-4 w-4" />}
            >
              Upload New Image
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <p className="text-sm text-gray-500">
              Update your personal details and contact information
            </p>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold text-sm text-white shadow-lg relative z-10 min-w-[160px] justify-center transition-all duration-300
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 hover:shadow-xl'}
            `}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-t-white border-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="first_name"
              value={profileData.first_name}
              onChange={handleInputChange}
              leftIcon={<User className="h-5 w-5" />}
              placeholder="Enter your first name"
              required
            />
            <Input
              label="Last Name"
              name="last_name"
              value={profileData.last_name}
              onChange={handleInputChange}
              leftIcon={<User className="h-5 w-5" />}
              placeholder="Enter your last name"
              required
            />
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleInputChange}
              leftIcon={<Mail className="h-5 w-5" />}
              placeholder="Enter your email"
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={profileData.phone}
              onChange={handleInputChange}
              leftIcon={<Phone className="h-5 w-5" />}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Company and Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name"
              name="company_name"
              value={profileData.company_name}
              onChange={handleInputChange}
              leftIcon={<Building className="h-5 w-5" />}
              placeholder="Enter your company name"
            />
            <Input
              label="Website"
              name="website"
              type="url"
              value={profileData.website}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Address */}
          <Input
            label="Address"
            name="address"
            value={profileData.address}
            onChange={handleInputChange}
            leftIcon={<MapPin className="h-5 w-5" />}
            placeholder="Enter your address"
          />

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Tell us a little about yourself..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Brief description about yourself. This will be visible to other users.
            </p>
          </div>
        </div>
      </Card>

      {/* Account Information */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <div className="text-sm text-gray-900">
              {user?.is_admin ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Administrator
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  User
                </span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Status
            </label>
            <div className="text-sm text-gray-900">
              {user?.is_active ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Inactive
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member Since
            </label>
            <div className="text-sm text-gray-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Login
            </label>
            <div className="text-sm text-gray-900">
              {user?.last_login ? new Date(user.last_login).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Never'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Profile

