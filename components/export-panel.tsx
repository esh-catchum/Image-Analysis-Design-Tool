"use client"

import { useState } from "react"
import { useDesign } from "@/context/design-context"
import { Download, ImageIcon, FileJson } from "lucide-react"
import html2canvas from "html2canvas"

export default function ExportPanel() {
  const { elements } = useDesign()
  const [isOpen, setIsOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<"png" | "jpeg" | "json">("png")
  const [exportScale, setExportScale] = useState(1)
  const [exportQuality, setExportQuality] = useState(0.9)
  const [exportName, setExportName] = useState("design-export")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      if (exportFormat === "json") {
        // Export as JSON
        const projectData = {
          name: exportName,
          elements,
          exportedAt: new Date().toISOString(),
        }

        const dataStr = JSON.stringify(projectData, null, 2)
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
        const exportFileName = `${exportName}.json`

        const linkElement = document.createElement("a")
        linkElement.setAttribute("href", dataUri)
        linkElement.setAttribute("download", exportFileName)
        linkElement.click()
      } else {
        // Export as image
        const canvas = document.querySelector(".design-canvas") as HTMLElement
        if (!canvas) {
          alert("Canvas element not found")
          return
        }

        const options = {
          scale: exportScale,
          backgroundColor: "#1E1E1E",
          logging: false,
          useCORS: true,
        }

        const result = await html2canvas(canvas, options)
        const imgData =
          exportFormat === "jpeg" ? result.toDataURL("image/jpeg", exportQuality) : result.toDataURL("image/png")

        const link = document.createElement("a")
        link.download = `${exportName}.${exportFormat}`
        link.href = imgData
        link.click()
      }
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. See console for details.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="absolute top-4 right-20">
      <button
        className="px-3 py-1 text-sm bg-[#333] rounded hover:bg-[#444] flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Download size={14} className="mr-1" />
        Export
      </button>

      {isOpen && (
        <div className="absolute top-10 right-0 bg-[#252525] rounded-lg shadow-lg p-4 w-64 z-10">
          <h3 className="text-sm font-medium mb-3">Export Design</h3>

          <div className="mb-3">
            <label className="block text-xs text-gray-400 mb-1">File Name</label>
            <input
              type="text"
              value={exportName}
              onChange={(e) => setExportName(e.target.value)}
              className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>

          <div className="mb-3">
            <label className="block text-xs text-gray-400 mb-1">Format</label>
            <div className="flex space-x-2">
              <button
                className={`flex-1 px-2 py-1 text-xs rounded flex items-center justify-center ${
                  exportFormat === "png" ? "bg-blue-600" : "bg-[#333] hover:bg-[#444]"
                }`}
                onClick={() => setExportFormat("png")}
              >
                <ImageIcon size={12} className="mr-1" />
                PNG
              </button>
              <button
                className={`flex-1 px-2 py-1 text-xs rounded flex items-center justify-center ${
                  exportFormat === "jpeg" ? "bg-blue-600" : "bg-[#333] hover:bg-[#444]"
                }`}
                onClick={() => setExportFormat("jpeg")}
              >
                <ImageIcon size={12} className="mr-1" />
                JPEG
              </button>
              <button
                className={`flex-1 px-2 py-1 text-xs rounded flex items-center justify-center ${
                  exportFormat === "json" ? "bg-blue-600" : "bg-[#333] hover:bg-[#444]"
                }`}
                onClick={() => setExportFormat("json")}
              >
                <FileJson size={12} className="mr-1" />
                JSON
              </button>
            </div>
          </div>

          {exportFormat !== "json" && (
            <>
              <div className="mb-3">
                <label className="block text-xs text-gray-400 mb-1">Scale</label>
                <select
                  value={exportScale}
                  onChange={(e) => setExportScale(Number(e.target.value))}
                  className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={3}>3x</option>
                </select>
              </div>

              {exportFormat === "jpeg" && (
                <div className="mb-3">
                  <label className="block text-xs text-gray-400 mb-1">Quality: {exportQuality * 100}%</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={exportQuality}
                    onChange={(e) => setExportQuality(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </>
          )}

          <button
            className="w-full mt-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      )}
    </div>
  )
}
