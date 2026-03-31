//list of google fonts here.
export const googleFonts = {

}

export async function fetchGoogleFonts() {
const res = await fetch(process.env.NEXT_PUBLIC_GOOGLE_FONT_API!)
  const data = await res.json()
  return data.items.map((font: any) => ({
    name: font.family,
    url: font.files.regular // or choose 'italic', '700', etc. based on your needs
  }))
}
//AIzaSyA7PjZk4XECIdsCBRrgFzbN-Vd0r9ZVMvA
//https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyA7PjZk4XECIdsCBRrgFzbN-Vd0r9ZVMvA