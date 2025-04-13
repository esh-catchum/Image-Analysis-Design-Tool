"use client"

import { createContext, useContext, useState, useRef, type ReactNode } from "react"

export type ElementType = "rectangle" | "circle" | "text"

export interface Element {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  fill: string
  opacity: number
  rotation: number
  scale: number
  text?: string
  fontSize?: number
  fontFamily?: string
  zIndex: number
}

interface HistoryState {
  elements: Element[]
  selectedElementId: string | null
}

interface DesignContextType {
  elements: Element[]
  selectedElementId: string | null
  selectElement: (id: string | null) => void
  updateElement: (id: string, properties: Partial<Element>) => void
  addElement: (element: Omit<Element, "id" | "zIndex">) => void
  deleteElement: (id: string) => void
  duplicateElement: (id: string) => void
  bringForward: (id: string) => void
  sendBackward: (id: string) => void
  bringToFront: (id: string) => void
  sendToBack: (id: string) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  loadProject: (elements: Element[]) => void
}

const DesignContext = createContext<DesignContextType | undefined>(undefined)

export function DesignProvider({ children }: { children: ReactNode }) {
  const [elements, setElements] = useState<Element[]>([
    {
      id: "rect1",
      type: "rectangle",
      x: 400,
      y: 180,
      width: 300,
      height: 180,
      fill: "#FFFFFF",
      opacity: 100,
      rotation: 0,
      scale: 1,
      zIndex: 1,
    },
    {
      id: "rect2",
      type: "rectangle",
      x: 400,
      y: 360,
      width: 300,
      height: 160,
      fill: "#BABABA",
      opacity: 100,
      rotation: 0,
      scale: 1,
      zIndex: 2,
    },
  ])

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

  // History for undo/redo
  const historyRef = useRef<HistoryState[]>([])
  const currentIndexRef = useRef<number>(-1)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  // Add current state to history
  const addToHistory = () => {
    const newHistory = historyRef.current.slice(0, currentIndexRef.current + 1)
    newHistory.push({
      elements: JSON.parse(JSON.stringify(elements)),
      selectedElementId,
    })

    // Limit history size to prevent memory issues
    if (newHistory.length > 30) {
      newHistory.shift()
    }

    historyRef.current = newHistory
    currentIndexRef.current = newHistory.length - 1

    setCanUndo(currentIndexRef.current > 0)
    setCanRedo(false)
  }

  const selectElement = (id: string | null) => {
    setSelectedElementId(id)
  }

  const updateElement = (id: string, properties: Partial<Element>) => {
    addToHistory()
    setElements((prevElements) =>
      prevElements.map((element) => (element.id === id ? { ...element, ...properties } : element)),
    )
  }

  const addElement = (element: Omit<Element, "id" | "zIndex">) => {
    addToHistory()
    const maxZIndex = Math.max(...elements.map((el) => el.zIndex), 0)
    const newElement = {
      ...element,
      id: `element-${Date.now()}`,
      zIndex: maxZIndex + 1,
    }
    setElements((prevElements) => [...prevElements, newElement])
    setSelectedElementId(newElement.id)
  }

  const deleteElement = (id: string) => {
    addToHistory()
    setElements((prevElements) => prevElements.filter((element) => element.id !== id))
    if (selectedElementId === id) {
      setSelectedElementId(null)
    }
  }

  const duplicateElement = (id: string) => {
    addToHistory()
    const elementToDuplicate = elements.find((el) => el.id === id)
    if (elementToDuplicate) {
      const newElement = {
        ...elementToDuplicate,
        id: `element-${Date.now()}`,
        x: elementToDuplicate.x + 20,
        y: elementToDuplicate.y + 20,
        zIndex: Math.max(...elements.map((el) => el.zIndex), 0) + 1,
      }
      setElements((prev) => [...prev, newElement])
      setSelectedElementId(newElement.id)
    }
  }

  // Layer ordering functions
  const bringForward = (id: string) => {
    addToHistory()
    const element = elements.find((el) => el.id === id)
    if (!element) return

    const higherElements = elements.filter((el) => el.zIndex > element.zIndex)
    if (higherElements.length === 0) return

    const nextZIndex = Math.min(...higherElements.map((el) => el.zIndex))
    const nextElement = elements.find((el) => el.zIndex === nextZIndex)

    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) return { ...el, zIndex: nextZIndex }
        if (el.id === nextElement?.id) return { ...el, zIndex: element.zIndex }
        return el
      }),
    )
  }

  const sendBackward = (id: string) => {
    addToHistory()
    const element = elements.find((el) => el.id === id)
    if (!element) return

    const lowerElements = elements.filter((el) => el.zIndex < element.zIndex)
    if (lowerElements.length === 0) return

    const prevZIndex = Math.max(...lowerElements.map((el) => el.zIndex))
    const prevElement = elements.find((el) => el.zIndex === prevZIndex)

    setElements((prev) =>
      prev.map((el) => {
        if (el.id === id) return { ...el, zIndex: prevZIndex }
        if (el.id === prevElement?.id) return { ...el, zIndex: element.zIndex }
        return el
      }),
    )
  }

  const bringToFront = (id: string) => {
    addToHistory()
    const maxZIndex = Math.max(...elements.map((el) => el.zIndex), 0)
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, zIndex: maxZIndex + 1 } : el)))
  }

  const sendToBack = (id: string) => {
    addToHistory()
    const minZIndex = Math.min(...elements.map((el) => el.zIndex), 0)
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, zIndex: minZIndex - 1 } : el)))
  }

  // Undo/Redo functions
  const undo = () => {
    if (currentIndexRef.current <= 0) return

    currentIndexRef.current -= 1
    const prevState = historyRef.current[currentIndexRef.current]
    setElements(prevState.elements)
    setSelectedElementId(prevState.selectedElementId)

    setCanUndo(currentIndexRef.current > 0)
    setCanRedo(currentIndexRef.current < historyRef.current.length - 1)
  }

  const redo = () => {
    if (currentIndexRef.current >= historyRef.current.length - 1) return

    currentIndexRef.current += 1
    const nextState = historyRef.current[currentIndexRef.current]
    setElements(nextState.elements)
    setSelectedElementId(nextState.selectedElementId)

    setCanUndo(currentIndexRef.current > 0)
    setCanRedo(currentIndexRef.current < historyRef.current.length - 1)
  }

  // Load project function
  const loadProject = (newElements: Element[]) => {
    addToHistory()
    setElements(newElements)
    setSelectedElementId(null)
  }

  return (
    <DesignContext.Provider
      value={{
        elements,
        selectedElementId,
        selectElement,
        updateElement,
        addElement,
        deleteElement,
        duplicateElement,
        bringForward,
        sendBackward,
        bringToFront,
        sendToBack,
        undo,
        redo,
        canUndo,
        canRedo,
        loadProject,
      }}
    >
      {children}
    </DesignContext.Provider>
  )
}

export function useDesign() {
  const context = useContext(DesignContext)
  if (context === undefined) {
    throw new Error("useDesign must be used within a DesignProvider")
  }
  return context
}
