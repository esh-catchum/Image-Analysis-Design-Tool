"use client"

import { useDesign } from "@/context/design-context"
import { AlignCenter, AlignLeft, AlignRight, AlignHorizontalSpaceAround, AlignVerticalSpaceAround } from "lucide-react"

export default function AlignmentToolbar() {
  const { elements, selectedElementId, updateElement } = useDesign()

  // Check if we have a selection
  const hasSelection = !!selectedElementId
  const selectedElement = elements.find((el) => el.id === selectedElementId)

  // Alignment functions
  const alignLeft = () => {
    if (!selectedElement) return
    updateElement(selectedElementId, { x: 100 })
  }

  const alignCenter = () => {
    if (!selectedElement) return
    updateElement(selectedElementId, { x: 400 - selectedElement.width / 2 })
  }

  const alignRight = () => {
    if (!selectedElement) return
    updateElement(selectedElementId, { x: 700 - selectedElement.width })
  }

  const alignTop = () => {
    if (!selectedElement) return
    updateElement(selectedElementId, { y: 100 })
  }

  const alignMiddle = () => {
    if (!selectedElement) return
    updateElement(selectedElementId, { y: 300 - selectedElement.height / 2 })
  }

  const alignBottom = () => {
    if (!selectedElement) return
    updateElement(selectedElementId, { y: 500 - selectedElement.height })
  }

  // Distribution functions (would need multiple selected elements to be useful)
  const distributeHorizontally = () => {
    // This would distribute multiple selected elements horizontally
    alert("This feature would distribute multiple selected elements horizontally")
  }

  const distributeVertically = () => {
    // This would distribute multiple selected elements vertically
    alert("This feature would distribute multiple selected elements vertically")
  }

  return (
    <div className="absolute top-16 left-4 bg-[#252525] rounded-lg shadow-lg p-2">
      <div className="flex space-x-1">
        <button
          className="w-8 h-8 flex items-center justify-center bg-[#333] rounded hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={alignLeft}
          disabled={!hasSelection}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center bg-[#333] rounded hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={alignCenter}
          disabled={!hasSelection}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center bg-[#333] rounded hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={alignRight}
          disabled={!hasSelection}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <div className="border-l border-[#444] mx-1 h-6 self-center"></div>
        <button
          className="w-8 h-8 flex items-center justify-center bg-[#333] rounded hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={alignTop}
          disabled={!hasSelection}
          title="Align Top"
        >
          <AlignLeft size={16} className="transform rotate-90" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center bg-[#333] rounded hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={alignMiddle}
          disabled={!hasSelection}
          title="Align Middle"
        >
          <AlignCenter size={16} className="transform rotate-90" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center bg-[#333] rounded hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={alignBottom}
          disabled={!hasSelection}
          title="Align Bottom"
        >
          <AlignRight size={16} className="transform rotate-90" />
        </button>
        <div className="border-l border-[#444] mx-1 h-6 self-center"></div>
        <button
          className="w-8 h-8 flex items-center justify-center bg-[#333] rounded hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={distributeHorizontally}
          disabled={true} // Would need multiple selection
          title="Distribute Horizontally"
        >
          <AlignHorizontalSpaceAround size={16} />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center bg-[#333] rounded hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={distributeVertically}
          disabled={true} // Would need multiple selection
          title="Distribute Vertically"
        >
          <AlignVerticalSpaceAround size={16} className="transform rotate-90" />
        </button>
      </div>
    </div>
  )
}
