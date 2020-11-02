// useReducer: simple Counter
// Extra Credit 2

import * as React from 'react'

// 2. 💯 simulate setState with an object
// Remember this.setState from class components? If not, lucky you 😉. Either way, let’s see if you can figure out how to make the state updater (dispatch function) behave in a similar way by changing our state to an object ({count: 0}) and then calling the state updater with an object which merges with the current state.

// So here’s how I want things to look now:

// const [state, setState] = React.useReducer(countReducer, {
//   count: initialCount,
// })
// const {count} = state
// const increment = () => setState({count: count + step})
// How would you need to change the reducer to make this work?

function Counter({initialCount = 0, step = 1}) {
  const countReducer = (state, action) => ({...state, ...action})

  const [state, setState] = React.useReducer(countReducer, {
    count: initialCount,
  })

  const {count} = state

  const increment = () => setState({count: count + step})
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
