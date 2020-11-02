// useContext: simple Counter
// Exercise 3 Extra Credit 1
// 1. 💯 create a consumer hook
// Imagine what would happen if someone tried to consume your context value without using
// your context provider. For example, as mentioned above when discussing the default value:

// ReactDOM.render(<FooDisplay />, document.getElementById('root'))
// If you don’t provide a default context value, that would render <div>Foo is: </div>.
// This is because the context value would be undefined.
// In real-world scenarios, having an unexpected undefined value can result in errors
// that can be difficult to debug.

// In this extra credit, you need to create a custom hook that I can use like this:

// const [count, setCount] = useCount()
// And if you change the App to this:

// function App() {
//   return (
//     <div>
//       <CountDisplay />
//       <Counter />
//     </div>
//   )
// }
// It should throw an error indicating that useCount must be used within a CountProvider.

import * as React from 'react'

const useCount = () => {
  const countContext = React.useContext(CountContext)

  if (!countContext) {
    throw new Error('useCount can only be used within a CountProvider')
  }

  return countContext
}

const CountContext = React.createContext()
const CountProvider = ({children}) => {
  const [count, setCount] = React.useState(0)
  return (
    <CountContext.Provider value={[count, setCount]}>
      {children}
    </CountContext.Provider>
  )
}

function CountDisplay() {
  const [count] = useCount()
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  const [, setCount] = useCount()
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
