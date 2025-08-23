import React from "react";

export default function NewProjectForm() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Enter project description"
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Project
          </button>
        </form>
      </div>
    );
  }