import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata = {
  title: "Dev Studio",
  description: "Seu segundo cérebro de desenvolvedor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
