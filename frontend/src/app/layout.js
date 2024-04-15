import "./globals.css";
import { Providers } from './providers';
import { fonts } from './fonts';
import BlurBackground from "./blurbackground";

export const metadata = {
  title: "Voting Dapp",
  description: "A simple proof of concept decentralize app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fonts.mont_serrat.variable}>
      <body>
        <Providers>
          {children}
          <BlurBackground />
        </Providers>
     </body>
    </html>
  );
}
