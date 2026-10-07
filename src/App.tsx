import { useEffect, useReducer } from 'react';
import './App.css';
import { User } from './types';

type State = {
  searchQuery: string;
  currentUser: User | null;
  error: string | null;
};

type Action =
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
        error: null,
      };

    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        currentUser: null,
      };

    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    searchQuery: '',
    currentUser: null,
    error: null,
  });

  const currentUser = state.currentUser;
  const searchQuery = state.searchQuery;
  const error = state.error;

  useEffect(() => {
    const fetchFunc = async () => {
      if (!searchQuery) {
        dispatch({
          type: 'SET_USER',
          payload: null,
        });

        return;
      }

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?username=${searchQuery}`
        );

        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }

        const resJson = await response.json();

        dispatch({
          type: 'SET_USER',
          payload: resJson[0] ?? null,
        });
      } catch (error) {
        console.error(error);

        dispatch({
          type: 'SET_ERROR',
          payload: 'Не удалось выполнить поиск',
        });
      }
    };

    fetchFunc();
  }, [searchQuery]);

  return (
    <div className="card">
      <input
        type="search"
        value={searchQuery}
        onChange={(event) =>
          dispatch({
            type: 'SET_SEARCH_QUERY',
            payload: event.target.value,
          })
        }
      />

      {error ? (
        <p>{error}</p>
      ) : currentUser ? (
        <div>
          <h3>{currentUser.name}</h3>
          <h3>{currentUser.username}</h3>
          <h3>{currentUser.email}</h3>
        </div>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
};

export default App;