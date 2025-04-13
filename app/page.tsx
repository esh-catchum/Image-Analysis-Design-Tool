import DesignCanvas from "@/components/design-canvas"
import Sidebar from "@/components/sidebar"
import PropertyPanel from "@/components/property-panel"
import Toolbar from "@/components/toolbar"
import LayersPanel from "@/components/layers-panel"
import AlignmentToolbar from "@/components/alignment-toolbar"
import ColorPalette from "@/components/color-palette"
import TextEditor from "@/components/text-editor"
import KeyboardShortcuts from "@/components/keyboard-shortcuts"
import ExportPanel from "@/components/export-panel"
import { DesignProvider } from "@/context/design-context"

export default function Home() {
  return (
    <DesignProvider>
      <main className="flex h-screen bg-[#1E1E1E] text-white overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Toolbar />
          <div className="flex-1 flex relative">
            <DesignCanvas />
            <PropertyPanel />
            <LayersPanel />
            <AlignmentToolbar />
            <ColorPalette />
            <TextEditor />
            <KeyboardShortcuts />
            <ExportPanel />
          </div>
        </div>
      </main>
    </DesignProvider>
  )
}
