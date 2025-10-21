// // src/Pages/dashboard/Settings.jsx
// import { useState } from "react"
// import { 
//   Bell, 
//   Lock, 
//   Save,
//   Eye,
//   EyeOff,
//   Trash2
// } from "lucide-react"
// import Card from "../../Components/ui/Card"
// import Button from "../../Components/ui/Button"
// import Input from "../../Components/ui/Input"
// import { useAuth } from "../../hooks/useAuth"
// import toast from "react-hot-toast"

// // API Base URL
// const API_BASE_URL = 'http://localhost:8000/api/v1'

// const Settings = () => {
//   const { user } = useAuth()
//   const [activeTab, setActiveTab] = useState('notifications')
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false)
//   const [showNewPassword, setShowNewPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [passwordLoading, setPasswordLoading] = useState(false)
//   const [notificationLoading, setNotificationLoading] = useState(false)

//   const [passwordForm, setPasswordForm] = useState({
//     current_password: '',
//     new_password: '',
//     confirm_password: ''
//   })

//   const [notifications, setNotifications] = useState({
//     email_campaigns: true,
//     sms_alerts: false,
//     call_summaries: true,
//     weekly_reports: true,
//     security_alerts: true
//   })

//   const tabs = [
//     { id: 'notifications', label: 'Notifications', icon: Bell },
//     { id: 'security', label: 'Security', icon: Lock }
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

//   const handlePasswordChange = (e) => {
//     setPasswordForm(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }))
//   }

//   const handleNotificationChange = (key) => {
//     setNotifications(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }))
//   }

//   const handleSaveNotifications = async () => {
//     setNotificationLoading(true)
//     try {
//       const headers = getAuthHeaders()
      
//       const response = await fetch(`${API_BASE_URL}/users/me/notifications`, {
//         method: 'PUT',
//         headers: headers,
//         body: JSON.stringify(notifications)
//       })

//       if (response.ok) {
//         toast.success('Notification preferences saved successfully!')
//       } else {
//         const errorData = await response.json()
//         toast.error(errorData.detail || 'Failed to save notification preferences')
//       }
//     } catch (error) {
//       console.error('Error saving notifications:', error)
//       toast.error('Network error. Please try again.')
//     } finally {
//       setNotificationLoading(false)
//     }
//   }

//   const handleUpdatePassword = async (e) => {
//     e.preventDefault()

//     // Validation
//     if (!passwordForm.current_password) {
//       toast.error('Please enter your current password')
//       return
//     }

//     if (!passwordForm.new_password) {
//       toast.error('Please enter a new password')
//       return
//     }

//     if (passwordForm.new_password !== passwordForm.confirm_password) {
//       toast.error('New passwords do not match')
//       return
//     }

//     if (passwordForm.new_password.length < 8) {
//       toast.error('Password must be at least 8 characters long')
//       return
//     }

//     // Optional: Check for password strength
//     const hasUpperCase = /[A-Z]/.test(passwordForm.new_password)
//     const hasLowerCase = /[a-z]/.test(passwordForm.new_password)
//     const hasNumber = /[0-9]/.test(passwordForm.new_password)
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.new_password)

//     if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
//       toast.error('Password must contain uppercase, lowercase, number, and special character')
//       return
//     }

//     setPasswordLoading(true)
//     try {
//       const headers = getAuthHeaders()
      
//       console.log('Sending password change request...')
//       const response = await fetch(`${API_BASE_URL}/users/me/password`, {
//         method: 'PUT',
//         headers: headers,
//         body: JSON.stringify({
//           current_password: passwordForm.current_password,
//           new_password: passwordForm.new_password
//         })
//       })

//       console.log('Password change response status:', response.status)

//       if (response.ok) {
//         toast.success('Password changed successfully!')
//         setPasswordForm({
//           current_password: '',
//           new_password: '',
//           confirm_password: ''
//         })
//       } else {
//         const errorData = await response.json()
//         console.error('Password change error:', errorData)
//         toast.error(errorData.detail || 'Failed to change password')
//       }
//     } catch (error) {
//       console.error('Network error changing password:', error)
//       toast.error('Network error. Please try again.')
//     } finally {
//       setPasswordLoading(false)
//     }
//   }

//   const renderNotifications = () => (
//     <Card>
//       <Card.Header>
//         <Card.Title>Notification Preferences</Card.Title>
//         <Card.Description>
//           Choose what notifications you'd like to receive
//         </Card.Description>
//       </Card.Header>
//       <Card.Content>
//         <div className="space-y-6">
//           {Object.entries(notifications).map(([key, value]) => (
//             <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
//               <div>
//                 <p className="font-medium text-gray-900 capitalize">
//                   {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Get notified about {key.replace(/_/g, ' ')}
//                 </p>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={value}
//                   onChange={() => handleNotificationChange(key)}
//                   className="sr-only peer"
//                 />
//                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//               </label>
//             </div>
//           ))}
          
//           <div className="pt-4">
//             <Button 
//               onClick={handleSaveNotifications}
//               disabled={notificationLoading}
//               className="w-full sm:w-auto"
//             >
//               {notificationLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save className="h-4 w-4 mr-2" />
//                   Save Preferences
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </Card.Content>
//     </Card>
//   )

//   const renderSecurity = () => (
//     <div className="space-y-6">
//       {/* Change Password */}
//       <Card>
//         <Card.Header>
//           <Card.Title>Change Password</Card.Title>
//           <Card.Description>
//             Update your password to keep your account secure. Password must contain uppercase, lowercase, number, and special character.
//           </Card.Description>
//         </Card.Header>
//         <Card.Content>
//           <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
//             <div className="relative">
//               <Input
//                 label="Current Password"
//                 name="current_password"
//                 type={showCurrentPassword ? 'text' : 'password'}
//                 value={passwordForm.current_password}
//                 onChange={handlePasswordChange}
//                 placeholder="Enter your current password"
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
//                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//               >
//                 {showCurrentPassword ? (
//                   <EyeOff className="h-4 w-4 text-gray-400" />
//                 ) : (
//                   <Eye className="h-4 w-4 text-gray-400" />
//                 )}
//               </button>
//             </div>
            
//             <div className="relative">
//               <Input
//                 label="New Password"
//                 name="new_password"
//                 type={showNewPassword ? 'text' : 'password'}
//                 value={passwordForm.new_password}
//                 onChange={handlePasswordChange}
//                 placeholder="Enter new password"
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//               >
//                 {showNewPassword ? (
//                   <EyeOff className="h-4 w-4 text-gray-400" />
//                 ) : (
//                   <Eye className="h-4 w-4 text-gray-400" />
//                 )}
//               </button>
//               <p className="mt-1 text-xs text-gray-500">
//                 Must be at least 8 characters with uppercase, lowercase, number, and special character
//               </p>
//             </div>
            
//             <div className="relative">
//               <Input
//                 label="Confirm New Password"
//                 name="confirm_password"
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 value={passwordForm.confirm_password}
//                 onChange={handlePasswordChange}
//                 placeholder="Confirm your new password"
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff className="h-4 w-4 text-gray-400" />
//                 ) : (
//                   <Eye className="h-4 w-4 text-gray-400" />
//                 )}
//               </button>
//             </div>
            
//             <Button 
//               type="submit" 
//               variant="primary"
//               disabled={passwordLoading}
//               className="w-full"
//             >
//               {passwordLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   Updating Password...
//                 </>
//               ) : (
//                 <>
//                   <Lock className="h-4 w-4 mr-2" />
//                   Update Password
//                 </>
//               )}
//             </Button>
//           </form>
//         </Card.Content>
//       </Card>
//     </div>
//   )

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'notifications':
//         return renderNotifications()
//       case 'security':
//         return renderSecurity()
//       default:
//         return renderNotifications()
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
//         <p className="text-gray-600">Manage your account settings and preferences</p>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Settings Navigation */}
//         <div className="lg:w-64">
//           <Card className="p-2">
//             <nav className="space-y-1">
//               {tabs.map((tab) => {
//                 const Icon = tab.icon
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
//                       activeTab === tab.id
//                         ? 'bg-blue-50 text-blue-700'
//                         : 'text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     <Icon className="h-5 w-5 mr-3" />
//                     {tab.label}
//                   </button>
//                 )
//               })}
//             </nav>
//           </Card>
//         </div>

//         {/* Settings Content */}
//         <div className="flex-1">
//           {renderContent()}
//         </div>
//       </div>

//       {/* Danger Zone */}
//       <Card className="border-red-200 bg-red-50">
//         <Card.Header>
//           <Card.Title className="text-red-600">Danger Zone</Card.Title>
//           <Card.Description>
//             Irreversible and destructive actions
//           </Card.Description>
//         </Card.Header>
//         <Card.Content>
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="font-medium text-gray-900">Delete Account</p>
//               <p className="text-sm text-gray-500">
//                 Permanently delete your account and all associated data
//               </p>
//             </div>
//             <Button variant="danger">
//               <Trash2 className="h-4 w-4 mr-2" />
//               Delete Account
//             </Button>
//           </div>
//         </Card.Content>
//       </Card>
//     </div>
//   )
// }

// export default Settings




// src/Pages/dashboard/Settings.jsx
import { useState } from "react"
import { 
  Bell, 
  Lock, 
  Save,
  Eye,
  EyeOff,
  Trash2
} from "lucide-react"
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button"
import Input from "../../Components/ui/Input"
import { useAuth } from "../../hooks/useAuth"
import toast from "react-hot-toast"

// API Base URL
const API_BASE_URL = 'http://localhost:8000/api/v1'

const Settings = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('notifications')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [notificationLoading, setNotificationLoading] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const [notifications, setNotifications] = useState({
    email_campaigns: true,
    sms_alerts: false,
    call_summaries: true,
    weekly_reports: true,
    security_alerts: true
  })

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock }
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

  const handlePasswordChange = (e) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSaveNotifications = async () => {
    setNotificationLoading(true)
    try {
      const headers = getAuthHeaders()
      
      const response = await fetch(`${API_BASE_URL}/users/me/notifications`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(notifications)
      })

      if (response.ok) {
        toast.success('Notification preferences saved successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.detail || 'Failed to save notification preferences')
      }
    } catch (error) {
      console.error('Error saving notifications:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setNotificationLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()

    // Validation
    if (!passwordForm.current_password) {
      toast.error('Please enter your current password')
      return
    }

    if (!passwordForm.new_password) {
      toast.error('Please enter a new password')
      return
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    // Optional: Check for password strength
    const hasUpperCase = /[A-Z]/.test(passwordForm.new_password)
    const hasLowerCase = /[a-z]/.test(passwordForm.new_password)
    const hasNumber = /[0-9]/.test(passwordForm.new_password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.new_password)

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      toast.error('Password must contain uppercase, lowercase, number, and special character')
      return
    }

    setPasswordLoading(true)
    try {
      const headers = getAuthHeaders()
      
      console.log('Sending password change request...')
      const response = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password
        })
      })

      console.log('Password change response status:', response.status)

      if (response.ok) {
        toast.success('Password changed successfully!')
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: ''
        })
      } else {
        const errorData = await response.json()
        console.error('Password change error:', errorData)
        toast.error(errorData.detail || 'Failed to change password')
      }
    } catch (error) {
      console.error('Network error changing password:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const renderNotifications = () => (
    <Card className="rounded-xl shadow-xl" style={{ backgroundColor: '#ffffff' }}>
      <Card.Header>
        <Card.Title className="text-2xl font-bold text-[#2C2C2C]">Notification Preferences</Card.Title>
        <Card.Description className="text-[#666666]">
          Choose what notifications you'd like to receive
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-6">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: '#e5e5e5' }}>
              <div>
                <p className="font-medium text-[#2C2C2C] capitalize">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <p className="text-sm text-[#666666] mt-1">
                  Get notified about {key.replace(/_/g, ' ')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationChange(key)}
                  className="sr-only peer"
                />
                <div 
                  className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{
                    backgroundColor: value ? '#f2070d' : '#e5e5e5'
                  }}
                ></div>
              </label>
            </div>
          ))}
          
          <div className="pt-4">
            <button
              onClick={handleSaveNotifications}
              disabled={notificationLoading}
              className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-sm text-white shadow-xl transition-all hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: notificationLoading ? '#9ca3af' : 'linear-gradient(135deg, #f2070d 0%, #FF6B6B 100%)'
              }}
            >
              {notificationLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      </Card.Content>
    </Card>
  )

  const renderSecurity = () => (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="rounded-xl shadow-xl" style={{ backgroundColor: '#ffffff' }}>
        <Card.Header>
          <Card.Title className="text-2xl font-bold text-[#2C2C2C]">Change Password</Card.Title>
          <Card.Description className="text-[#666666]">
            Update your password to keep your account secure. Password must contain uppercase, lowercase, number, and special character.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div className="relative">
              <Input
                label="Current Password"
                name="current_password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.current_password}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                required
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
                name="new_password"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
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
              <p className="mt-1 text-xs text-[#666666]">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>
            
            <div className="relative">
              <Input
                label="Confirm New Password"
                name="confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.confirm_password}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                required
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
              type="submit"
              disabled={passwordLoading}
              className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm text-white shadow-xl transition-all hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Update Password
                </>
              )}
            </button>
          </form>
        </Card.Content>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications':
        return renderNotifications()
      case 'security':
        return renderSecurity()
      default:
        return renderNotifications()
    }
  }

  return (
    <div className="space-y-6" style={{ backgroundColor: '#f8f8f8', padding: '1.5rem' }}>
      <div>
        <h1 className="text-4xl font-bold text-[#2C2C2C]">Account Settings</h1>
        <p className="text-lg text-[#666666]">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <Card className="p-2 rounded-xl shadow-xl" style={{ backgroundColor: '#ffffff' }}>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      activeTab === tab.id
                        ? 'text-white shadow-lg'
                        : 'text-[#666666] hover:text-[#2C2C2C]'
                    }`}
                    style={activeTab === tab.id ? {
                      background: 'linear-gradient(135deg, #f2070d 0%, #FF6B6B 100%)'
                    } : {
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>

      {/* Danger Zone */}
      <Card className="rounded-xl shadow-xl" style={{ backgroundColor: '#fff5f5', borderColor: '#fee2e2', borderWidth: '1px' }}>
        <Card.Header>
          <Card.Title className="text-[#f2070d] text-2xl font-bold">Danger Zone</Card.Title>
          <Card.Description className="text-[#666666]">
            Irreversible and destructive actions
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#2C2C2C]">Delete Account</p>
              <p className="text-sm text-[#666666]">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm text-white shadow-xl transition-all hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #f2070d 0%, #FF6B6B 100%)' }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </button>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default Settings