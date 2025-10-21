// // Profile.jsx
// import { useState, useRef, useEffect } from "react"
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   Camera, 
//   Save,
//   Upload
// } from "lucide-react"
// import Card from "../../Components/ui/Card"
// import Button from "../../Components/ui/Button"
// import Input from "../../Components/ui/Input"
// import { useAuth } from "../../hooks/useAuth"
// import { toast } from "react-hot-toast"

// const Profile = () => {
//   const { user, updateProfile } = useAuth()
//   const fileInputRef = useRef(null)
//   const [loading, setLoading] = useState(false)
//   const [imageLoading, setImageLoading] = useState(false)
//   const [profileImage, setProfileImage] = useState(null)
//   const [profileData, setProfileData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: ''
//   })

//   // ✅ Sync user data
//   useEffect(() => {
//     if (user) {
//       const firstName = user.first_name || 
//                        (user.full_name && user.full_name.split(' ')[0]) || 
//                        (user.name && user.name.split(' ')[0]) || ''
      
//       const lastName = user.last_name || 
//                       (user.full_name && user.full_name.split(' ').slice(1).join(' ')) || 
//                       (user.name && user.name.split(' ').slice(1).join(' ')) || ''

//       setProfileData({
//         first_name: firstName,
//         last_name: lastName,
//         email: user.email || '',
//         phone: user.phone || ''
//       })
//     }
//   }, [user])

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setProfileData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return

//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select a valid image file')
//       return
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('Image size must be less than 5MB')
//       return
//     }

//     setImageLoading(true)
//     try {
//       const previewUrl = URL.createObjectURL(file)
//       setProfileImage(previewUrl)
//       toast.success('Profile image updated successfully!')
//     } catch (error) {
//       toast.error('Failed to upload image')
//       console.error('Error uploading image:', error)
//     } finally {
//       setImageLoading(false)
//     }
//   }

//   const handleSaveProfile = async () => {
//     setLoading(true)
//     try {
//       if (!profileData.first_name.trim()) {
//         toast.error('First name is required')
//         setLoading(false)
//         return
//       }
//       if (!profileData.last_name.trim()) {
//         toast.error('Last name is required')
//         setLoading(false)
//         return
//       }
//       if (!profileData.email.trim()) {
//         toast.error('Email is required')
//         setLoading(false)
//         return
//       }

//       const updateData = {
//         first_name: profileData.first_name.trim(),
//         last_name: profileData.last_name.trim(),
//         email: profileData.email.trim(),
//         phone: profileData.phone.trim() || null,
//         full_name: `${profileData.first_name.trim()} ${profileData.last_name.trim()}`
//       }

//       const updatedUser = await updateProfile(updateData)
//       console.log('✅ Profile updated successfully:', updatedUser)
//       toast.success('Profile updated successfully!')

//     } catch (error) {
//       console.error('❌ Profile update error:', error)
//       toast.error(error.message || 'Failed to update profile. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getInitials = () => {
//     if (profileData.first_name || profileData.last_name) {
//       return `${profileData.first_name.charAt(0)}${profileData.last_name.charAt(0)}`.toUpperCase()
//     }
//     const name = user?.full_name || user?.email || 'User'
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
//   }

//   if (!user) {
//     return (
//       <div className="max-w-4xl mx-auto space-y-6">
//         <div className="flex items-center justify-center p-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
//           <span className="ml-3 text-gray-600">Loading profile...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Manage your account information and preferences
//         </p>
//       </div>

//       {/* Profile Image Section */}
//       <Card className="p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
//         <div className="flex items-center space-x-6">
//           <div className="relative">
//             <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-500 flex items-center justify-center">
//               {profileImage ? (
//                 <img 
//                   src={profileImage} 
//                   alt="Profile" 
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <span className="text-2xl font-bold text-white">
//                     {getInitials()}
//                   </span>
//                 </div>
//               )}
//             </div>
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               disabled={imageLoading}
//               className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors disabled:opacity-50"
//             >
//               {imageLoading ? (
//                 <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
//               ) : (
//                 <Camera className="h-4 w-4" />
//               )}
//             </button>
//           </div>
          
//           <div>
//             <h4 className="text-sm font-medium text-gray-900">Change Profile Picture</h4>
//             <p className="text-sm text-gray-500 mb-3">
//               Upload a new profile picture. JPG, PNG or GIF. Max size 5MB.
//             </p>
//             <Button
//               variant="outline"
//               size="small"
//               onClick={() => fileInputRef.current?.click()}
//               disabled={imageLoading}
//               className="border-primary-600 text-primary-600 hover:bg-secondary-50"
//               leftIcon={<Upload className="h-4 w-4" />}
//             >
//               Upload New Image
//             </Button>
//           </div>
          
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="hidden"
//           />
//         </div>
//       </Card>

//       {/* Personal Information */}
//       <Card className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
//             <p className="text-sm text-gray-500">
//               Update your personal details and contact information
//             </p>
//           </div>
          
//           {/* ✅ Save Changes Button */}
//           <button
//             onClick={handleSaveProfile}
//             disabled={loading}
//             className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold text-sm text-white shadow-sm relative z-10 min-w-[140px] justify-center transition
//               ${loading 
//                 ? 'bg-gray-400 cursor-not-allowed' 
//                 : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0'}
//             `}
//           >
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-t-white border-transparent rounded-full animate-spin mr-2" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save className="w-4 h-4 mr-2" />
//                 Save Changes
//               </>
//             )}
//           </button>
//         </div>

//         <div className="space-y-6">
//           {/* Name Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Input
//               label="First Name"
//               name="first_name"
//               value={profileData.first_name}
//               onChange={handleInputChange}
//               leftIcon={<User className="h-5 w-5" />}
//               placeholder="Enter your first name"
//               required
//             />
//             <Input
//               label="Last Name"
//               name="last_name"
//               value={profileData.last_name}
//               onChange={handleInputChange}
//               leftIcon={<User className="h-5 w-5" />}
//               placeholder="Enter your last name"
//               required
//             />
//           </div>

//           {/* Contact Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Input
//               label="Email Address"
//               name="email"
//               type="email"
//               value={profileData.email}
//               onChange={handleInputChange}
//               leftIcon={<Mail className="h-5 w-5" />}
//               placeholder="Enter your email"
//               required
//             />
//             <Input
//               label="Phone Number"
//               name="phone"
//               type="tel"
//               value={profileData.phone}
//               onChange={handleInputChange}
//               leftIcon={<Phone className="h-5 w-5" />}
//               placeholder="Enter your phone number"
//             />
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }

// export default Profile



// Profile.jsx
import { useState, useRef, useEffect } from "react"
import { 
  User, 
  Mail, 
  Phone, 
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
  const { user, updateProfile } = useAuth()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  })

  // ✅ Sync user data
  useEffect(() => {
    if (user) {
      const firstName = user.first_name || 
                       (user.full_name && user.full_name.split(' ')[0]) || 
                       (user.name && user.name.split(' ')[0]) || ''
      
      const lastName = user.last_name || 
                      (user.full_name && user.full_name.split(' ').slice(1).join(' ')) || 
                      (user.name && user.name.split(' ').slice(1).join(' ')) || ''

      setProfileData({
        first_name: firstName,
        last_name: lastName,
        email: user.email || '',
        phone: user.phone || ''
      })
    }
  }, [user])

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
      console.error('Error uploading image:', error)
    } finally {
      setImageLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      if (!profileData.first_name.trim()) {
        toast.error('First name is required')
        setLoading(false)
        return
      }
      if (!profileData.last_name.trim()) {
        toast.error('Last name is required')
        setLoading(false)
        return
      }
      if (!profileData.email.trim()) {
        toast.error('Email is required')
        setLoading(false)
        return
      }

      const updateData = {
        first_name: profileData.first_name.trim(),
        last_name: profileData.last_name.trim(),
        email: profileData.email.trim(),
        phone: profileData.phone.trim() || null,
        full_name: `${profileData.first_name.trim()} ${profileData.last_name.trim()}`
      }

      const updatedUser = await updateProfile(updateData)
      console.log('✅ Profile updated successfully:', updatedUser)
      toast.success('Profile updated successfully!')

    } catch (error) {
      console.error('❌ Profile update error:', error)
      toast.error(error.message || 'Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = () => {
    if (profileData.first_name || profileData.last_name) {
      return `${profileData.first_name.charAt(0)}${profileData.last_name.charAt(0)}`.toUpperCase()
    }
    const name = user?.full_name || user?.email || 'User'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto space-y-6" style={{ backgroundColor: '#f8f8f8' }}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f2070d]"></div>
          <span className="ml-3 text-[#666666]">Loading profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6" style={{ backgroundColor: '#f8f8f8', padding: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#2C2C2C]">Profile Settings</h1>
        <p className="mt-1 text-lg text-[#666666]">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Image Section */}
      <Card className="p-6 rounded-xl shadow-xl" style={{ backgroundColor: '#ffffff' }}>
        <h3 className="text-2xl font-bold text-[#2C2C2C] mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f2070d 0%, #FF6B6B 100%)' }}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {getInitials()}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={imageLoading}
              className="absolute bottom-0 right-0 text-white rounded-full p-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #f2070d 0%, #FF6B6B 100%)' }}
            >
              {imageLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-[#2C2C2C]">Change Profile Picture</h4>
            <p className="text-sm text-[#666666] mb-3">
              Upload a new profile picture. JPG, PNG or GIF. Max size 5MB.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={imageLoading}
              className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg transition-all"
              style={{ 
                borderColor: '#f2070d',
                color: '#f2070d',
                backgroundColor: 'transparent'
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New Image
            </button>
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
      <Card className="p-6 rounded-xl shadow-xl" style={{ backgroundColor: '#ffffff' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#2C2C2C]">Personal Information</h3>
            <p className="text-sm text-[#666666]">
              Update your personal details and contact information
            </p>
          </div>
          
          {/* ✅ Save Changes Button */}
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-sm text-white shadow-xl relative z-10 min-w-[140px] justify-center transition-all hover:shadow-2xl disabled:cursor-not-allowed"
            style={{
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #f2070d 0%, #FF6B6B 100%)'
            }}
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
              leftIcon={<User className="h-5 w-5 text-[#f2070d]" />}
              placeholder="Enter your first name"
              required
            />
            <Input
              label="Last Name"
              name="last_name"
              value={profileData.last_name}
              onChange={handleInputChange}
              leftIcon={<User className="h-5 w-5 text-[#f2070d]" />}
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
              leftIcon={<Mail className="h-5 w-5 text-[#f2070d]" />}
              placeholder="Enter your email"
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={profileData.phone}
              onChange={handleInputChange}
              leftIcon={<Phone className="h-5 w-5 text-[#f2070d]" />}
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Profile