import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';

export const metadata = {
  title: 'Skill Tracking',
  description: 'Personal skill and learning tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="dark">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}