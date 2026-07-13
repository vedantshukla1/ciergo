import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookingsPage } from '@/pages/BookingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/bookings" replace />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
        <Route path="/customers" element={<PlaceholderPage title="Customers" />} />
        <Route path="/finance" element={<PlaceholderPage title="Finance" />} />
        <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
        <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
        <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        <Route path="*" element={<Navigate to="/bookings" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-xl font-semibold text-gray-400">{title} (coming soon)</p>
  </div>
);

export default App;
