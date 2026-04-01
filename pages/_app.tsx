import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Outfit } from "next/font/google";

// Configure the font
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], 
  variable: "--font-outfit"
});


export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={outfit.className}>
      <Component {...pageProps} />
    </div>
  );
}
