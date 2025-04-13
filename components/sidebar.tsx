"use client"

import { ChevronDown, ChevronRight, FolderClosed, Plus } from "lucide-react"
import { useState } from "react"

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="w-60 bg-[#252525] border-r border-[#333] flex flex-col">
      <div className="p-4 border-b border-[#333] flex items-center">
        <div className="font-medium">Manager</div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-2">
          <div
            className="flex items-center p-2 rounded hover:bg-[#333] cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span className="ml-2">Personal Team</span>
          </div>

          {expanded && (
            <div className="ml-4 mt-1">
              <div className="flex items-center p-2 rounded bg-[#333] cursor-pointer">
                <FolderClosed size={16} />
                <span className="ml-2 text-sm">Personal Team Project</span>
              </div>

              <div className="flex items-center p-2 text-gray-400 hover:text-white cursor-pointer">
                <Plus size={16} />
                <span className="ml-2 text-sm">Add project</span>
              </div>
            </div>
          )}

          <div className="flex items-center p-2 text-gray-400 hover:text-white cursor-pointer mt-2">
            <Plus size={16} />
            <span className="ml-2 text-sm">Add team</span>
          </div>
        </div>
      </div>
    </div>
  )
}
