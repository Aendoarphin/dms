import Home from './components/Home'
import Profile from './components/Profile'
import NotFound from './components/NotFound'
import './App.css'
import { Routes, Route } from 'react-router'
import supabase from './util/supabase'
import Articles from './components/Articles'

function App() {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session)

  if (event === 'INITIAL_SESSION') {
    // handle initial session
    window.alert('Initial session received')
  } else if (event === 'SIGNED_IN') {
    // handle sign in event
  } else if (event === 'SIGNED_OUT') {
    // handle sign out event
  } else if (event === 'PASSWORD_RECOVERY') {
    // handle password recovery event
  } else if (event === 'TOKEN_REFRESHED') {
    // handle token refreshed event
  } else if (event === 'USER_UPDATED') {
    // handle user updated event
  }
})

// call unsubscribe to remove the callback
// data.subscription.unsubscribe()

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
        {
          
        }
      </Routes>
    </>
  )
}

export default App
