export const metadata = {
  title: "PlayHub Control",
  description: "Painel da operação PlayHub",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
