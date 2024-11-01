import { ChangeEvent, Dispatch, SetStateAction } from "react";

export type fileOnDragEvent = React.DragEvent<HTMLLabelElement | HTMLInputElement>

const LoadDataUrl = (file: any, SetFunction: Dispatch<SetStateAction<any>>) => {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    SetFunction(e.target.result)
  }
  reader.readAsDataURL(file)
}

export const handleFileChange = (
  e: ChangeEvent<HTMLInputElement>,
  setFile: Dispatch<SetStateAction<any>>,
  setPreviewFile: Dispatch<SetStateAction<any>>
) => {
  if(!e.target.files) return;
  const file = e.target.files[0];
  setFile(file)

  LoadDataUrl(file, setPreviewFile)
}

export const handleDropOver = (
  e: fileOnDragEvent,
  setFile: Dispatch<SetStateAction<any>>,
  setPreviewFile: Dispatch<SetStateAction<any>>
) => {
  e.preventDefault()
  if(!e.dataTransfer.files) return;
  const file = e.dataTransfer.files[0];
  setFile(file);

  LoadDataUrl(file, setPreviewFile)
}

export const handleDragOver = (e: fileOnDragEvent) => {
  e.preventDefault();
}
