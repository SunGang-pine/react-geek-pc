import { Navigate } from 'react-router-dom'
import { getToken } from '@/utils'


function AutoRoute ({ children }) {
  if (getToken()) {
    return <>{children}</>
  } else {
    return <Navigate to="/login" replace></Navigate>
  }
}

export { AutoRoute }