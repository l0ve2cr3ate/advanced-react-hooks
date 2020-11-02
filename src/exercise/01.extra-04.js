// useReducer: simple Counter
// Extra Credit 4

import * as React from 'react'

// 4. 💯 traditional dispatch object with a type and switch statement
// Ok, now we can finally see what most people do conventionally (mostly thanks to redux). Update your reducer so I can do this:

// const [state, dispatch] = React.useReducer(countReducer, {
//   count: initialCount,
// })
// const {count} = state
// const increment = () => dispatch({type: 'INCREMENT', step})

function Counter({initialCount = 0, step = 1}) {
  const countReducer = (state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return {count: state.count + action.step}
      default:
        throw new Error(
          'Something went wrong, did you provide the right action type',
        )
    }
  }

  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  })

  const {count} = state

  const increment = () => dispatch({type: 'INCREMENT', step})
  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
