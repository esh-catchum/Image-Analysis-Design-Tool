"use client"

import { useDesign } from "@/context/design-context"
import { Eye, Layers } from "lucide-react"
import { useState } from "react"

export default function LayersPanel() {
  const { elements, selectedElementId, selectElement } = useDesign()
  const [isOpen, setIsOpen] = useState(true)

  // Sort elements by z-index for the layers panel (highest z-index at the top)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex)

  return (
    <div className="absolute bottom-4 left-4 bg-[#252525] rounded-lg shadow-lg w-64">
      <div
        className="p-2 border-b border-[#333] flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Layers size={16} className="mr-2" />
          <span className="text-sm font-medium">Layers</span>
        </div>
        <div className="text-xs text-gray-400">{elements.length} elements</div>
      </div>

      {isOpen && (
        <div className="max-h-60 overflow-y-auto">
          {sortedElements.map((element) => (
            <div
              key={element.id}
              className={`p-2 flex items-center justify-between hover:bg-[#333] cursor-pointer ${
                selectedElementId === element.id ? "bg-[#333]" : ""
              }`}
              onClick={() => selectElement(element.id)}
            >
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: element.fill }}></div>
                <span className="text-xs">
                  {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
                  {element.type === "text" && element.text
                    ? `: ${element.text.substring(0, 15)}${element.text.length > 15 ? "..." : ""}`
                    : ""}
                </span>
              </div>
              <div>
                <button className="text-gray-400 hover:text-white">
                  <Eye size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
