"use client"

import type React from "react"

import { Plus, Search } from "lucide-react"
import { useState } from "react"

export default function ProjectManager() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="h-screen flex flex-col bg-[#1E1E1E] text-white">
      <header className="h-12 border-b border-[#333] flex items-center px-4">
        <div className="font-medium">Manager</div>
        <div className="ml-auto relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-[#333] rounded-md pl-8 pr-3 py-1 text-sm w-64 focus:outline-none"
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-60 bg-[#252525] border-r border-[#333]">
          <div className="p-2">
            <div className="flex items-center p-2 rounded bg-[#333]">
              <span className="ml-2">Personal Team</span>
            </div>

            <div className="ml-4 mt-1">
              <div className="flex items-center p-2 rounded bg-[#444]">
                <span className="ml-2 text-sm">Personal Team Project</span>
              </div>

              <div className="flex items-center p-2 text-gray-400 hover:text-white cursor-pointer">
                <Plus size={16} />
                <span className="ml-2 text-sm">Add project</span>
              </div>
            </div>

            <div className="flex items-center p-2 text-gray-400 hover:text-white cursor-pointer mt-2">
              <Plus size={16} />
              <span className="ml-2 text-sm">Add team</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="flex mb-4">
            <button className="px-3 py-1 text-sm bg-[#333] rounded mr-4">Boards</button>
            <button className="px-3 py-1 text-sm">Assets</button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="border border-dashed border-gray-600 rounded aspect-square flex items-center justify-center cursor-pointer hover:border-gray-400">
              <Plus size={24} className="text-gray-600 hover:text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
