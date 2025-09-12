import { ReactWithChild } from '@/interface/app'
import { getSessionAuth } from '@/utils/storage'
import { createContext, useState } from 'react'
import { TasksProvider } from '@/contexts/tasks.context'

export interface AppContextType {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const initAppContext: AppContextType = {
  isAuthenticated: getSessionAuth(),
  setIsAuthenticated: () => null
}

export const AppContext = createContext<AppContextType>(initAppContext)

const AppContextProvider = ({ children }: ReactWithChild) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initAppContext.isAuthenticated)

  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <TasksProvider>
        {children}
      </TasksProvider>
    </AppContext.Provider>
  )
}

export default AppContextProvider
