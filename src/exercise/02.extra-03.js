// useCallback: custom hooks
// Exercise 2 Extra Credit 3

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

// 3. 💯 make safeDispatch with useCallback, useRef, and useEffect
// This one’s a bit tricky, and I’m going to be intentionally vague here
// to give you a bit of a challenge, but consider the scenario where we fetch a pokemon,
// and before the request finishes, we change our mind and navigate to a different page.
// In that case, the component would get removed from the page ("unmounted")
// and when the request finally does complete, it will call dispatch,
// but because the component has been removed from the page, we’ll get this warning from React:

// Warning: Can't perform a React state update on an unmounted component.
// This is a no-op, but it indicates a memory leak in your application.
// To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
// The best solution to this problem would be to cancel the request,
// but even then, we’d have to handle the error and prevent the dispatch
// from being called for the rejected promise.

// So see whether you can work out a solution for preventing dispatch
// from being called if the component is unmounted. Depending on how you implement this,
// you might need useRef, useCallback, and useEffect.

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

const useSafeDispatch = dispatch => {
  const ref = React.useRef(false)

  React.useEffect(() => {
    // component is mounted, update ref to true
    ref.current = true
    return () => {
      // component is unmounted, update ref to false
      ref.current = false
    }
  }, [ref])

  return React.useCallback(
    (...args) => {
      if (ref.current) {
        dispatch(...args)
      } else {
        return
      }
    },
    [dispatch],
  )
}

const useAsync = initialState => {
  const [state, dispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const safeDispatch = useSafeDispatch(dispatch)

  const {status, data, error} = state

  const run = React.useCallback(
    promise => {
      safeDispatch({type: 'pending'})
      promise.then(
        data => {
          safeDispatch({type: 'resolved', data})
        },
        error => {
          safeDispatch({type: 'rejected', error})
        },
      )
    },
    [safeDispatch],
  )

  return {data, status, error, run}
}

function PokemonInfo({pokemonName}) {
  const {data: pokemon, status, error, run} = useAsync({
    status: pokemonName ? 'pending' : 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    run(fetchPokemon(pokemonName))
  }, [pokemonName, run])

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
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
