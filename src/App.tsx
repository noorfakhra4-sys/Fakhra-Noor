import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { AIChat } from './pages/AIChat';
import { ImageStudio } from './pages/ImageStudio';
import { VideoStudio } from './pages/VideoStudio';
import { CommunityGallery } from './pages/CommunityGallery';
import { MediaLibrary } from './pages/MediaLibrary';
import { Pricing } from './pages/Pricing';
import { AdminPanel } from './pages/AdminPanel';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="chat" element={<AIChat />} />
            <Route path="image-studio" element={<ImageStudio />} />
            <Route path="video-studio" element={<VideoStudio />} />
            <Route path="community" element={<CommunityGallery />} />
            <Route path="library" element={<MediaLibrary />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
