import Header from "./landingPage/header"
import Body from './landingPage/body'

export default function Home() {
  return (
    <div className="absolute inset-0 z-0 bg-[url('/mainpage.png')] bg-cover bg-no-repeat bg-center">
      <div>
        <Header />
        <Body />
      </div>
    </div>
  );
}
