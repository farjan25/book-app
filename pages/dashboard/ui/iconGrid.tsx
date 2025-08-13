import { useEffect, useState } from "react";
import ProjectIcon from "./projectIcon";
import { PlusIcon } from '@heroicons/react/24/outline';
import NewProject from "./newProject";
import { supabase } from "@/lib/supabaseClient";

interface props {

}

export default function IconGrid({}: props) {

    const [open, setOpen] = useState(false)
    
    const [projectList, setProjectList] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {

        const fetchProjects = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            const { data, error } = await supabase
            .from('projects')
            .select('id, name')
            .eq('user_id', user?.id)

            if (error) {
                console.error("Error fetching projects:", error)
            }

            if (data) {
                setProjectList(data)
            }
        }

        fetchProjects()
    }, [])


    function newProject() {
        setOpen(!open)
    }


    return(
        <div className="p-4 grid grid-cols-6 gap-6">
            {projectList.map(project => (
                <ProjectIcon key={project.id} projectId={project.id} projectName={project.name}/>
            ))}

            <button onClick={newProject} className="relative w-15 h-15 rounded-full bg-[#FFD7D7] flex items-center justify-center hover:bg-[#FF8C8E] transition mt-33 shadow-md">
                <PlusIcon className='w-6 h-6 text-gray-800' />
            </button>
            <NewProject openState={open} setOpenState={setOpen} />
        </div>
    )
}