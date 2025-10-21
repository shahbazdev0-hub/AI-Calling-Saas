


// // frontend/src/App.jsx - FIXED VERSION
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "react-hot-toast";

// // Layouts - FIXED: Consistent lowercase 'components'
// import Layout from "./Components/common/Layout";
// import ProtectedRoute from "./Components/common/ProtectedRoute";

//  import Home from "./Pages/website/Home";
// import Pricing from "./Pages/website/Pricing";
// import Features from "./Pages/website/KeyFeatures";
// import Contact from "./Pages/website/Contact";
// import DemoBooking from "./Components/forms/DemoBooking"

// // Auth Pages - FIXED: Consistent lowercase 'pages'
// import Login from "./Pages/auth/Login";
// import Signup from "./Pages/auth/Signup";
// import ForgotPassword from "./Pages/auth/ForgotPassword";
// import ResetPassword from "./Pages/auth/ResetPassword";

// // Dashboard Pages - FIXED: Consistent lowercase 'pages'
// import Dashboard from "./Pages/dashboard/Dashboard";
// import Overview from "./Pages/dashboard/Overview";
// import Profile from "./Pages/dashboard/Profile";
// import Settings from "./Pages/dashboard/Settings";

// // Milestone 2: Call Pages - FIXED: Consistent paths
// import CallCenter from "./Pages/dashboard/calls/CallCenter";
// import CallHistory from "./Pages/dashboard/calls/CallHistory";
// import CallLogs from "./Pages/dashboard/calls/CallLogs";
// import VoiceAgents from "./Pages/dashboard/calls/VoiceAgents";
// import CallAnalytics from "./Pages/dashboard/calls/CallAnalytics";
// import Recordings from "./Pages/dashboard/calls/Recordings";

// // Admin Pages - FIXED: Consistent paths
// import AdminPanel from "./Pages/dashboard/admin/AdminPanel";
// import UserManagement from "./Pages/dashboard/admin/UserManagement";
// import AccountSettings from "./Pages/dashboard/admin/AccountSettings";
// import AdminAnalytics from "./Pages/dashboard/admin/Analytics"; //  Admin Analytics

// // Error Pages - FIXED: Consistent paths
// import NotFound from "./Pages/errors/NotFound";

// // Create React Query client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Routes>
//         {/* Public Website Routes */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="pricing" element={<Pricing />} />
//           <Route path="features" element={<Features />} />
//           <Route path="contact" element={<Contact />} />
//           <Route path="demo" element={<DemoBooking />} />
//         </Route>

//         {/* Auth Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />

//         {/* Protected Dashboard Routes */}
//         <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
//           <Route index element={<Navigate to="/dashboard/overview" replace />} />
//           <Route path="overview" element={<Overview />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="settings" element={<Settings />} />

//           {/* Milestone 2: Call Routes */}
//           <Route path="calls">
//             <Route index element={<Navigate to="/dashboard/calls/center" replace />} />
//             <Route path="center" element={<CallCenter />} />
//             <Route path="history" element={<CallHistory />} />
//             <Route path="logs" element={<CallLogs />} />
//             <Route path="agents" element={<VoiceAgents />} />
//             <Route path="analytics" element={<CallAnalytics />} />
//             <Route path="recordings" element={<Recordings />} />
//           </Route>

//           {/* Admin Routes */}
//           <Route path="admin">
//             <Route index element={<AdminPanel />} />
//             <Route path="users" element={<UserManagement />} />
//             <Route path="settings" element={<AccountSettings />} />
//             <Route path="analytics" element={<AdminAnalytics />} />
//           </Route>
//         </Route>

//         {/* 404 */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>

//       {/* Toast Notifications */}
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: '#363636',
//             color: '#fff',
//           },
//           success: {
//             duration: 3000,
//             iconTheme: {
//               primary: '#10B981',
//               secondary: '#fff',
//             },
//           },
//           error: {
//             duration: 4000,
//             iconTheme: {
//               primary: '#EF4444',
//               secondary: '#fff',
//             },
//           },
//         }}
//       />
//     </QueryClientProvider>
//   );
// }

// export default App;






// // // frontend/src/App.jsx - FIXED VERSION
// // import React from "react";
// // import { Routes, Route, Navigate } from "react-router-dom";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { Toaster } from "react-hot-toast";

// // // Layouts - FIXED: Consistent lowercase 'components'
// // import Layout from "./Components/common/Layout";
// // import ProtectedRoute from "./Components/common/ProtectedRoute";

// //  import Home from "./Pages/website/Home";
// // import Pricing from "./Pages/website/Pricing";
// // import Features from "./Pages/website/KeyFeatures";
// // import Contact from "./Pages/website/Contact";
// // import DemoBooking from "./Components/forms/DemoBooking"

// // // Auth Pages - FIXED: Consistent lowercase 'pages'
// // import Login from "./Pages/auth/Login";
// // import Signup from "./Pages/auth/Signup";
// // import ForgotPassword from "./Pages/auth/ForgotPassword";
// // import ResetPassword from "./Pages/auth/ResetPassword";

// // // Dashboard Pages - FIXED: Consistent lowercase 'pages'
// // import Dashboard from "./Pages/dashboard/Dashboard";
// // import Overview from "./Pages/dashboard/Overview";
// // import Profile from "./Pages/dashboard/Profile";
// // import Settings from "./Pages/dashboard/Settings";

// // // Milestone 2: Call Pages - FIXED: Consistent paths
// // import CallCenter from "./Pages/dashboard/calls/CallCenter";
// // import CallHistory from "./Pages/dashboard/calls/CallHistory";
// // import CallLogs from "./Pages/dashboard/calls/CallLogs";
// // import VoiceAgents from "./Pages/dashboard/calls/VoiceAgents";
// // import CallAnalytics from "./Pages/dashboard/calls/CallAnalytics";
// // import Recordings from "./Pages/dashboard/calls/Recordings";

// // // Admin Pages - FIXED: Consistent paths
// // import AdminPanel from "./Pages/dashboard/admin/AdminPanel";
// // import UserManagement from "./Pages/dashboard/admin/UserManagement";
// // import AccountSettings from "./Pages/dashboard/admin/AccountSettings";
// // import AdminAnalytics from "./Pages/dashboard/admin/Analytics"; //  Admin Analytics

// // // Error Pages - FIXED: Consistent paths
// // import NotFound from "./Pages/errors/NotFound";

// // // Create React Query client
// // const queryClient = new QueryClient({
// //   defaultOptions: {
// //     queries: {
// //       retry: 1,
// //       refetchOnWindowFocus: false,
// //     },
// //   },
// // });

// // function App() {
// //   return (
// //     <QueryClientProvider client={queryClient}>
// //       <Routes>
// //         {/* Public Website Routes */}
// //         <Route path="/" element={<Layout />}>
// //           <Route index element={<Home />} />
// //           <Route path="pricing" element={<Pricing />} />
// //           <Route path="features" element={<Features />} />
// //           <Route path="contact" element={<Contact />} />
// //           <Route path="demo" element={<DemoBooking />} />
// //         </Route>

// //         {/* Auth Routes */}
// //         <Route path="/login" element={<Login />} />
// //         <Route path="/signup" element={<Signup />} />
// //         <Route path="/forgot-password" element={<ForgotPassword />} />
// //         <Route path="/reset-password" element={<ResetPassword />} />

// //         {/* Protected Dashboard Routes */}
// //         <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
// //           <Route index element={<Navigate to="/dashboard/overview" replace />} />
// //           <Route path="overview" element={<Overview />} />
// //           <Route path="profile" element={<Profile />} />
// //           <Route path="settings" element={<Settings />} />

// //           {/* Milestone 2: Call Routes */}
// //           <Route path="calls">
// //             <Route index element={<Navigate to="/dashboard/calls/center" replace />} />
// //             <Route path="center" element={<CallCenter />} />
// //             <Route path="history" element={<CallHistory />} />
// //             <Route path="logs" element={<CallLogs />} />
// //             <Route path="agents" element={<VoiceAgents />} />
// //             <Route path="analytics" element={<CallAnalytics />} />
// //             <Route path="recordings" element={<Recordings />} />
// //           </Route>

// //           {/* Admin Routes */}
// //           <Route path="admin">
// //             <Route index element={<AdminPanel />} />
// //             <Route path="users" element={<UserManagement />} />
// //             <Route path="settings" element={<AccountSettings />} />
// //             <Route path="analytics" element={<AdminAnalytics />} />
// //           </Route>
// //         </Route>

// //         {/* 404 */}
// //         <Route path="*" element={<NotFound />} />
// //       </Routes>

// //       {/* Toast Notifications */}
// //       <Toaster
// //         position="top-right"
// //         toastOptions={{
// //           duration: 4000,
// //           style: {
// //             background: '#363636',
// //             color: '#fff',
// //           },
// //           success: {
// //             duration: 3000,
// //             iconTheme: {
// //               primary: '#10B981',
// //               secondary: '#fff',
// //             },
// //           },
// //           error: {
// //             duration: 4000,
// //             iconTheme: {
// //               primary: '#EF4444',
// //               secondary: '#fff',
// //             },
// //           },
// //         }}
// //       />
// //     </QueryClientProvider>
// //   );
// // }

// // export default App;




// // frontend/src/App.jsx - FIXED VERSION milestone2
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "react-hot-toast";

// // Layouts - FIXED: Consistent uppercase 'Components'
// import Layout from "./Components/common/Layout";
// import ProtectedRoute from "./Components/common/ProtectedRoute";

// // Website Pages - FIXED: Consistent uppercase 'Pages'
// import Home from "./Pages/website/Home";
// import Pricing from "./Pages/website/Pricing";
// import Features from "./Pages/website/KeyFeatures";
// import Contact from "./Pages/website/Contact";
// import DemoBooking from "./Components/forms/DemoBooking";

// // Auth Pages - FIXED: Consistent uppercase 'Pages'
// import Login from "./Pages/auth/Login";
// import Signup from "./Pages/auth/Signup";
// import ForgotPassword from "./Pages/auth/ForgotPassword";
// import ResetPassword from "./Pages/auth/ResetPassword";

// // Dashboard Pages - FIXED: Consistent uppercase 'Pages'
// import Dashboard from "./Pages/dashboard/Dashboard";
// import Overview from "./Pages/dashboard/Overview";
// import Profile from "./Pages/dashboard/Profile";
// import Settings from "./Pages/dashboard/Settings";

// // Milestone 2: Call Pages - FIXED: Consistent paths
// import CallCenter from "./Pages/dashboard/calls/CallCenter";
// import CallHistory from "./Pages/dashboard/calls/CallHistory";
// import CallLogs from "./Pages/dashboard/calls/CallLogs";
// import VoiceAgents from "./Pages/dashboard/calls/VoiceAgents";
// import CallAnalytics from "./Pages/dashboard/calls/CallAnalytics";
// import Recordings from "./Pages/dashboard/calls/Recordings";

// // Admin Pages - FIXED: Consistent paths
// import AdminPanel from "./Pages/dashboard/admin/AdminPanel";
// import UserManagement from "./Pages/dashboard/admin/UserManagement";
// import AccountSettings from "./Pages/dashboard/admin/AccountSettings";
// import AdminAnalytics from "./Pages/dashboard/admin/Analytics";

// // Error Pages - FIXED: Consistent paths
// import NotFound from "./Pages/errors/NotFound";

// // Create React Query client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Routes>
//         {/* Public Website Routes */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="pricing" element={<Pricing />} />
//           <Route path="features" element={<Features />} />
//           <Route path="contact" element={<Contact />} />
//           <Route path="demo" element={<DemoBooking />} />
//         </Route>

//         {/* Auth Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />

//         {/* Protected Dashboard Routes */}
//         <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
//           <Route index element={<Navigate to="/dashboard/overview" replace />} />
//           <Route path="overview" element={<Overview />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="settings" element={<Settings />} />

//           {/* Milestone 2: Call Routes */}
//           <Route path="calls">
//             <Route index element={<Navigate to="/dashboard/calls/center" replace />} />
//             <Route path="center" element={<CallCenter />} />
//             <Route path="history" element={<CallHistory />} />
//             <Route path="logs" element={<CallLogs />} />
//             <Route path="agents" element={<VoiceAgents />} />
//             <Route path="analytics" element={<CallAnalytics />} />
//             <Route path="recordings" element={<Recordings />} />
//           </Route>

//           {/* Admin Routes */}
//           <Route path="admin">
//             <Route index element={<AdminPanel />} />
//             <Route path="users" element={<UserManagement />} />
//             <Route path="settings" element={<AccountSettings />} />
//             <Route path="analytics" element={<AdminAnalytics />} />
//           </Route>
//         </Route>

//         {/* 404 */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>

//       {/* Toast Notifications */}
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: '#363636',
//             color: '#fff',
//           },
//           success: {
//             duration: 3000,
//             iconTheme: {
//               primary: '#10B981',
//               secondary: '#fff',
//             },
//           },
//           error: {
//             duration: 4000,
//             iconTheme: {
//               primary: '#EF4444',
//               secondary: '#fff',
//             },
//           },
//         }}
//       />
//     </QueryClientProvider>
//   );
// }

// export default App;




// frontend/src/App.jsx - MILESTONE 3 WITH AUTOMATION
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Layouts
import Layout from "./Components/common/Layout";
import ProtectedRoute from "./Components/common/ProtectedRoute";

// Website Pages
import Home from "./Pages/website/Home";
import Pricing from "./Pages/website/Pricing";
import Features from "./Pages/website/KeyFeatures";
import Contact from "./Pages/website/Contact";
import DemoBooking from "./Components/forms/DemoBooking";

// Auth Pages
import Login from "./Pages/auth/Login";
import Signup from "./Pages/auth/Signup";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import ResetPassword from "./Pages/auth/ResetPassword";

// Dashboard Pages
import Dashboard from "./Pages/dashboard/Dashboard";
import Overview from "./Pages/dashboard/Overview";
import Profile from "./Pages/dashboard/Profile";
import Settings from "./Pages/dashboard/Settings";

// Milestone 2: Call Pages
import CallCenter from "./Pages/dashboard/calls/CallCenter";
import CallHistory from "./Pages/dashboard/calls/CallHistory";
import CallLogs from "./Pages/dashboard/calls/CallLogs";
import VoiceAgents from "./Pages/dashboard/calls/VoiceAgents";
import CallAnalytics from "./Pages/dashboard/calls/CallAnalytics";
import Recordings from "./Pages/dashboard/calls/Recordings";

// ✅ MILESTONE 3 - Automation Pages
import Automations from "./Pages/dashboard/automation/Automations";
import Workflows from "./Pages/dashboard/automation/Workflows";
import Campaigns from "./Pages/dashboard/automation/Campaigns";
import SMSMessages from "./Pages/dashboard/automation/SMSMessages";

// Admin Pages
import AdminPanel from "./Pages/dashboard/admin/AdminPanel";
import UserManagement from "./Pages/dashboard/admin/UserManagement";
import AccountSettings from "./Pages/dashboard/admin/AccountSettings";
import AdminAnalytics from "./Pages/dashboard/admin/Analytics";

// Error Pages
import NotFound from "./Pages/errors/NotFound";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="features" element={<Features />} />
          <Route path="contact" element={<Contact />} />
          <Route path="demo" element={<DemoBooking />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />

          {/* Milestone 2: Call Routes */}
          <Route path="calls">
            <Route index element={<Navigate to="/dashboard/calls/center" replace />} />
            <Route path="center" element={<CallCenter />} />
            <Route path="history" element={<CallHistory />} />
            <Route path="logs" element={<CallLogs />} />
            <Route path="agents" element={<VoiceAgents />} />
            <Route path="analytics" element={<CallAnalytics />} />
            <Route path="recordings" element={<Recordings />} />
          </Route>

          {/* ✅ MILESTONE 3: Automation Routes */}
          <Route path="automations" element={<Automations />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="sms" element={<SMSMessages />} />

          {/* Admin Routes */}
          <Route path="admin">
            <Route index element={<AdminPanel />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;