import "../styles/globals.css";

export const metadata = {
  title: "Hemanth",
  description: "Photography Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
