import './globals.css'

export const metadata = {
  title: 'Kloe Care — Cuidado Inteligente para tus Mascotas',
  description: 'Plataforma de gestión y cuidado de mascotas. Registra la salud, alimentación y bienestar de tu compañero.',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, fontFamily: "'Inter', sans-serif" }}>{children}</body>
    </html>
  )
}
