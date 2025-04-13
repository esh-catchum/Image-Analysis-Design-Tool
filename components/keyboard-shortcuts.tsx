"use client"

import { useEffect } from "react"
import { useDesign } from "@/context/design-context"

export default function KeyboardShortcuts() {
  const {
    elements,
    selectedElementId,
    selectElement,
    updateElement,
    deleteElement,
    duplicateElement,
    undo,
    redo,
    canUndo,
    canRedo,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  } = useDesign()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Delete - Delete selected element
      if (e.key === "Delete" && selectedElementId) {
        deleteElement(selectedElementId)
      }

      // Ctrl+D - Duplicate selected element
      if (e.key === "d" && (e.ctrlKey || e.metaKey) && selectedElementId) {
        e.preventDefault()
        duplicateElement(selectedElementId)
      }

      // Ctrl+Z - Undo
      if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey && canUndo) {
        e.preventDefault()
        undo()
      }

      // Ctrl+Shift+Z or Ctrl+Y - Redo
      if (
        ((e.key === "z" && (e.ctrlKey || e.metaKey) && e.shiftKey) || (e.key === "y" && (e.ctrlKey || e.metaKey))) &&
        canRedo
      ) {
        e.preventDefault()
        redo()
      }

      // Arrow keys - Move selected element
      if (selectedElementId && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
        const selectedElement = elements.find((el) => el.id === selectedElementId)
        if (!selectedElement) return

        const moveDistance = e.shiftKey ? 10 : 1
        let newX = selectedElement.x
        let newY = selectedElement.y

        switch (e.key) {
          case "ArrowUp":
            newY -= moveDistance
            break
          case "ArrowDown":
            newY += moveDistance
            break
          case "ArrowLeft":
            newX -= moveDistance
            break
          case "ArrowRight":
            newX += moveDistance
            break
        }

        updateElement(selectedElementId, { x: newX, y: newY })
      }

      // Ctrl+] - Bring Forward
      if (e.key === "]" && (e.ctrlKey || e.metaKey) && selectedElementId) {
        e.preventDefault()
        bringForward(selectedElementId)
      }

      // Ctrl+[ - Send Backward
      if (e.key === "[" && (e.ctrlKey || e.metaKey) && selectedElementId) {
        e.preventDefault()
        sendBackward(selectedElementId)
      }

      // Ctrl+Shift+] - Bring to Front
      if (e.key === "]" && (e.ctrlKey || e.metaKey) && e.shiftKey && selectedElementId) {
        e.preventDefault()
        bringToFront(selectedElementId)
      }

      // Ctrl+Shift+[ - Send to Back
      if (e.key === "[" && (e.ctrlKey || e.metaKey) && e.shiftKey && selectedElementId) {
        e.preventDefault()
        sendToBack(selectedElementId)
      }

      // Escape - Deselect
      if (e.key === "Escape") {
        selectElement(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    selectedElementId,
    elements,
    deleteElement,
    duplicateElement,
    updateElement,
    undo,
    redo,
    canUndo,
    canRedo,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    selectElement,
  ])

  return null // This component doesn't render anything
}
