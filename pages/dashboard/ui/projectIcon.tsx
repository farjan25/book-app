import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface props {
    projectId: number
    projectName: string
}

export default function ProjectIcon({projectId, projectName}: props) {

    const router = useRouter()
    
    const project = "project-page"
    const coverFilePath = `${projectId}_cover`
    const [signedUrl, setSignedUrl] = useState<string | null>(null)

    useEffect(() => {
        
        const getImageUrl = async () => {
        const { data, error } = await supabase
            .storage
            .from('project-images')
            .createSignedUrl(coverFilePath, 60 * 60) // valid for 1 hour

        if (error || !data?.signedUrl) {
            setSignedUrl(null) // or other image
        } else {
            setSignedUrl(data.signedUrl)
        }
    }

        getImageUrl()
        
    }, [])

    // on click should have {() => router.push(`/project/${project.slug}`)}
    return(
        //<button onClick={() => router.push(`/${project}`)}>
        <button onClick={() => router.push(`/${projectId}`)}>
            <div className="w-70 h-90 bg-[#FFD7D7] border-gray-200 p-4 cursor-pointer rounded-lg shadow-lg">
                <div className="flex justify-center">
                    <div className="bg-white w-50 h-65 translate-y-2">
                        {signedUrl && <img src={signedUrl} alt="Cover Image" className="w-full h-full object-cover"/>}
                    </div>
                </div>

                <div className="text-xl translate-y-6 text-gray-800">
                    {projectName}
                </div>
            </div>
        </button>
    
    )
}