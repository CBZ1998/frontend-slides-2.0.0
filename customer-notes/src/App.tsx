import { useEffect } from 'react'
import { seedDefaultFolder, seedDefaultTags } from './db'
import AppLayout from './components/layout/AppLayout'

function App() {
  useEffect(() => {
    seedDefaultFolder()
    seedDefaultTags()
  }, [])

  return <AppLayout />
}

export default App
