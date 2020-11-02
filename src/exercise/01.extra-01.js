// useReducer: simple Counter
// Extra Credit 1

import * as React from 'react'

// 1. 💯 accept the step as the action
// I want to change things a bit to have this API:

// const [count, changeCount] = React.useReducer(countReducer, initialCount)
// const increment = () => changeCount(step)
// How would you need to change your reducer to make this work?

// This one is just to show that you can pass anything as the action.
function Counter({initialCount = 0, step = 1}) {
  const countReducer = (prevValue, change) => prevValue + change

  const [count, changeCount] = React.useReducer(countReducer, initialCount)

  const increment = () => changeCount(step)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
