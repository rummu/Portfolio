import "./globals.css";

export const metadata = {
  title: "Rumman Ahmad — Portfolio",
  description: "Rumman Ahmad's portfolio — Masters in CS at University of Bonn, AI/ML engineer, researcher.",
  keywords: "Rumman Ahmad, portfolio, machine learning, AI, computer vision, deep learning",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v6.2.1/css/all.css" />
        <link rel="stylesheet" href="https://cdn.rawgit.com/jpswalsh/academicons/master/css/academicons.min.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme') || 'light';
                if (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  theme = 'dark';
                }
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
