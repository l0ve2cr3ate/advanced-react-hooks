// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

// Exercise 1
// We’re putting everything in one file to keep things simple,
// but I’ve labeled things a bit so you know that typically your context provider
// will be placed in a different file and expose the provider component itself
// as well as the custom hook to access the context value.

// We’re going to take the Count component that we had before and separate the button
// from the count display. We need to access both the count state as well as the
// setCount updater in these different components which live in different parts of the tree.
// Normally lifting state up would be the way to solve this trivial problem,
// but this is a contrived example so you can focus on learning how to use context.

// Your job is to fill in the CountProvider function component so that the app works
// and the tests pass.

const CountContext = React.createContext()
const CountProvider = ({children}) => {
  const [count, setCount] = React.useState(0)
  return <CountContext.Provider value={[count, setCount]}>{children}</CountContext.Provider>
}

function CountDisplay() {
  const [count] = React.useContext(CountContext)
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
 const [, setCount] = React.useContext(CountContext)
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  return (
    <div>
         <CountProvider>
          <CountDisplay />
          <Counter />
      </CountProvider>
    </div>
  )
}

export default App

