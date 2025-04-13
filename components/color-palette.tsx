"use client"

import { useState } from "react"
import { useDesign } from "@/context/design-context"
import { Palette } from "lucide-react"
import { HexColorPicker } from "react-colorful"

// Predefined color palette
const defaultColors = [
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
  "#008000", // Dark Green
  "#800000", // Maroon
  "#808080", // Gray
  "#C0C0C0", // Silver
  "#F5F5DC", // Beige
  "#A52A2A", // Brown
]

export default function ColorPalette() {
  const { selectedElementId, updateElement } = useDesign()
  const [isOpen, setIsOpen] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [currentColor, setCurrentColor] = useState("#000000")
  const [customColors, setCustomColors] = useState<string[]>([])

  const handleColorSelect = (color: string) => {
    setCurrentColor(color)
    if (selectedElementId) {
      updateElement(selectedElementId, { fill: color })
    }
  }

  const handleColorPickerChange = (color: string) => {
    setCurrentColor(color)
    if (selectedElementId) {
      updateElement(selectedElementId, { fill: color })
    }
  }

  const addCustomColor = () => {
    if (!customColors.includes(currentColor)) {
      setCustomColors([...customColors, currentColor])
    }
    setShowColorPicker(false)
  }

  return (
    <div className="absolute bottom-16 right-4">
      <button
        className="w-8 h-8 flex items-center justify-center bg-[#333] rounded-full hover:bg-[#444]"
        onClick={() => setIsOpen(!isOpen)}
        title="Color Palette"
      >
        <Palette size={16} />
      </button>

      {isOpen && (
        <div className="absolute bottom-10 right-0 bg-[#252525] rounded-lg shadow-lg p-3 w-64">
          <h3 className="text-sm font-medium mb-2">Color Palette</h3>

          <div className="grid grid-cols-8 gap-1 mb-3">
            {defaultColors.map((color) => (
              <div
                key={color}
                className="w-6 h-6 rounded cursor-pointer border border-gray-600 hover:border-white"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              ></div>
            ))}
          </div>

          {customColors.length > 0 && (
            <>
              <h4 className="text-xs text-gray-400 mb-1">Custom Colors</h4>
              <div className="grid grid-cols-8 gap-1 mb-3">
                {customColors.map((color) => (
                  <div
                    key={color}
                    className="w-6 h-6 rounded cursor-pointer border border-gray-600 hover:border-white"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    title={color}
                  ></div>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-between items-center">
            <button
              className="text-xs text-blue-400 hover:text-blue-300"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              {showColorPicker ? "Hide Color Picker" : "Custom Color"}
            </button>
            <div
              className="w-6 h-6 rounded border border-gray-600"
              style={{ backgroundColor: currentColor }}
              title="Current Color"
            ></div>
          </div>

          {showColorPicker && (
            <div className="mt-3">
              <HexColorPicker color={currentColor} onChange={handleColorPickerChange} />
              <div className="flex justify-end mt-2">
                <button className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded" onClick={addCustomColor}>
                  Add to Palette
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
