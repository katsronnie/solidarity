import { useState } from 'react'
import Auth from './Auth'
import ShpDashboard from './ShpDashboard'
import HealthFundPage from './HealthFundPage'
import PayHospitalPage from './PayHospitalPage'
import WithdrawPage from './WithdrawPage'
import SettingsPage from './SettingsPage'
import TransactionsPage from './TransactionsPage'
import ProfilePage from './ProfilePage'
import NotificationsPage from './NotificationsPage'
import { PageContainer } from './shared'
import AdminApp from './AdminApp'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleNavigation = (page) => {
    setCurrentPage(page)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  // Anything under /admin renders the separate admin console instead —
  // different login, different pages, nothing shared with the user app below.
  const isAdminRoute =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return <AdminApp />
  }

  return (
    <>
      <style>{`
        html, body, #root {
          width: 100%;
          margin: 0;
          padding: 0;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
      {!isAuthenticated ? (
        <Auth onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <PageContainer
          currentPage={currentPage}
          onNavigate={handleNavigation}
          onLogout={handleLogout}
        >
          {currentPage === 'dashboard' && (
            <ShpDashboard onNavigate={handleNavigation} />
          )}
          {currentPage === 'health-fund' && (
            <HealthFundPage onNavigate={handleNavigation} />
          )}
          {currentPage === 'pay-hospital' && (
            <PayHospitalPage onNavigate={handleNavigation} />
          )}
          {currentPage === 'withdraw' && (
            <WithdrawPage onNavigate={handleNavigation} />
          )}
          {currentPage === 'settings' && (
            <SettingsPage onNavigate={handleNavigation} />
          )}
          {currentPage === 'transactions' && (
            <TransactionsPage onNavigate={handleNavigation} />
          )}
          {currentPage === 'profile' && (
            <ProfilePage onNavigate={handleNavigation} />
          )}
          {currentPage === 'notifications' && (
            <NotificationsPage onNavigate={handleNavigation} />
          )}
        </PageContainer>
      )}
    </>
  )
}

export default App