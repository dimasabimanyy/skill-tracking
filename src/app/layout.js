import './globals.css';

export const metadata = {
  title: 'Skill Tracking',
  description: 'Personal skill and learning tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="dark">
        {children}
      </body>
    </html>
  );
}