export default App

import React from 'react'
import DevOpsCapabilities from './components/DevOpsCapabilities'

function App() {
  return (
    <div className="min-h-screen bg-gray-100" id='capability-map-container'>
      <DevOpsCapabilities />
    </div>
  )
}
