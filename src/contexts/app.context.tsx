import { ReactWithChild } from '@/interface/app'
import { getSessionAuth } from '@/utils/storage'
import { createContext, useState } from 'react'

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
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
