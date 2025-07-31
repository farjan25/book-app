import { useState } from "react"
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import Image from 'next/image';

interface props {
    openState: boolean
    setOpenState: (open: boolean) => void
}

export default function NewProject({openState, setOpenState}: props) {

    const router = useRouter()
    const [projectName, setProjectName] = useState("")
    // might need to make names unique, probablly not

    function closePost() {
        setPdfFile(null)
        setMessage("")
        setUploading(false)
        setOpenState(!openState)
    }

    async function checkUserProjectCount(userId: string) {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Error fetching user rows:", error.message);
            return;
        }

        if (!data) {
            return 0
        }

        const count = data.length;
        return count
    }

    const uploadSupabase = async() => {
        const { data: { user } } = await supabase.auth.getUser();
            console.log(user?.id)
        
        if (user) {
            const userProjectCount = await checkUserProjectCount(user.id)

            // Fetch local JSON file
            const response = await fetch('/defaultSettings.json') // must be in /public
            const settings = await response.json()


            const pdfLink = await handleUpload()
            if (pdfLink == "failed") {
                return
            }

            // the user project count is more than 1 btw
            if (userProjectCount && userProjectCount > 11) {
                console.log("hello????")
                setMessage("You can't create more than 12 Projects. Try deleting some.")
                return "failed"
            }

            const { data, error } = await supabase
                .from('projects') 
                .insert([
                    {
                    user_id: user.id,
                    name: projectName,
                    settings: settings,
                    pdf_url: pdfLink
                    }
                ])
                .select();

            if (error) {
            console.error('Insert error:', error);
            } else if (data && data.length > 0) {
                
            const insertedId = data[0].id;
            const stringId = String(insertedId)
            console.log('Inserted project ID:', insertedId);

            const filePath = `${stringId}_composite`
            const res = await fetch('/googlepng.png')
            const blob = await res.blob()
            const file = new File([blob], filePath, { type: blob.type })
            
            const { data: uploadData, error: uploadError } = await supabase.storage
            .from('project-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true // overwrite if exists
            })

            return insertedId
            }
        } else {
            return "failed"
        }
    }
    
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (!pdfFile) {
            setMessage('No file uploaded.');
            return "failed";
        }

        setUploading(true);
        const filePath = `${Date.now()}_${pdfFile.name}`;

        const { data, error } = await supabase.storage
            .from('pdf')
            .upload(filePath, pdfFile);

        if (error) {
            console.error(error);
            setUploading(false);
            setMessage('Project failed to create.');
            return "failed"
        } else {
            setMessage('Project creation successful!');
            return filePath
        }
    }

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (!file || file.type !== 'application/pdf') {
            setMessage('Please drop a valid PDF.');
            return;
        }
        setPdfFile(file);
        const fileName = file.name
        setMessage(fileName);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };




    const buttonClick = async() => {
        const new_id = await uploadSupabase()
        if (new_id == "failed") {
            console.log("failed")
            return
        }
        if (new_id) {
            router.push(`/${new_id}`); 
        }
    }

    return(
        <div>
            {
                openState === false ? (
                    <div>
                        
                    </div>
                ) : (
                    <div>
                        <motion.div 
                        initial ={{ opacity:0, scale: 0.9}}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-30 left-1/2 -translate-x-1/2 w-200 h-170 bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-4 overflow-y-auto overflow-visible"
                        >
                            <div className="py-3 text-center text-2xl">
                                <h1>
                                    Upload your PDF or file:
                                </h1>
                            </div>
                            
                            <div className="py-2 ml-20 flex items-center gap-x-2 my-4">
                                Project Title:
                                <input 
                                type="text"
                                placeholder="Title"
                                onChange={(e) => setProjectName(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 w-125"
                                />
                            </div>
                            
                            <div className="py-1">
                                <button onClick={closePost} className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-200">
                                    <X size={20}></X>
                                </button>
                            </div>

                            <div className="flex justify-center">
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="border-2 border-dashed border-gray-400 rounded-md p-8 text-center bg-gray-50 w-150 h-100"
                                >
                                <p className="text-gray-700">
                                    Drag & drop a PDF file here
                                </p>
                                {uploading && <p className="text-blue-500 mt-2">Creating Project...</p>}
                                {message && <p className="text-green-600 mt-2">{message}</p>}
                                {pdfFile && 
                                <div className="flex justify-center">
                                    <Image src="/pdficon.png" alt="Avatar" width={400} height={300}
                                    className="py-5 opacity-50"></Image>
                                </div>
                                }
                                </div>
                            </div>

                            <div className="mt-5 flex justify-center">
                                <Button onClick={buttonClick} className="bg-[#FFD7D7] text-black hover:bg-[#FF8C8E] font-normal text-lg w-40 h-12">
                                   New Project
                                </Button>
                            </div>

                        </motion.div>
                    </div>
                )
            }
        </div>
    )
}
