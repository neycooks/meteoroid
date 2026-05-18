import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meteoroid - Code Editor',
  description: 'A modern web-based code editor built with Next.js and Monaco Editor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
