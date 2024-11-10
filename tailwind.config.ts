import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import daisyui from "daisyui"
import { withUt } from "uploadthing/tw";


export default withUt({
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  daisyui:{
  themes: ["light", "dark"]
  },
  plugins: [daisyui],
}) satisfies Config;
