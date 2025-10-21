// Layout.jsx - CORRECT VERSION
import { Outlet, useLocation } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

const Layout = () => {
  const location = useLocation()
  
  // Don't show header/footer on auth pages or dashboard
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname)
  const isDashboard = location.pathname.startsWith('/dashboard')
  
  if (isAuthPage || isDashboard) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout