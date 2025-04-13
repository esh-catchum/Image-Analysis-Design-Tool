"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Code, Maximize2, Plus, Square, Trash2 } from "lucide-react"
import { useDesign, type ElementType } from "@/context/design-context"

export default function DesignCanvas() {
  const { elements, selectedElementId, selectElement, updateElement, addElement, deleteElement } = useDesign()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizing, setResizing] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const [showGuides, setShowGuides] = useState(true)
  const gridSize = 20 // Grid size in pixels

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (selectedElementId !== elementId) {
      selectElement(elementId)
    }

    setIsDragging(true)
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    })

    e.stopPropagation()
  }

  const handleResizeStart = (e: React.MouseEvent, elementId: string, handle: string) => {
    selectElement(elementId)
    setResizing(handle)
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    })
    e.stopPropagation()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && !resizing) return

    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y

    if (isDragging && selectedElementId) {
      const selectedElement = elements.find((el) => el.id === selectedElementId)
      if (selectedElement) {
        let newX = selectedElement.x + dx
        let newY = selectedElement.y + dy

        // Snap to grid if enabled
        if (snapToGrid) {
          newX = Math.round(newX / gridSize) * gridSize
          newY = Math.round(newY / gridSize) * gridSize
        }

        updateElement(selectedElementId, {
          x: newX,
          y: newY,
        })
      }

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      })
    }

    if (resizing && selectedElementId) {
      const selectedElement = elements.find((el) => el.id === selectedElementId)
      if (!selectedElement) return

      let newWidth = selectedElement.width
      let newHeight = selectedElement.height
      let newX = selectedElement.x
      let newY = selectedElement.y

      // Handle different resize handles
      switch (resizing) {
        case "top-left":
          newWidth = selectedElement.width - dx
          newHeight = selectedElement.height - dy
          newX = selectedElement.x + dx
          newY = selectedElement.y + dy
          break
        case "top":
          newHeight = selectedElement.height - dy
          newY = selectedElement.y + dy
          break
        case "top-right":
          newWidth = selectedElement.width + dx
          newHeight = selectedElement.height - dy
          newY = selectedElement.y + dy
          break
        case "right":
          newWidth = selectedElement.width + dx
          break
        case "bottom-right":
          newWidth = selectedElement.width + dx
          newHeight = selectedElement.height + dy
          break
        case "bottom":
          newHeight = selectedElement.height + dy
          break
        case "bottom-left":
          newWidth = selectedElement.width - dx
          newHeight = selectedElement.height + dy
          newX = selectedElement.x + dx
          break
        case "left":
          newWidth = selectedElement.width - dx
          newX = selectedElement.x + dx
          break
      }

      // Snap to grid if enabled
      if (snapToGrid) {
        newWidth = Math.round(newWidth / gridSize) * gridSize
        newHeight = Math.round(newHeight / gridSize) * gridSize
        newX = Math.round(newX / gridSize) * gridSize
        newY = Math.round(newY / gridSize) * gridSize
      }

      // Ensure minimum size
      if (newWidth >= 20 && newHeight >= 20) {
        updateElement(selectedElementId, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        })
      }

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    // Only reset these states, but don't deselect the element
    setIsDragging(false)
    setResizing(null)

    // Prevent the click event from firing on the canvas
    if (isDragging || resizing) {
      e.stopPropagation()
    }
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if the click is directly on the canvas
    // and not on an element or after dragging/resizing
    if (e.target === e.currentTarget) {
      selectElement(null)
    }
  }

  const addNewElement = (type: ElementType) => {
    const baseProps = {
      type,
      x: 400,
      y: 300,
      width: 200,
      height: 150,
      fill: "#" + Math.floor(Math.random() * 16777215).toString(16),
      opacity: 100,
      rotation: 0,
      scale: 1,
    }

    if (type === "circle") {
      // Make circles more circular by default
      addElement({
        ...baseProps,
        width: 150,
        height: 150,
      })
    } else if (type === "text") {
      addElement({
        ...baseProps,
        text: "Double-click to edit",
        fontSize: 24,
        fontFamily: "Arial",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        textAlign: "center",
        lineHeight: 1.2,
        letterSpacing: 0,
        fill: "#000000",
        width: 250,
        height: 50,
      })
    } else {
      addElement(baseProps)
    }
  }

  const deleteSelectedElement = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId)
    }
  }

  const toggleGrid = () => {
    setShowGrid(!showGrid)
  }

  const toggleSnapToGrid = () => {
    setSnapToGrid(!snapToGrid)
  }

  const toggleGuides = () => {
    setShowGuides(!showGuides)
  }

  // Calculate guides for smart alignment
  const getGuides = () => {
    if (!showGuides || !selectedElementId) return null

    const selectedElement = elements.find((el) => el.id === selectedElementId)
    if (!selectedElement) return null

    const guides = []
    const centerX = 400 // Canvas center X
    const centerY = 300 // Canvas center Y

    // Center guides
    if (Math.abs(selectedElement.x + selectedElement.width / 2 - centerX) < 5) {
      guides.push(
        <div
          key="center-x"
          className="absolute bg-blue-500"
          style={{
            left: centerX,
            top: 0,
            width: 1,
            height: "100%",
            zIndex: 1000,
          }}
        />,
      )
    }

    if (Math.abs(selectedElement.y + selectedElement.height / 2 - centerY) < 5) {
      guides.push(
        <div
          key="center-y"
          className="absolute bg-blue-500"
          style={{
            left: 0,
            top: centerY,
            width: "100%",
            height: 1,
            zIndex: 1000,
          }}
        />,
      )
    }

    // Alignment with other elements
    elements.forEach((element) => {
      if (element.id === selectedElementId) return

      // Left edge alignment
      if (Math.abs(selectedElement.x - element.x) < 5) {
        guides.push(
          <div
            key={`left-${element.id}`}
            className="absolute bg-green-500"
            style={{
              left: element.x,
              top: 0,
              width: 1,
              height: "100%",
              zIndex: 1000,
            }}
          />,
        )
      }

      // Right edge alignment
      if (Math.abs(selectedElement.x + selectedElement.width - (element.x + element.width)) < 5) {
        guides.push(
          <div
            key={`right-${element.id}`}
            className="absolute bg-green-500"
            style={{
              left: element.x + element.width,
              top: 0,
              width: 1,
              height: "100%",
              zIndex: 1000,
            }}
          />,
        )
      }

      // Top edge alignment
      if (Math.abs(selectedElement.y - element.y) < 5) {
        guides.push(
          <div
            key={`top-${element.id}`}
            className="absolute bg-green-500"
            style={{
              left: 0,
              top: element.y,
              width: "100%",
              height: 1,
              zIndex: 1000,
            }}
          />,
        )
      }

      // Bottom edge alignment
      if (Math.abs(selectedElement.y + selectedElement.height - (element.y + element.height)) < 5) {
        guides.push(
          <div
            key={`bottom-${element.id}`}
            className="absolute bg-green-500"
            style={{
              left: 0,
              top: element.y + element.height,
              width: "100%",
              height: 1,
              zIndex: 1000,
            }}
          />,
        )
      }
    })

    return guides
  }

  // Render element based on its type
  const renderElement = (element: any) => {
    const isSelected = selectedElementId === element.id

    // Common style properties
    const style: React.CSSProperties = {
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      backgroundColor: element.type !== "text" ? element.fill : "transparent",
      opacity: element.opacity / 100,
      transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
      transformOrigin: "center",
      zIndex: element.zIndex,
      cursor: "move",
    }

    // Common event handlers
    const onMouseDown = (e: React.MouseEvent) => {
      handleMouseDown(e, element.id)
      e.stopPropagation()
    }

    // Common className
    const className = `absolute ${isSelected ? "ring-2 ring-blue-500" : ""}`

    switch (element.type) {
      case "rectangle":
        return <div key={element.id} className={className} style={style} onMouseDown={onMouseDown} />

      case "circle":
        return (
          <div
            key={element.id}
            className={className}
            style={{
              ...style,
              borderRadius: "50%",
            }}
            onMouseDown={onMouseDown}
          />
        )

      case "text":
        return (
          <div
            key={element.id}
            className={className}
            style={{
              ...style,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: element.fill,
              fontSize: `${element.fontSize}px`,
              fontFamily: element.fontFamily,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
              textAlign: element.textAlign,
              lineHeight: element.lineHeight,
              letterSpacing: `${element.letterSpacing}px`,
              padding: "8px",
              userSelect: "none",
            }}
            onMouseDown={onMouseDown}
            onDoubleClick={(e) => {
              const newText = prompt("Edit text:", element.text)
              if (newText !== null) {
                updateElement(element.id, { text: newText })
              }
              e.stopPropagation()
            }}
          >
            {element.text}
          </div>
        )

      default:
        return <div key={element.id} className={className} style={style} onMouseDown={onMouseDown} />
    }
  }

  return (
    <div
      className="flex-1 relative bg-[#1E1E1E] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[800px] h-[600px] relative design-canvas"
          ref={canvasRef}
          style={{
            backgroundImage: showGrid
              ? `
              linear-gradient(to right, rgba(50, 50, 50, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(50, 50, 50, 0.1) 1px, transparent 1px)
            `
              : "none",
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        >
          {/* Sort elements by z-index for proper rendering */}
          {[...elements].sort((a, b) => a.zIndex - b.zIndex).map(renderElement)}

          {/* Render resize handles for selected element */}
          {selectedElementId && (
            <ResizeHandles
              element={elements.find((el) => el.id === selectedElementId)}
              handleResizeStart={handleResizeStart}
            />
          )}

          {/* Render alignment guides */}
          {getGuides()}
        </div>
      </div>

      {/* Element type toolbar */}
      <div className="absolute top-4 left-4 flex space-x-2">
        <button
          className="px-3 py-1 text-sm bg-[#333] rounded hover:bg-[#444]"
          onClick={() => addNewElement("rectangle")}
        >
          Rectangle
        </button>
        <button className="px-3 py-1 text-sm bg-[#333] rounded hover:bg-[#444]" onClick={() => addNewElement("circle")}>
          Circle
        </button>
        <button className="px-3 py-1 text-sm bg-[#333] rounded hover:bg-[#444]" onClick={() => addNewElement("text")}>
          Text
        </button>
      </div>

      {/* Grid controls */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          className={`px-3 py-1 text-sm ${showGrid ? "bg-blue-600" : "bg-[#333]"} rounded hover:bg-[#444]`}
          onClick={toggleGrid}
          title="Toggle grid"
        >
          Grid
        </button>
        <button
          className={`px-3 py-1 text-sm ${snapToGrid ? "bg-blue-600" : "bg-[#333]"} rounded hover:bg-[#444]`}
          onClick={toggleSnapToGrid}
          title="Toggle snap to grid"
        >
          Snap
        </button>
        <button
          className={`px-3 py-1 text-sm ${showGuides ? "bg-blue-600" : "bg-[#333]"} rounded hover:bg-[#444]`}
          onClick={toggleGuides}
          title="Toggle smart guides"
        >
          Guides
        </button>
      </div>

      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          className="w-8 h-8 flex items-center justify-center bg-[#333] rounded hover:bg-[#444]"
          onClick={deleteSelectedElement}
          title="Delete selected element"
        >
          <Trash2 size={16} />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center bg-[#333] rounded hover:bg-[#444]"
          onClick={() => addNewElement("rectangle")}
          title="Add element"
        >
          <Plus size={16} />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center bg-[#333] rounded hover:bg-[#444]"
          title="View code"
        >
          <Code size={16} />
        </button>
        <button
          className={`w-8 h-8 flex items-center justify-center ${showGrid ? "bg-blue-600" : "bg-[#333]"} rounded hover:bg-[#444]`}
          onClick={toggleGrid}
          title="Toggle grid"
        >
          <Square size={16} />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center bg-[#333] rounded hover:bg-[#444]"
          title="Fullscreen"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  )
}

// Separate component for resize handles to keep the main component cleaner
function ResizeHandles({ element, handleResizeStart }: { element: any; handleResizeStart: any }) {
  if (!element) return null

  return (
    <>
      <div
        className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white cursor-nwse-resize"
        style={{ left: element.x - 1, top: element.y - 1 }}
        onMouseDown={(e) => handleResizeStart(e, element.id, "top-left")}
      ></div>
      <div
        className="absolute -top-1 w-2 h-2 bg-blue-500 border border-white cursor-ns-resize"
        style={{ left: element.x + element.width / 2 - 1, top: element.y - 1 }}
        onMouseDown={(e) => handleResizeStart(e, element.id, "top")}
      ></div>
      <div
        className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white cursor-nesw-resize"
        style={{ left: element.x + element.width - 1, top: element.y - 1 }}
        onMouseDown={(e) => handleResizeStart(e, element.id, "top-right")}
      ></div>
      <div
        className="absolute -left-1 w-2 h-2 bg-blue-500 border border-white cursor-ew-resize"
        style={{ left: element.x - 1, top: element.y + element.height / 2 - 1 }}
        onMouseDown={(e) => handleResizeStart(e, element.id, "left")}
      ></div>
      <div
        className="absolute -right-1 w-2 h-2 bg-blue-500 border border-white cursor-ew-resize"
        style={{ left: element.x + element.width - 1, top: element.y + element.height / 2 - 1 }}
        onMouseDown={(e) => handleResizeStart(e, element.id, "right")}
      ></div>
      <div
        className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white cursor-nesw-resize"
        style={{ left: element.x - 1, top: element.y + element.height - 1 }}
        onMouseDown={(e) => handleResizeStart(e, element.id, "bottom-left")}
      ></div>
      <div
        className="absolute -bottom-1 w-2 h-2 bg-blue-500 border border-white cursor-ns-resize"
        style={{ left: element.x + element.width / 2 - 1, top: element.y + element.height - 1 }}
        onMouseDown={(e) => handleResizeStart(e, element.id, "bottom")}
      ></div>
      <div
        className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white cursor-nwse-resize"
        style={{ left: element.x + element.width - 1, top: element.y + element.height - 1 }}
        onMouseDown={(e) => handleResizeStart(e, element.id, "bottom-right")}
      ></div>
    </>
  )
}
