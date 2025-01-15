import { ToastContainer } from "@/lib/utils/toasts/toast";
import ClientProvider from "./ClientProvider";

export const metadata = {
  title: 'Roastar Specialty Coffee',
  description: 'Bromley coffee shop'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ background: 'white' }}>
        <ClientProvider>
          <ToastContainer />
          {children}
        </ClientProvider>
      </body>
    </html>
  );
};
