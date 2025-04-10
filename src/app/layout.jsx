import { ToastContainer } from "@/lib/utils/toasts/toast";
import ClientProvider from "./ClientProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: 'Roastar Coffee',
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ background: 'white' }}>
        <ClientProvider>
          <ToastContainer />
          {children}
          <SpeedInsights />
        </ClientProvider>
      </body>
    </html>
  );
};
