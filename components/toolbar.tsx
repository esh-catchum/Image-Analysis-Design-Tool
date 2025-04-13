"use client"

import { Download, Save, Upload, Undo, Redo } from "lucide-react"
import { useDesign } from "@/context/design-context"
import { useState } from "react"

export default function Toolbar() {
  const { elements, loadProject, undo, redo, canUndo, canRedo } = useDesign()
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [projectName, setProjectName] = useState("Untitled Project")

  const handleSave = () => {
    const projectData = {
      name: projectName,
      elements,
      lastModified: new Date().toISOString(),
    }

    // Save to localStorage
    localStorage.setItem("design-project", JSON.stringify(projectData))

    // You could also implement saving to a server here

    setShowSaveDialog(false)
  }

  const handleLoad = () => {
    const savedProject = localStorage.getItem("design-project")
    if (savedProject) {
      try {
        const projectData = JSON.parse(savedProject)
        loadProject(projectData.elements)
        alert(`Project "${projectData.name}" loaded!`)
      } catch (error) {
        console.error("Failed to load project:", error)
        alert("Failed to load project")
      }
    } else {
      alert("No saved project found")
    }
  }

  const handleExport = () => {
    const projectData = {
      name: projectName,
      elements,
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(projectData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `${projectName.toLowerCase().replace(/\s+/g, "-")}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="h-12 border-b border-[#333] flex items-center px-4">
      <div className="flex space-x-2">
        <button
          className="px-3 py-1 text-sm bg-[#333] rounded hover:bg-[#444] flex items-center"
          onClick={() => setShowSaveDialog(true)}
        >
          <Save size={14} className="mr-1" />
          Save
        </button>
        <button className="px-3 py-1 text-sm bg-[#333] rounded hover:bg-[#444] flex items-center" onClick={handleLoad}>
          <Upload size={14} className="mr-1" />
          Load
        </button>
        <button
          className="px-3 py-1 text-sm bg-[#333] rounded hover:bg-[#444] flex items-center"
          onClick={handleExport}
        >
          <Download size={14} className="mr-1" />
          Export
        </button>

        <div className="border-l border-[#333] mx-2 h-6"></div>

        <button
          className={`px-3 py-1 text-sm ${canUndo ? "bg-[#333] hover:bg-[#444]" : "bg-[#222] text-gray-500 cursor-not-allowed"} rounded flex items-center`}
          onClick={undo}
          disabled={!canUndo}
        >
          <Undo size={14} className="mr-1" />
          Undo
        </button>
        <button
          className={`px-3 py-1 text-sm ${canRedo ? "bg-[#333] hover:bg-[#444]" : "bg-[#222] text-gray-500 cursor-not-allowed"} rounded flex items-center`}
          onClick={redo}
          disabled={!canRedo}
        >
          <Redo size={14} className="mr-1" />
          Redo
        </button>
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#252525] rounded-lg p-6 w-80">
            <h3 className="text-lg font-medium mb-4">Save Project</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-[#333] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-3 py-1 text-sm bg-transparent hover:bg-[#333] rounded"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
