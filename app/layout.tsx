import type {Metadata} from 'next';
import { Work_Sans } from 'next/font/google';
import './globals.css'; // Global styles

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
});

export const metadata: Metadata = {
  title: 'The Daily Grind',
  description: 'Experience the Perfect Brew',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={workSans.variable}>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
