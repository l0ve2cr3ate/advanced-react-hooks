// useReducer: simple Counter
// Extra Credit 3

import * as React from 'react'

// 3. 💯 simulate setState with an object OR function
// this.setState from class components can also accept a function. So let’s add support for that with our simulated setState function. See if you can figure out how to make your reducer support both the object as in the last extra credit as well as a function callback:

// const [state, setState] = React.useReducer(countReducer, {
//   count: initialCount,
// })
// const {count} = state
// const increment = () =>
//   setState(currentState => ({count: currentState.count + step}))

function Counter({initialCount = 0, step = 1}) {
  const countReducer = (state, action) => {
    if (typeof action === 'function') {
      return {...state, ...action(state)}
    } else {
      return {...state, ...action}
    }
  }

  const [state, setState] = React.useReducer(countReducer, {
    count: initialCount,
  })

  const {count} = state

  const increment = () =>
    setState(currentState => ({count: currentState.count + step}))
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
