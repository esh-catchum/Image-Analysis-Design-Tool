"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDesign } from "@/context/design-context"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Type } from "lucide-react"

export default function TextEditor() {
  const { elements, selectedElementId, updateElement } = useDesign()
  const [isOpen, setIsOpen] = useState(false)
  const [textProps, setTextProps] = useState({
    text: "",
    fontSize: 24,
    fontFamily: "Arial",
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "center",
    lineHeight: 1.2,
    letterSpacing: 0,
  })

  // Check if selected element is a text element
  const selectedElement = elements.find((el) => el.id === selectedElementId)
  const isTextElement = selectedElement?.type === "text"

  // Update local state when selected element changes
  useEffect(() => {
    if (isTextElement && selectedElement) {
      setIsOpen(true)
      setTextProps({
        text: selectedElement.text || "",
        fontSize: selectedElement.fontSize || 24,
        fontFamily: selectedElement.fontFamily || "Arial",
        fontWeight: selectedElement.fontWeight || "normal",
        fontStyle: selectedElement.fontStyle || "normal",
        textDecoration: selectedElement.textDecoration || "none",
        textAlign: selectedElement.textAlign || "center",
        lineHeight: selectedElement.lineHeight || 1.2,
        letterSpacing: selectedElement.letterSpacing || 0,
      })
    } else {
      setIsOpen(false)
    }
  }, [selectedElementId, elements, isTextElement, selectedElement])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setTextProps((prev) => ({ ...prev, text: newText }))
    if (selectedElementId) {
      updateElement(selectedElementId, { text: newText })
    }
  }

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(e.target.value)
    setTextProps((prev) => ({ ...prev, fontSize: newSize }))
    if (selectedElementId) {
      updateElement(selectedElementId, { fontSize: newSize })
    }
  }

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFamily = e.target.value
    setTextProps((prev) => ({ ...prev, fontFamily: newFamily }))
    if (selectedElementId) {
      updateElement(selectedElementId, { fontFamily: newFamily })
    }
  }

  const toggleBold = () => {
    const newWeight = textProps.fontWeight === "bold" ? "normal" : "bold"
    setTextProps((prev) => ({ ...prev, fontWeight: newWeight }))
    if (selectedElementId) {
      updateElement(selectedElementId, { fontWeight: newWeight })
    }
  }

  const toggleItalic = () => {
    const newStyle = textProps.fontStyle === "italic" ? "normal" : "italic"
    setTextProps((prev) => ({ ...prev, fontStyle: newStyle }))
    if (selectedElementId) {
      updateElement(selectedElementId, { fontStyle: newStyle })
    }
  }

  const toggleUnderline = () => {
    const newDecoration = textProps.textDecoration === "underline" ? "none" : "underline"
    setTextProps((prev) => ({ ...prev, textDecoration: newDecoration }))
    if (selectedElementId) {
      updateElement(selectedElementId, { textDecoration: newDecoration })
    }
  }

  const setTextAlign = (align: "left" | "center" | "right" | "justify") => {
    setTextProps((prev) => ({ ...prev, textAlign: align }))
    if (selectedElementId) {
      updateElement(selectedElementId, { textAlign: align })
    }
  }

  const handleLineHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLineHeight = Number(e.target.value)
    setTextProps((prev) => ({ ...prev, lineHeight: newLineHeight }))
    if (selectedElementId) {
      updateElement(selectedElementId, { lineHeight: newLineHeight })
    }
  }

  const handleLetterSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLetterSpacing = Number(e.target.value)
    setTextProps((prev) => ({ ...prev, letterSpacing: newLetterSpacing }))
    if (selectedElementId) {
      updateElement(selectedElementId, { letterSpacing: newLetterSpacing })
    }
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-[#252525] rounded-lg shadow-lg p-3 w-[500px] z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Type size={16} className="mr-2" />
          <h3 className="text-sm font-medium">Text Editor</h3>
        </div>
        <button className="text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
          ×
        </button>
      </div>

      <div className="mb-3">
        <textarea
          value={textProps.text}
          onChange={handleTextChange}
          className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 min-h-[60px]"
          placeholder="Enter text..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Font Family</label>
          <select
            value={textProps.fontFamily}
            onChange={handleFontFamilyChange}
            className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Impact">Impact</option>
            <option value="Tahoma">Tahoma</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Font Size</label>
          <div className="flex items-center">
            <input
              type="range"
              min="8"
              max="72"
              value={textProps.fontSize}
              onChange={handleFontSizeChange}
              className="flex-1 mr-2"
            />
            <span className="text-xs w-8 text-right">{textProps.fontSize}px</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mb-3">
        <div className="flex bg-[#333] rounded overflow-hidden">
          <button
            className={`px-2 py-1 ${textProps.fontWeight === "bold" ? "bg-[#555]" : ""}`}
            onClick={toggleBold}
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            className={`px-2 py-1 ${textProps.fontStyle === "italic" ? "bg-[#555]" : ""}`}
            onClick={toggleItalic}
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <button
            className={`px-2 py-1 ${textProps.textDecoration === "underline" ? "bg-[#555]" : ""}`}
            onClick={toggleUnderline}
            title="Underline"
          >
            <Underline size={14} />
          </button>
        </div>

        <div className="flex bg-[#333] rounded overflow-hidden">
          <button
            className={`px-2 py-1 ${textProps.textAlign === "left" ? "bg-[#555]" : ""}`}
            onClick={() => setTextAlign("left")}
            title="Align Left"
          >
            <AlignLeft size={14} />
          </button>
          <button
            className={`px-2 py-1 ${textProps.textAlign === "center" ? "bg-[#555]" : ""}`}
            onClick={() => setTextAlign("center")}
            title="Align Center"
          >
            <AlignCenter size={14} />
          </button>
          <button
            className={`px-2 py-1 ${textProps.textAlign === "right" ? "bg-[#555]" : ""}`}
            onClick={() => setTextAlign("right")}
            title="Align Right"
          >
            <AlignRight size={14} />
          </button>
          <button
            className={`px-2 py-1 ${textProps.textAlign === "justify" ? "bg-[#555]" : ""}`}
            onClick={() => setTextAlign("justify")}
            title="Justify"
          >
            <AlignJustify size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Line Height: {textProps.lineHeight}</label>
          <input
            type="range"
            min="0.8"
            max="2"
            step="0.1"
            value={textProps.lineHeight}
            onChange={handleLineHeightChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Letter Spacing: {textProps.letterSpacing}px</label>
          <input
            type="range"
            min="-2"
            max="10"
            step="0.5"
            value={textProps.letterSpacing}
            onChange={handleLetterSpacingChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
