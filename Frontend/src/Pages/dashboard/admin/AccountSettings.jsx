// // frontend/src/Pages/dashboard/admin/AccountSettings.jsx
// import { useState } from "react"
// import { 
//   Settings, 
//   Mail, 
//   Shield, 
//   Save,
//   Lock,
//   Eye,
//   EyeOff,
//   AlertTriangle
// } from "lucide-react"
// import Card from "../../../Components/ui/Card"
// import Button from "../../../Components/ui/Button"
// import Input from "../../../Components/ui/Input"
// import { useAuth } from "../../../hooks/useAuth"
// import toast from "react-hot-toast"

// // API Base URL
// const API_BASE_URL = 'http://localhost:8000/api/v1'

// const AccountSettings = () => {
//   const { user } = useAuth()
//   const [activeSection, setActiveSection] = useState('general')
//   const [loading, setLoading] = useState(false)
//   const [emailLoading, setEmailLoading] = useState(false)
//   const [passwordLoading, setPasswordLoading] = useState(false)
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false)
//   const [showNewPassword, setShowNewPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//   const [generalSettings, setGeneralSettings] = useState({
//     site_name: 'CallCenter Pro',
//     site_url: 'https://callcenterpro.com',
//     admin_email: user?.email || 'admin@callcenterpro.com',
//     support_email: 'support@callcenterpro.com',
//     company_address: '123 Business Ave, Suite 100, City, State 12345',
//     phone_number: '+1 (555) 123-4567'
//   })

//   const [securitySettings, setSecuritySettings] = useState({
//     current_email: user?.email || '',
//     new_email: '',
//     current_password: '',
//     new_password: '',
//     confirm_password: ''
//   })

//   const sections = [
//     { id: 'general', label: 'General Settings', icon: Settings },
//     { id: 'security', label: 'Security', icon: Shield }
//   ]

//   const getAuthHeaders = () => {
//     const tokenFromCookie = document.cookie
//       .split('; ')
//       .find(row => row.startsWith('access_token='))
//       ?.split('=')[1]
    
//     const tokenFromLocalStorage = localStorage.getItem('access_token')
//     const tokenFromSessionStorage = sessionStorage.getItem('access_token')
    
//     const token = tokenFromCookie || tokenFromLocalStorage || tokenFromSessionStorage
    
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   }

//   const handleGeneralSettingChange = (key, value) => {
//     setGeneralSettings(prev => ({
//       ...prev,
//       [key]: value
//     }))
//   }

//   const handleSecuritySettingChange = (key, value) => {
//     setSecuritySettings(prev => ({
//       ...prev,
//       [key]: value
//     }))
//   }

//   const handleSaveGeneral = async () => {
//     setLoading(true)
//     try {
//       // TODO: Implement API call to save general settings
//       await new Promise(resolve => setTimeout(resolve, 1000))
//       toast.success('General settings saved successfully!')
//     } catch (error) {
//       toast.error('Failed to save general settings')
//       console.error('Error saving general settings:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleChangeEmail = async () => {
//     if (!securitySettings.new_email) {
//       toast.error('Please enter a new email address')
//       return
//     }

//     if (!securitySettings.current_password) {
//       toast.error('Please enter your current password to change email')
//       return
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(securitySettings.new_email)) {
//       toast.error('Please enter a valid email address')
//       return
//     }

//     setEmailLoading(true)
//     try {
//       const headers = getAuthHeaders()
      
//       const response = await fetch(`${API_BASE_URL}/users/me/email`, {
//         method: 'PUT',
//         headers: headers,
//         body: JSON.stringify({
//           new_email: securitySettings.new_email,
//           current_password: securitySettings.current_password
//         })
//       })

//       if (response.ok) {
//         toast.success('Email updated successfully!')
//         setSecuritySettings(prev => ({
//           ...prev,
//           current_email: securitySettings.new_email,
//           new_email: '',
//           current_password: ''
//         }))
//       } else {
//         const errorData = await response.json()
//         toast.error(errorData.detail || 'Failed to change email')
//       }
//     } catch (error) {
//       console.error('Network error changing email:', error)
//       toast.error('Network error. Please try again.')
//     } finally {
//       setEmailLoading(false)
//     }
//   }

//   const handleChangePassword = async () => {
//     if (!securitySettings.current_password) {
//       toast.error('Please enter your current password')
//       return
//     }

//     if (!securitySettings.new_password) {
//       toast.error('Please enter a new password')
//       return
//     }

//     if (securitySettings.new_password !== securitySettings.confirm_password) {
//       toast.error('New passwords do not match')
//       return
//     }

//     if (securitySettings.new_password.length < 8) {
//       toast.error('Password must be at least 8 characters long')
//       return
//     }

//     setPasswordLoading(true)
//     try {
//       const headers = getAuthHeaders()
      
//       const response = await fetch(`${API_BASE_URL}/users/me/password`, {
//         method: 'PUT',
//         headers: headers,
//         body: JSON.stringify({
//           current_password: securitySettings.current_password,
//           new_password: securitySettings.new_password
//         })
//       })

//       if (response.ok) {
//         toast.success('Password changed successfully!')
//         setSecuritySettings(prev => ({
//           ...prev,
//           current_password: '',
//           new_password: '',
//           confirm_password: ''
//         }))
//       } else {
//         const errorData = await response.json()
//         toast.error(errorData.detail || 'Failed to change password')
//       }
//     } catch (error) {
//       console.error('Network error changing password:', error)
//       toast.error('Network error. Please try again.')
//     } finally {
//       setPasswordLoading(false)
//     }
//   }

//   if (!user || !user.is_admin) {
//     return (
//       <div className="text-center py-12">
//         <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
//         <p className="text-gray-600">You don't have permission to access account settings.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Sidebar */}
//         <div className="lg:col-span-1">
//           <Card className="p-4">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
//             <nav className="space-y-2">
//               {sections.map((section) => {
//                 const Icon = section.icon
//                 return (
//                   <button
//                     key={section.id}
//                     onClick={() => setActiveSection(section.id)}
//                     className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
//                       activeSection === section.id
//                         ? 'bg-blue-100 text-blue-700'
//                         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                     }`}
//                   >
//                     <Icon className="h-4 w-4 mr-3" />
//                     {section.label}
//                   </button>
//                 )
//               })}
//             </nav>
//           </Card>
//         </div>

//         {/* Main Content */}
//         <div className="lg:col-span-3">
//           {activeSection === 'general' && (
//             <Card className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
//                   <p className="text-sm text-gray-500">
//                     Manage your application's general configuration
//                   </p>
//                 </div>
//                 <button
//                   onClick={handleSaveGeneral}
//                   disabled={loading}
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                 >
//                   {loading ? (
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   ) : (
//                     <Save className="h-4 w-4 mr-2" />
//                   )}
//                   Save Changes
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <Input
//                     label="Site Name"
//                     value={generalSettings.site_name}
//                     onChange={(e) => handleGeneralSettingChange('site_name', e.target.value)}
//                     placeholder="Enter site name"
//                   />

//                   <Input
//                     label="Site URL"
//                     value={generalSettings.site_url}
//                     onChange={(e) => handleGeneralSettingChange('site_url', e.target.value)}
//                     placeholder="https://yoursite.com"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <Input
//                     label="Admin Email"
//                     type="email"
//                     value={generalSettings.admin_email}
//                     onChange={(e) => handleGeneralSettingChange('admin_email', e.target.value)}
//                     placeholder="admin@yoursite.com"
//                   />

//                   <Input
//                     label="Support Email"
//                     type="email"
//                     value={generalSettings.support_email}
//                     onChange={(e) => handleGeneralSettingChange('support_email', e.target.value)}
//                     placeholder="support@yoursite.com"
//                   />
//                 </div>

//                 <Input
//                   label="Company Address"
//                   value={generalSettings.company_address}
//                   onChange={(e) => handleGeneralSettingChange('company_address', e.target.value)}
//                   placeholder="Enter company address"
//                 />

//                 <Input
//                   label="Phone Number"
//                   value={generalSettings.phone_number}
//                   onChange={(e) => handleGeneralSettingChange('phone_number', e.target.value)}
//                   placeholder="+1 (555) 123-4567"
//                 />
//               </div>
//             </Card>
//           )}

//           {activeSection === 'security' && (
//             <div className="space-y-6">
//               {/* Change Email */}
//               <Card className="p-6">
//                 <div className="flex items-center mb-4">
//                   <Mail className="h-5 w-5 text-gray-400 mr-2" />
//                   <h3 className="text-lg font-medium text-gray-900">Change Email Address</h3>
//                 </div>
//                 <p className="text-sm text-gray-500 mb-6">
//                   Update your email address. You'll need to verify the new email.
//                 </p>

//                 <div className="space-y-4 max-w-md">
//                   <Input
//                     label="Current Email"
//                     type="email"
//                     value={securitySettings.current_email}
//                     disabled
//                     className="bg-gray-50"
//                   />

//                   <Input
//                     label="New Email Address"
//                     type="email"
//                     value={securitySettings.new_email}
//                     onChange={(e) => handleSecuritySettingChange('new_email', e.target.value)}
//                     placeholder="Enter new email address"
//                   />

//                   <div className="relative">
//                     <Input
//                       label="Current Password"
//                       type={showCurrentPassword ? 'text' : 'password'}
//                       value={securitySettings.current_password}
//                       onChange={(e) => handleSecuritySettingChange('current_password', e.target.value)}
//                       placeholder="Enter current password to confirm"
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
//                       onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                     >
//                       {showCurrentPassword ? (
//                         <EyeOff className="h-4 w-4 text-gray-400" />
//                       ) : (
//                         <Eye className="h-4 w-4 text-gray-400" />
//                       )}
//                     </button>
//                   </div>

//                   <button
//                     onClick={handleChangeEmail}
//                     disabled={emailLoading}
//                     className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {emailLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Updating Email...
//                       </>
//                     ) : (
//                       <>
//                         <Mail className="h-4 w-4 mr-2" />
//                         Change Email
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </Card>

//               {/* Change Password */}
//               <Card className="p-6">
//                 <div className="flex items-center mb-4">
//                   <Lock className="h-5 w-5 text-gray-400 mr-2" />
//                   <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
//                 </div>
//                 <p className="text-sm text-gray-500 mb-6">
//                   Update your password to keep your account secure. Password must be at least 8 characters long.
//                 </p>

//                 <div className="space-y-4 max-w-md">
//                   <div className="relative">
//                     <Input
//                       label="Current Password"
//                       type={showCurrentPassword ? 'text' : 'password'}
//                       value={securitySettings.current_password}
//                       onChange={(e) => handleSecuritySettingChange('current_password', e.target.value)}
//                       placeholder="Enter current password"
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
//                       onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                     >
//                       {showCurrentPassword ? (
//                         <EyeOff className="h-4 w-4 text-gray-400" />
//                       ) : (
//                         <Eye className="h-4 w-4 text-gray-400" />
//                       )}
//                     </button>
//                   </div>

//                   <div className="relative">
//                     <Input
//                       label="New Password"
//                       type={showNewPassword ? 'text' : 'password'}
//                       value={securitySettings.new_password}
//                       onChange={(e) => handleSecuritySettingChange('new_password', e.target.value)}
//                       placeholder="Enter new password (min. 8 characters)"
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
//                       onClick={() => setShowNewPassword(!showNewPassword)}
//                     >
//                       {showNewPassword ? (
//                         <EyeOff className="h-4 w-4 text-gray-400" />
//                       ) : (
//                         <Eye className="h-4 w-4 text-gray-400" />
//                       )}
//                     </button>
//                   </div>

//                   <div className="relative">
//                     <Input
//                       label="Confirm New Password"
//                       type={showConfirmPassword ? 'text' : 'password'}
//                       value={securitySettings.confirm_password}
//                       onChange={(e) => handleSecuritySettingChange('confirm_password', e.target.value)}
//                       placeholder="Confirm new password"
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff className="h-4 w-4 text-gray-400" />
//                       ) : (
//                         <Eye className="h-4 w-4 text-gray-400" />
//                       )}
//                     </button>
//                   </div>

//                   <button
//                     onClick={handleChangePassword}
//                     disabled={passwordLoading}
//                     className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {passwordLoading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Updating Password...
//                       </>
//                     ) : (
//                       <>
//                         <Lock className="h-4 w-4 mr-2" />
//                         Change Password
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </Card>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AccountSettings





// frontend/src/Pages/dashboard/admin/AccountSettings.jsx
import { useState } from "react"
import { 
  Settings, 
  Mail, 
  Shield, 
  Save,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react"
import Card from "../../../Components/ui/Card"
import Button from "../../../Components/ui/Button"
import Input from "../../../Components/ui/Input"
import { useAuth } from "../../../hooks/useAuth"
import toast from "react-hot-toast"

// API Base URL
const API_BASE_URL = 'http://localhost:8000/api/v1'

const AccountSettings = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('general')
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    site_name: 'CallCenter Pro',
    site_url: 'https://callcenterpro.com',
    admin_email: user?.email || 'admin@callcenterpro.com',
    support_email: 'support@callcenterpro.com',
    company_address: '123 Business Ave, Suite 100, City, State 12345',
    phone_number: '+1 (555) 123-4567'
  })

  const [securitySettings, setSecuritySettings] = useState({
    current_email: user?.email || '',
    new_email: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const sections = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  const getAuthHeaders = () => {
    const tokenFromCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1]
    
    const tokenFromLocalStorage = localStorage.getItem('access_token')
    const tokenFromSessionStorage = sessionStorage.getItem('access_token')
    
    const token = tokenFromCookie || tokenFromLocalStorage || tokenFromSessionStorage
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const handleGeneralSettingChange = (key, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSecuritySettingChange = (key, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveGeneral = async () => {
    setLoading(true)
    try {
      // TODO: Implement API call to save general settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('General settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save general settings')
      console.error('Error saving general settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeEmail = async () => {
    if (!securitySettings.new_email) {
      toast.error('Please enter a new email address')
      return
    }

    if (!securitySettings.current_password) {
      toast.error('Please enter your current password to change email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(securitySettings.new_email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setEmailLoading(true)
    try {
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_BASE_URL}/users/me/email`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          new_email: securitySettings.new_email,
          current_password: securitySettings.current_password
        })
      })

      if (response.ok) {
        toast.success('Email updated successfully!')
        setSecuritySettings(prev => ({
          ...prev,
          current_email: securitySettings.new_email,
          new_email: '',
          current_password: ''
        }))
      } else {
        const errorData = await response.json()
        toast.error(errorData.detail || 'Failed to change email')
      }
    } catch (error) {
      console.error('Network error changing email:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setEmailLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!securitySettings.current_password) {
      toast.error('Please enter your current password')
      return
    }

    if (!securitySettings.new_password) {
      toast.error('Please enter a new password')
      return
    }

    if (securitySettings.new_password !== securitySettings.confirm_password) {
      toast.error('New passwords do not match')
      return
    }

    if (securitySettings.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setPasswordLoading(true)
    try {
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          current_password: securitySettings.current_password,
          new_password: securitySettings.new_password
        })
      })

      if (response.ok) {
        toast.success('Password changed successfully!')
        setSecuritySettings(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_password: ''
        }))
      } else {
        const errorData = await response.json()
        toast.error(errorData.detail || 'Failed to change password')
      }
    } catch (error) {
      console.error('Network error changing password:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setPasswordLoading(false)
    }
  }

  if (!user || !user.is_admin) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-[#f2070d] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">Access Denied</h2>
        <p className="text-[#666666]">You don't have permission to access account settings.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6" style={{ backgroundColor: '#f8f8f8' }}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4 rounded-xl shadow-xl" style={{ backgroundColor: '#ffffff' }}>
            <h3 className="text-lg font-medium text-[#2C2C2C] mb-4">Settings</h3>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      activeSection === section.id
                        ? 'text-white shadow-lg'
                        : 'text-[#666666] hover:text-[#2C2C2C]'
                    }`}
                    style={activeSection === section.id ? {
                      background: 'linear-gradient(135deg, #f2070d 0%, #FF6B6B 100%)'
                    } : {
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {section.label}
                  </button>
                )
              })}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeSection === 'general' && (
            <Card className="p-6 rounded-xl shadow-xl" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#2C2C2C]">General Settings</h3>
                  <p className="text-sm text-[#666666]">
                    Manage your application's general configuration
                  </p>
                </div>
                <button
                  onClick={handleSaveGeneral}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border-0 text-sm font-medium rounded-lg shadow-xl text-white transition-all hover:shadow-2xl disabled:opacity-50"
                  style={{
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #f2070d 0%, #FF6B6B 100%)'
                  }}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Site Name"
                    value={generalSettings.site_name}
                    onChange={(e) => handleGeneralSettingChange('site_name', e.target.value)}
                    placeholder="Enter site name"
                  />

                  <Input
                    label="Site URL"
                    value={generalSettings.site_url}
                    onChange={(e) => handleGeneralSettingChange('site_url', e.target.value)}
                    placeholder="https://yoursite.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Admin Email"
                    type="email"
                    value={generalSettings.admin_email}
                    onChange={(e) => handleGeneralSettingChange('admin_email', e.target.value)}
                    placeholder="admin@yoursite.com"
                  />

                  <Input
                    label="Support Email"
                    type="email"
                    value={generalSettings.support_email}
                    onChange={(e) => handleGeneralSettingChange('support_email', e.target.value)}
                    placeholder="support@yoursite.com"
                  />
                </div>

                <Input
                  label="Company Address"
                  value={generalSettings.company_address}
                  onChange={(e) => handleGeneralSettingChange('company_address', e.target.value)}
                  placeholder="Enter company address"
                />

                <Input
                  label="Phone Number"
                  value={generalSettings.phone_number}
                  onChange={(e) => handleGeneralSettingChange('phone_number', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              {/* Change Email */}
              <Card className="p-6 rounded-xl shadow-xl" style={{ backgroundColor: '#ffffff' }}>
                <div className="flex items-center mb-4">
                  <Mail className="h-5 w-5 text-[#f2070d] mr-2" />
                  <h3 className="text-2xl font-bold text-[#2C2C2C]">Change Email Address</h3>
                </div>
                <p className="text-sm text-[#666666] mb-6">
                  Update your email address. You'll need to verify the new email.
                </p>

                <div className="space-y-4 max-w-md">
                  <Input
                    label="Current Email"
                    type="email"
                    value={securitySettings.current_email}
                    disabled
                    className="bg-gray-50"
                  />

                  <Input
                    label="New Email Address"
                    type="email"
                    value={securitySettings.new_email}
                    onChange={(e) => handleSecuritySettingChange('new_email', e.target.value)}
                    placeholder="Enter new email address"
                  />

                  <div className="relative">
                    <Input
                      label="Current Password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={securitySettings.current_password}
                      onChange={(e) => handleSecuritySettingChange('current_password', e.target.value)}
                      placeholder="Enter current password to confirm"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-[#666666]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#666666]" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleChangeEmail}
                    disabled={emailLoading}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border-0 text-sm font-medium rounded-lg shadow-xl text-white transition-all hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: emailLoading ? '#9ca3af' : 'linear-gradient(135deg, #f2070d 0%, #FF6B6B 100%)'
                    }}
                  >
                    {emailLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating Email...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Change Email
                      </>
                    )}
                  </button>
                </div>
              </Card>

              {/* Change Password */}
              <Card className="p-6 rounded-xl shadow-xl" style={{ backgroundColor: '#ffffff' }}>
                <div className="flex items-center mb-4">
                  <Lock className="h-5 w-5 text-[#f2070d] mr-2" />
                  <h3 className="text-2xl font-bold text-[#2C2C2C]">Change Password</h3>
                </div>
                <p className="text-sm text-[#666666] mb-6">
                  Update your password to keep your account secure. Password must be at least 8 characters long.
                </p>

                <div className="space-y-4 max-w-md">
                  <div className="relative">
                    <Input
                      label="Current Password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={securitySettings.current_password}
                      onChange={(e) => handleSecuritySettingChange('current_password', e.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-[#666666]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#666666]" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="New Password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={securitySettings.new_password}
                      onChange={(e) => handleSecuritySettingChange('new_password', e.target.value)}
                      placeholder="Enter new password (min. 8 characters)"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-[#666666]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#666666]" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Confirm New Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={securitySettings.confirm_password}
                      onChange={(e) => handleSecuritySettingChange('confirm_password', e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-[#666666]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#666666]" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border-0 text-sm font-medium rounded-lg shadow-xl text-white transition-all hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: passwordLoading ? '#9ca3af' : 'linear-gradient(135deg, #f2070d 0%, #FF6B6B 100%)'
                    }}
                  >
                    {passwordLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountSettings