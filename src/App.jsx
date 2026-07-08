import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import SuperAppShell from './components/SuperAppShell'
import HubPage from './pages/HubPage'
import SearchPage from './pages/SearchPage'
import PostDetailPage from './pages/PostDetailPage'
import CreatePostPage from './pages/CreatePostPage'
import ProfilePage from './pages/ProfilePage'
import ConselheirosPage from './pages/ConselheirosPage'
import ConnectionsPage from './pages/ConnectionsPage'
import InboxPage from './pages/InboxPage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'
import RetrospectivePage from './pages/RetrospectivePage'
import ModLayout from './pages/mod/ModLayout'
import ModOverview from './pages/mod/ModOverview'
import ModReports from './pages/mod/ModReports'
import ModUsers from './pages/mod/ModUsers'
import ModAdvisors from './pages/mod/ModAdvisors'
import ModAudit from './pages/mod/ModAudit'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
    <AppProvider>
      {/* HashRouter: navegação compatível com GitHub Pages (sem 404 em refresh) */}
      <HashRouter>
        <ScrollToTop />
        <Routes>
          {/* Dashboard de moderação — dark mode nativo, layout próprio */}
          <Route path="/moderacao" element={<ModLayout />}>
            <Route index element={<ModOverview />} />
            <Route path="denuncias" element={<ModReports />} />
            <Route path="usuarios" element={<ModUsers />} />
            <Route path="conselheiros" element={<ModAdvisors />} />
            <Route path="auditoria" element={<ModAudit />} />
          </Route>

          {/* Retrospectiva em tela cheia (sem layout) */}
          <Route path="/retrospectiva" element={<RetrospectivePage />} />

          {/* Área do aluno */}
          <Route
            path="*"
            element={
              <SuperAppShell>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HubPage />} />
                    <Route path="/busca" element={<SearchPage />} />
                    <Route path="/post/:postId" element={<PostDetailPage />} />
                    <Route path="/novo-post" element={<CreatePostPage />} />
                    <Route path="/perfil/:userId" element={<ProfilePage />} />
                    <Route path="/conselheiros" element={<ConselheirosPage />} />
                    <Route path="/conexoes" element={<ConnectionsPage />} />
                    <Route path="/mensagens" element={<InboxPage />} />
                    <Route path="/notificacoes" element={<NotificationsPage />} />
                    <Route path="/configuracoes" element={<SettingsPage />} />
                  </Routes>
                </Layout>
              </SuperAppShell>
            }
          />
        </Routes>
      </HashRouter>
    </AppProvider>
    </ThemeProvider>
  )
}
