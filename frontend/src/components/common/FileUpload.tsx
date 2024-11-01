import { Dispatch, SetStateAction } from "react"
import { cn } from "@/lib/utils"
import { handleDragOver, handleDropOver, handleFileChange } from "@/lib/FileInputs.util"

const ButtonDesign = "h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"

type FileUploadProps = {
    className?: string,
    type?: 'Button' | 'onDrop',
    file: File | undefined,
    setFile: Dispatch<SetStateAction<File | undefined>>,
    setPreviewFile: Dispatch<SetStateAction<any>>
}

const FileUpload = ({
    className,
    type="onDrop",
    file,
    setFile,
    setPreviewFile,
}: FileUploadProps) => {

    const labelStyle = {
        Button: ButtonDesign,
        onDrop: 'cursor-pointer w-[300px] h-[80px] border-2 border-dashed border-muted-foreground flex items-center justify-center rounded-md font-bold'
    }

    return (
        <div>
            <label
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDropOver(e, setFile, setPreviewFile)}
            className={cn(labelStyle[type], className)}
            htmlFor="fileInput">
                {file ? "Change File" : "Upload File"}
            </label>
            <input hidden onChange={(e) => handleFileChange(e, setFile, setPreviewFile)} id="fileInput" type="file" />
        </div>
    )
}

export default FileUpload