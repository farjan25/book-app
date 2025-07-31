export default function Unauthorized() {
    return(
        <div className="absolute inset-0 z-0 bg-[url('/mainbackground.png')] bg-cover bg-no-repeat bg-center">
            <div className="flex items-center justify-center h-screen">
                <span className="text-3xl">You may have tried to access the wrong page.</span>
            </div>
        </div>
    )
}