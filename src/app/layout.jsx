import { ToastContainer } from "@/lib/utils/toasts/toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer.jsx';
import './globals.css';

export const metadata = {
  title: 'Roastar Coffee | Vietnamese Specialty Coffee Shop',
  description: 'Vietnamese Specialty Coffee',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ background: 'white' }}>
        <header><Navbar /></header>
        <main>{children}</main>
        <footer><Footer /></footer>
        <ToastContainer />
        <SpeedInsights />
      </body>
    </html>
  );
}