import { Montserrat, Lobster } from "next/font/google";

export const mont_serrat = Montserrat({
  subsets: ["latin"],
  weight:["100", "200", "400", "500"],
  variable: "--font-montSerrat"
});

export const lobster = Lobster({
  subsets: ["latin"],
  weight:"400",
  variable: "--font-lobster"
});

export const fonts = {
  mont_serrat,
  lobster,
}