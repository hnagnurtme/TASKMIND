import google from '@/assets/google.png'
import { auth } from '@/configurations/firebase.config'
import { AppContext } from '@/contexts/app.context'
import { useTasks } from '@/contexts/tasks.context'
import { setSessionAuth } from '@/utils/storage'
import {
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth'
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
} from 'firebase/firestore'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function LoginWithGoogle () {
    const { setIsAuthenticated } = useContext( AppContext )
    const { setTasksFromLogin } = useTasks()
    const navigate = useNavigate()
    const db = getFirestore()

    const provider = new GoogleAuthProvider()

    const SIGN_IN_WITH_GOOGLE = async () => {
        try {
            const result = await signInWithPopup( auth, provider )
            const user = result.user

            if ( !user ) {
                toast.error( 'User data is missing in the response' )
                return
            }

            const { uid, email } = user

            const userDocRef = doc( db, 'users', uid )
            const userDoc = await getDoc( userDocRef )

            if ( !userDoc.exists() ) {
                await setDoc( userDocRef, { tasks: [] } )
            }

            const tasks = userDoc.exists() ? userDoc.data().tasks ?? [] : []

            // Cập nhật context và session
            setTasksFromLogin( tasks )
            setSessionAuth( uid, email || '' )
            setIsAuthenticated( true )

            toast.success( 'Login with Google successful!' )
            navigate( '/' )
        } catch ( error: any ) {
            console.error( 'Google login error:', error )
            const errorCode = error.code || 'unknown'
            toast.error( `Login failed: ${ errorCode }` )
        }
    }

    return (
        <div>
            <p className="google-login"></p>
            <div className="google-login-1" onClick={ SIGN_IN_WITH_GOOGLE }>
                <img src={ google } width={ '60%' } alt="Google login button" />
            </div>
        </div>
    )
}

export default LoginWithGoogle
