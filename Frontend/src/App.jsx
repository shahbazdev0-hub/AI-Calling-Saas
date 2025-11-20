// // frontend/src/App.jsx - UPDATED WITH SMS & EMAIL LOGS ROUTES

// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "react-hot-toast";

// // Layouts
// import Layout from "./Components/common/Layout";
// import ProtectedRoute from "./Components/common/ProtectedRoute";

// // Website Pages
// import Home from "./Pages/website/Home";
// import Pricing from "./Pages/website/Pricing";
// import Features from "./Pages/website/KeyFeatures";
// import Contact from "./Pages/website/Contact";
// import DemoBooking from "./Components/forms/DemoBooking";

// // Auth Pages
// import Login from "./Pages/auth/Login";
// import Signup from "./Pages/auth/Signup";
// import ForgotPassword from "./Pages/auth/ForgotPassword";
// import ResetPassword from "./Pages/auth/ResetPassword";

// // Dashboard Pages
// import Dashboard from "./Pages/dashboard/Dashboard";
// import Overview from "./Pages/dashboard/Overview";
// import Profile from "./Pages/dashboard/Profile";
// import Settings from "./Pages/dashboard/Settings";

// // Milestone 2: Call Pages
// import CallCenter from "./Pages/dashboard/calls/CallCenter";
// import CallHistory from "./Pages/dashboard/calls/CallHistory";
// import CallLogs from "./Pages/dashboard/calls/CallLogs";
// import VoiceAgents from "./Pages/dashboard/calls/VoiceAgents";
// import CallAnalytics from "./Pages/dashboard/calls/CallAnalytics";
// import Recordings from "./Pages/dashboard/calls/Recordings";

// // ✅ NEW - Communication Pages (SMS & Email Logs)
// import SMSLogs from "./Pages/dashboard/communication/SMSLogs";
// import EmailLogs from "./Pages/dashboard/communication/EmailLogs";
// import SMSChat from "./Pages/dashboard/communication/SMSChat";

// // Milestone 3: Keep only Campaigns (AI Campaign Builder)
// import Campaigns from "./Pages/dashboard/automation/Campaigns";

// // Admin Pages
// import AdminPanel from "./Pages/dashboard/admin/AdminPanel";
// import UserManagement from "./Pages/dashboard/admin/UserManagement";
// import AccountSettings from "./Pages/dashboard/admin/AccountSettings";
// import AdminAnalytics from "./Pages/dashboard/admin/Analytics";

// // Error Pages
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

//           {/* ✅ NEW - Communication Routes (SMS & Email Logs) */}
//           <Route path="sms-logs" element={<SMSLogs />} />
//           <Route path="sms-chat/:phoneNumber" element={<SMSChat />} />
//           <Route path="email-logs" element={<EmailLogs />} />

//           {/* Keep only AI Campaign Builder from Milestone 3 */}
//           <Route path="campaigns" element={<Campaigns />} />

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


// frontend/src/App.jsx - FIXED

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

// Communication Pages (SMS & Email Logs)
import SMSLogs from "./Pages/dashboard/communication/SMSLogs";
import EmailLogs from "./Pages/dashboard/communication/EmailLogs";
import SMSChat from "./Pages/dashboard/communication/SMSChat";

// Milestone 3: Campaigns
import Campaigns from "./Pages/dashboard/automation/Campaigns";

// Admin Pages
import AdminPanel from "./Pages/dashboard/admin/AdminPanel";
import UserManagement from "./Pages/dashboard/admin/UserManagement";
import AccountSettings from "./Pages/dashboard/admin/AccountSettings";
import AdminAnalytics from "./Pages/dashboard/admin/Analytics";

// ✅ MILESTONE 4 - CRM Pages
import CRMDashboard from "./Pages/dashboard/crm/CRMDashboard";
import Customers from "./Pages/dashboard/crm/Customers";
import CustomerDetails from "./Pages/dashboard/crm/CustomerDetails";
import CustomerForm from "./Pages/dashboard/crm/CustomerForm";

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

          {/* Communication Routes (SMS & Email Logs) */}
          <Route path="sms-logs" element={<SMSLogs />} />
          <Route path="sms-chat/:phoneNumber" element={<SMSChat />} />
          <Route path="email-logs" element={<EmailLogs />} />

          {/* Campaign Builder */}
          <Route path="campaigns" element={<Campaigns />} />

          {/* ✅ FIXED - CRM Routes (Removed duplicate <ProtectedRoute>) */}
          <Route path="crm">
            <Route index element={<CRMDashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/new" element={<CustomerForm />} />
            <Route path="customers/:customerId" element={<CustomerDetails />} />
            <Route path="customers/:customerId/edit" element={<CustomerForm />} />
          </Route>

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