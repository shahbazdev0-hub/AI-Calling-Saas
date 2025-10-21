// FILE 4: frontend/src/Components/common/Sidebar.jsx - ADD AUTOMATION NAV
// =============================================================================
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Phone,
  MessageSquare,
  Mail,
  Zap,
  GitBranch,
  FileText,
  Bell,
  Settings,
  Users,
  BarChart3,
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { name: 'Overview', path: '/dashboard/overview', icon: LayoutDashboard },
    
    // Milestone 2: Calls Section
    { name: 'Call Center', path: '/dashboard/calls', icon: Phone },
    { name: 'Call History', path: '/dashboard/calls/history', icon: Phone },
    { name: 'Voice Agents', path: '/dashboard/calls/agents', icon: MessageSquare },
    { name: 'Call Analytics', path: '/dashboard/calls/analytics', icon: BarChart3 },
    
    // ✅ MILESTONE 3: Automation Section
    { 
      section: 'Automation',
      items: [
        { name: 'Campaigns', path: '/dashboard/automation/campaigns', icon: Mail },
        { name: 'Workflows', path: '/dashboard/automation/workflows', icon: GitBranch },
        { name: 'Templates', path: '/dashboard/automation/templates', icon: FileText },
        { name: 'Triggers', path: '/dashboard/automation/triggers', icon: Zap },
        { name: 'N8N Workflows', path: '/dashboard/automation/n8n', icon: GitBranch },
      ]
    },
    
    // Settings
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">CallCenter SaaS</h2>
        
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            if (item.section) {
              return (
                <div key={index} className="pt-4">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {item.section}
                  </h3>
                  {item.items.map((subItem) => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      <subItem.icon className="mr-3 h-5 w-5" />
                      {subItem.name}
                    </NavLink>
                  ))}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;