// Tela de Extratos - logado como Financeiro
"use client"

import { useEffect, useState } from "react"

import FileUpload from "src/components/FileUpload"
import RootLayout from "../layout"

export default function UploadStatementFinancePage() {
  // Verifica se o componente já foi montado
  const [isMounted, setIsMounted] = useState(false)
  const userRole = "Financeiro"

  // useEffect para setar que o componente foi montado apenas no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Renderiza o layout apenas depois que o componente foi montado no cliente
  if (!isMounted) {
    return null // Ou pode retornar um spinner ou qualquer placeholder
  }

  const handleFileUpload = (file: File) => {
    console.log("Arquivo carregado:", file)
    // TODO - Faça o processamento necessário com o arquivo
  }

  return (
    <RootLayout userRole={userRole}>
      <div className="rounded-lg bg-white p-8 px-36 shadow-md">
        <div className="flex flex-col items-center space-y-4">
          <FileUpload type="Extrato de pagamento" onFileUpload={handleFileUpload} />
        </div>
      </div>
    </RootLayout>
  )
}
