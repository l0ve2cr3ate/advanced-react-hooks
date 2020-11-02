// useCallback: custom hooks
// Exercise 2 Extra Credit 1

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 1. 💯 use useCallback to empower the user to customize memoization
// Unfortunately, the ESLint plugin is unable to determine whether
// the dependencies argument is a valid argument for useEffect which is a shame,
// and normally I’d say just ignore it and move on.
// But, there’s another solution to this problem which I think is probably better.

// Instead, of accepting dependencies to useAsync,
// why don’t we just treat the asyncCallback as a dependency?
// Any time asyncCallback changes, we know that we should call it again.
// The problem is that because our asyncCallback depends on the pokemonName
// which comes from props, it has to be defined within the body of the component,
// which means that it will be defined on every render which means it will be new every render. This is where React.useCallback comes in!

// Here’s a quick intro to the React.useCallback API:

// function ConsoleGreeting(props) {
//   const greet = React.useCallback(
//     greeting => console.log(`${greeting} ${props.name}`),
//     [props.name],
//   )

//   React.useEffect(() => {
//     const helloGreeting = 'Hello'
//     greet(helloGreeting)
//   }, [greet])
//   return <div>check the console</div>
// }

// The first argument to useCallback is the callback you want called,
// the second argument is an array of dependencies which is similar to useEffect.
// When one of the dependencies changes between renders,
// the callback you passed in the first argument will be the one returned from useCallback.
// If they do not change, then you’ll get the callback which was returned the previous time
// (so the callback remains the same between renders).

// So we only want our asyncCallback to change when the pokemonName changes.
// See if you can make things work like this:

// // 🐨 you'll need to define asyncCallback as a value returned from React.useCallback
// const state = useAsync(asyncCallback, {
//   status: pokemonName ? 'pending' : 'idle',
// })

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const useAsync = (asyncCallback, initialState) => {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  React.useEffect(() => {
    const promise = asyncCallback()
    if (!promise) {
      return
    }
    dispatch({type: 'pending'})
    promise.then(
      data => {
        dispatch({type: 'resolved', data})
      },
      error => {
        dispatch({type: 'rejected', error})
      },
    )
  }, [asyncCallback])

  return state
}

function PokemonInfo({pokemonName}) {
  const asyncCallback = React.useCallback(() => {
    if (!pokemonName) {
      return
    }
    return fetchPokemon(pokemonName)
  }, [pokemonName])

  const state = useAsync(asyncCallback, {
    status: pokemonName ? 'pending' : 'idle',
  })

  const {data, status, error} = state

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={data} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
