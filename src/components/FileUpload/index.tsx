import React, { useState } from "react"
import { FaUpload } from "react-icons/fa6"
import mockData from "./smallPaymentListMock.json"
import statementListMockData from "./statementListMock.json"
// import axiosInstance from "../../utils/axiosInstance"
import Button from "../Button"
import Table from "../Table"

interface FileUploadProps {
  onFileUpload: (file: File) => void
  type: "Lista de pagamento" | "Analise de inscriçoes" | "Extrato de pagamento"
}

const FileUpload = ({ onFileUpload, type }: FileUploadProps) => {
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [responseData, setResponseData] = useState<any>(null) // Estado para armazenar a resposta do servidor

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (file) {
        setSelectedFile(file)
        onFileUpload(file)
        setFileName(file.name)
      }

      setProgress(100)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]

      if (file) {
        setSelectedFile(file)
        onFileUpload(file)
        setFileName(file.name)
      }

      setProgress(100)
    }
  }

  const handleGenerateList = async () => {
    if (!selectedFile) {
      console.log("Nenhum arquivo selecionado")
      return
    }

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      //Simula a chamada à API usando os dados de mock.json
      // const response = await axiosInstance.post("/rank-ia/ranquear-alunos", formData, {
      //   onUploadProgress: (progressEvent) => {
      //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //     setProgress(percentCompleted);
      //   },
      // });

      if (type === "Lista de pagamento" || type === "Analise de inscriçoes") {
        const response = { data: mockData }

        setResponseData(response.data.data)

        console.log("Resposta do servidor:", response.data)
        console.log("Lista gerada com sucesso!")
      } else if (type === "Extrato de pagamento") {
        const response = { data: statementListMockData }

        setResponseData(response.data.extrato)

        console.log("Resposta do servidor:", response.data)
        console.log("Lista gerada com sucesso!")
      }
    } catch (error) {
      console.error("Erro ao gerar lista:", error)
      console.log("Ocorreu um erro ao enviar o arquivo.")
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }
  return (
    <>
      {responseData ? (
        <>
          <h1 className="mb-6 self-start text-2xl font-bold">
            {type === "Extrato de pagamento" ? "Extrato de pagamento:" : "Selecione os alunos que serão contemplados:"}
          </h1>
          <div className="mt-4 max-h-screen max-w-screen-xl overflow-scroll">
            <Table
              IdentifierColumn="Data de criação"
              type={type}
              alunos={responseData}
              colunasOmitidas={["created at", "process"]}
            />
          </div>
          <div className="flex w-full max-w-xl items-center justify-center gap-10">
            {type === "Analise de inscriçoes" && (
              <Button text="Salvar Rascunho" color="white" size="full" onClick={() => setResponseData(null)} />
            )}
            <Button
              text={type === "Analise de inscriçoes" ? "Confirmar Escolhas" : "Enviar Extrato de pagamento"}
              color="green"
              size="full"
              onClick={handleGenerateList}
              disabled={!selectedFile || progress < 100}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8">
          <h2 className="text-lg font-bold">Carregue seu arquivo</h2>
          <div className="flex w-full max-w-60 flex-col gap-8">
            <div
              className={`max-w-60 rounded-md border-2 border-gray-300 p-6 text-center transition-colors duration-100 ${
                isDragging ? "border-primary-medium/50 bg-primary-medium/50 text-black" : "border-dashed bg-white"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <FaUpload size={48} />
                  <span className={`${isDragging ? "text-black" : "text-[#A0AEC0]"} transition-colors duration-100`}>
                    Arraste seu arquivo aqui ou procure um arquivo para fazer upload
                  </span>
                </div>
              </label>
            </div>
            {progress > 0 && (
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`${
                    progress < 100 ? "opacity-75" : ""
                  } mt-2 flex w-full items-center justify-center gap-2 font-semibold text-[#04091E]`}
                >
                  <div className="w-full rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-green-500 p-0.5 text-center text-xs font-medium leading-none text-white"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {progress}%
                </div>
                {fileName && <p className="max-w-min truncate text-center font-semibold text-[#A0AEC0]">{fileName}</p>}
              </div>
            )}
            <Button
              text={type === "Lista de pagamento" ? "Gerar lista" : "Enviar Extrato"}
              color="green"
              onClick={handleGenerateList}
              disabled={!selectedFile || progress < 100}
              className={`${
                !selectedFile || progress < 100
                  ? "cursor-not-allowed bg-primary-medium opacity-50 hover:bg-primary-medium"
                  : "cursor-pointer"
              }`}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default FileUpload
