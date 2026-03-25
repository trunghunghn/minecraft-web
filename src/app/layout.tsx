import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minecraft Web 1.12.2 - Play & Code",
  description: "Website chơi Minecraft 1.12.2 trực tiếp trên trình duyệt với khả năng lập trình script.",
  icons: {
    icon: "/icon.png?v=3",
    shortcut: "/icon.png?v=3",
    apple: "/icon.png?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased overflow-x-hidden min-h-screen">
        <div className="fixed inset-0 bg-[url('https://www.minecraft.net/content/dam/games/minecraft/key-art/Minecraft-1.20-Trails-and-Tales-Update_KeyArt_1920x1080.jpg')] bg-cover bg-center brightness-[0.3] -z-10" />
        <main className="relative z-0 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
