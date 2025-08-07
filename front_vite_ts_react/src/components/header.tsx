// IMPORTS 
// Componenets
import { Info } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"

// TYPES
type LandingPageProps = {
    setCurrentPage: React.Dispatch<React.SetStateAction<'Landing' | 'Jokes'>>;
};




// COMPONENT 
export const Header = ({ setCurrentPage }: LandingPageProps) => {

    return (
        <div
            id="Header"
            className="bg-white w-full  flex flex-row gap-5 justify-between items-center p-5 border-b-2 border-trim">

            <h1 className="whitespace-nowrap text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">Full-Stack Laughs</h1>

            {/* Dialog */}
            <Dialog>
                <DialogTrigger
                    className="group bg-trim w-20 aspect-square rounded-3xl rounded-bl-none flex justify-center items-center hover:shadow-2xl transition-shadow">
                    <Info
                        color="white"
                        size={40}
                        className="opacity-30 group-hover:opacity-100 transition-opacity duration-300"
                    />
                </DialogTrigger>
                <DialogContent className='gap-5'>
                    <DialogHeader>
                        <DialogTitle>Full-Stack Laughs</DialogTitle>
                        <DialogDescription>
                            Welcome to Full-Stack laughs.
                            <br />
                            To get going, follow the instructions below.
                            <br />
                            For a more detailed description about the app, please refer to the README.md file.
                        </DialogDescription>
                    </DialogHeader>
                    <div>🚀 Ensure the server is listening on port 3000</div>
                    <div>🌱 Use the front end to seed the database</div>
                    <div>🤣 Click 'Make me laugh" to see the jokes</div>
                    <DialogClose onClick={() => { setCurrentPage('Landing') }} className='border-1 rounded-md bg-black text-white p-2 hover:bg-trim hover:text-black duration-150 cursor-pointer'>
                        Take me home
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    )
}