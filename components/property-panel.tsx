"use client"

import type React from "react"

import { ChevronDown, Eye, Plus, Copy, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from "lucide-react"
import { useEffect, useState } from "react"
import { useDesign } from "@/context/design-context"
import { HexColorPicker } from "react-colorful"

export default function PropertyPanel() {
  const {
    elements,
    selectedElementId,
    updateElement,
    duplicateElement,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  } = useDesign()

  const [dimensions, setDimensions] = useState({
    width: "0",
    height: "0",
    x: "0",
    y: "0",
  })

  const [transform, setTransform] = useState({
    rotation: "0",
    scale: "1",
  })

  const [appearance, setAppearance] = useState({
    opacity: 100,
  })

  const [fill, setFill] = useState("#BABABA")
  const [showColorPicker, setShowColorPicker] = useState(false)

  const [textProps, setTextProps] = useState({
    text: "",
    fontSize: "24",
    fontFamily: "Arial",
  })

  // Update local state when selected element changes
  useEffect(() => {
    if (selectedElementId) {
      const selectedElement = elements.find((el) => el.id === selectedElementId)
      if (selectedElement) {
        setDimensions({
          width: selectedElement.width.toString(),
          height: selectedElement.height.toString(),
          x: selectedElement.x.toString(),
          y: selectedElement.y.toString(),
        })
        setTransform({
          rotation: selectedElement.rotation.toString(),
          scale: selectedElement.scale.toString(),
        })
        setAppearance({
          opacity: selectedElement.opacity,
        })
        setFill(selectedElement.fill)

        // Set text properties if it's a text element
        if (selectedElement.type === "text") {
          setTextProps({
            text: selectedElement.text || "",
            fontSize: selectedElement.fontSize?.toString() || "24",
            fontFamily: selectedElement.fontFamily || "Arial",
          })
        }
      }
    }
  }, [selectedElementId, elements])

  // Apply changes to the selected element
  const applyChanges = () => {
    if (selectedElementId) {
      const selectedElement = elements.find((el) => el.id === selectedElementId)
      if (!selectedElement) return

      const updates: any = {
        width: Number.parseFloat(dimensions.width) || 0,
        height: Number.parseFloat(dimensions.height) || 0,
        x: Number.parseFloat(dimensions.x) || 0,
        y: Number.parseFloat(dimensions.y) || 0,
        rotation: Number.parseFloat(transform.rotation) || 0,
        scale: Number.parseFloat(transform.scale) || 1,
        opacity: appearance.opacity,
        fill: fill,
      }

      // Add text properties if it's a text element
      if (selectedElement.type === "text") {
        updates.text = textProps.text
        updates.fontSize = Number.parseFloat(textProps.fontSize) || 24
        updates.fontFamily = textProps.fontFamily
      }

      updateElement(selectedElementId, updates)
    }
  }

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setDimensions((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const handleDimensionBlur = () => {
    applyChanges()
  }

  const handleTransformChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setTransform((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const handleTransformBlur = () => {
    applyChanges()
  }

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = Number.parseInt(e.target.value)
    setAppearance((prev) => ({
      ...prev,
      opacity: newOpacity,
    }))

    // Apply opacity change immediately for better UX
    if (selectedElementId) {
      updateElement(selectedElementId, {
        opacity: newOpacity,
      })
    }
  }

  const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFill = e.target.value
    setFill(newFill)
  }

  const handleFillBlur = () => {
    applyChanges()
  }

  const handleColorPickerChange = (color: string) => {
    setFill(color)
    if (selectedElementId) {
      updateElement(selectedElementId, { fill: color })
    }
  }

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: string,
  ) => {
    setTextProps((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const handleTextBlur = () => {
    applyChanges()
  }

  const handleDuplicate = () => {
    if (selectedElementId) {
      duplicateElement(selectedElementId)
    }
  }

  return (
    <div className="w-72 bg-[#252525] border-l border-[#333] overflow-y-auto">
      <div className="p-4 border-b border-[#333] flex items-center justify-between">
        <div className="font-medium">Properties</div>
        <button className="text-gray-400 hover:text-white">
          <ChevronDown size={16} />
        </button>
      </div>

      {selectedElementId ? (
        <div className="p-4">
          {/* Element type and actions */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium">
              {elements
                .find((el) => el.id === selectedElementId)
                ?.type.charAt(0)
                .toUpperCase() + elements.find((el) => el.id === selectedElementId)?.type.slice(1)}
            </div>
            <div className="flex space-x-2">
              <button
                className="w-6 h-6 flex items-center justify-center bg-[#333] rounded hover:bg-[#444]"
                onClick={handleDuplicate}
                title="Duplicate element"
              >
                <Copy size={14} />
              </button>
              <button
                className="w-6 h-6 flex items-center justify-center bg-[#333] rounded hover:bg-[#444]"
                onClick={() => bringForward(selectedElementId)}
                title="Bring forward"
              >
                <ArrowUp size={14} />
              </button>
              <button
                className="w-6 h-6 flex items-center justify-center bg-[#333] rounded hover:bg-[#444]"
                onClick={() => sendBackward(selectedElementId)}
                title="Send backward"
              >
                <ArrowDown size={14} />
              </button>
              <button
                className="w-6 h-6 flex items-center justify-center bg-[#333] rounded hover:bg-[#444]"
                onClick={() => bringToFront(selectedElementId)}
                title="Bring to front"
              >
                <ChevronsUp size={14} />
              </button>
              <button
                className="w-6 h-6 flex items-center justify-center bg-[#333] rounded hover:bg-[#444]"
                onClick={() => sendToBack(selectedElementId)}
                title="Send to back"
              >
                <ChevronsDown size={14} />
              </button>
            </div>
          </div>

          <h3 className="text-sm font-medium mb-2">Layout</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">W</label>
              <input
                type="text"
                value={dimensions.width}
                onChange={(e) => handleDimensionChange(e, "width")}
                onBlur={handleDimensionBlur}
                className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">H</label>
              <input
                type="text"
                value={dimensions.height}
                onChange={(e) => handleDimensionChange(e, "height")}
                onBlur={handleDimensionBlur}
                className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">X</label>
              <input
                type="text"
                value={dimensions.x}
                onChange={(e) => handleDimensionChange(e, "x")}
                onBlur={handleDimensionBlur}
                className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Y</label>
              <input
                type="text"
                value={dimensions.y}
                onChange={(e) => handleDimensionChange(e, "y")}
                onBlur={handleDimensionBlur}
                className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
          </div>

          <h3 className="text-sm font-medium mb-2">Transform</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                <Eye size={12} className="inline mr-1" />
                Rotation
              </label>
              <input
                type="text"
                value={transform.rotation}
                onChange={(e) => handleTransformChange(e, "rotation")}
                onBlur={handleTransformBlur}
                className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Scale</label>
              <input
                type="text"
                value={transform.scale}
                onChange={(e) => handleTransformChange(e, "scale")}
                onBlur={handleTransformBlur}
                className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
            </div>
          </div>

          <h3 className="text-sm font-medium mb-2">Appearance</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-400">Opacity</label>
              <span className="text-xs">{appearance.opacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={appearance.opacity}
              onChange={handleOpacityChange}
              className="w-full"
            />
          </div>

          <h3 className="text-sm font-medium mb-2">Fill</h3>
          <div className="flex items-center mb-2">
            <div
              className="w-6 h-6 rounded mr-2 cursor-pointer border border-gray-600"
              style={{ backgroundColor: fill }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            ></div>
            <input
              type="text"
              value={fill}
              onChange={handleFillChange}
              onBlur={handleFillBlur}
              className="flex-1 bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>

          {showColorPicker && (
            <div className="mb-4">
              <HexColorPicker color={fill} onChange={handleColorPickerChange} />
            </div>
          )}

          {/* Text properties for text elements */}
          {elements.find((el) => el.id === selectedElementId)?.type === "text" && (
            <div className="mt-4 border-t border-[#333] pt-4">
              <h3 className="text-sm font-medium mb-2">Text</h3>
              <div className="mb-2">
                <label className="text-xs text-gray-400 mb-1 block">Content</label>
                <textarea
                  value={textProps.text}
                  onChange={(e) => handleTextChange(e, "text")}
                  onBlur={handleTextBlur}
                  className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 min-h-[60px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Font Size</label>
                  <input
                    type="text"
                    value={textProps.fontSize}
                    onChange={(e) => handleTextChange(e, "fontSize")}
                    onBlur={handleTextBlur}
                    className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Font Family</label>
                  <select
                    value={textProps.fontFamily}
                    onChange={(e) => handleTextChange(e, "fontFamily")}
                    onBlur={handleTextBlur}
                    className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-[#333] pt-4 mt-4">
            <button className="w-full flex items-center justify-center py-1 bg-[#333] rounded hover:bg-[#444]">
              <Plus size={16} className="mr-1" />
              <span className="text-sm">Stroke</span>
            </button>
          </div>

          <div className="border-t border-[#333] pt-4 mt-4">
            <button className="w-full flex items-center justify-center py-1 bg-[#333] rounded hover:bg-[#444]">
              <Plus size={16} className="mr-1" />
              <span className="text-sm">Shadow</span>
            </button>
          </div>

          <div className="border-t border-[#333] pt-4 mt-4">
            <button className="w-full flex items-center justify-center py-1 bg-[#333] rounded hover:bg-[#444]">
              <Plus size={16} className="mr-1" />
              <span className="text-sm">Blur</span>
            </button>
          </div>

          <div className="border-t border-[#333] pt-4 mt-4">
            <button className="w-full flex items-center justify-center py-1 bg-[#333] rounded hover:bg-[#444]">
              <Plus size={16} className="mr-1" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-400">
          <p>No element selected</p>
          <p className="text-sm mt-2">Click on an element to edit its properties</p>
        </div>
      )}
    </div>
  )
}
