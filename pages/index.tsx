import Header from "./landingPage/header"
import Body from './landingPage/body'

export default function Home() {
  return (
    <div className="">
      <div className="relative w-full h-[3300px] overflow-hidden">
        <img
          src="/landingpage2.png"
          alt="Background"
          className="w-full h-auto absolute top-0 left-0 -z-10"
        />
        <Header />
        <Body />
      </div>
    </div>
  );
}
