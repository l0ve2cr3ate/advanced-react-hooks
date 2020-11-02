// useDebugValue: useMedia
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

// In this exercise, we have a custom useMedia hook which uses window.matchMedia to determine
// whether the user-agent satisfies a given media query. 
// In our Box component, we’re using it three times to determine whether the screen is big, 
// medium, or small and we change the color of the box based on that.

// Now, take a look at the png files associated with this exercise. 
// You’ll notice that the before doesn’t give any useful information for you 
// to know which hook record references which hook. 
// In the after version, you’ll see a really nice label associated 
// with each hook which makes it obvious which is which.

// If you don’t have the browser extension installed, install it now 
// and open the React tab in the DevTools. Select the <Box /> component in the React tree. 
// Your job is to use useDebugValue to provide a nice label.

// Note: your hooks may look a tiny bit different from the screenshots thanks to the fact that we’re using stop-runaway-react-effects. Just focus on the label. That should be the same.

function useMedia(query, initialState = false) {
  const [state, setState] = React.useState(initialState)
  React.useDebugValue(`\`${query}\` => ${state}`)

  React.useEffect(() => {
    let mounted = true
    const mql = window.matchMedia(query)
    function onChange() {
      if (!mounted) {
        return
      }
      setState(Boolean(mql.matches))
    }

    mql.addListener(onChange)
    setState(mql.matches)

    return () => {
      mounted = false
      mql.removeListener(onChange)
    }
  }, [query])

  return state
}

function Box() {
  const isBig = useMedia('(min-width: 1000px)')
  const isMedium = useMedia('(max-width: 999px) and (min-width: 700px)')
  const isSmall = useMedia('(max-width: 699px)')
  const color = isBig ? 'green' : isMedium ? 'yellow' : isSmall ? 'red' : null

  return <div style={{width: 200, height: 200, backgroundColor: color}} />
}

function App() {
  return <Box />
}

export default App

