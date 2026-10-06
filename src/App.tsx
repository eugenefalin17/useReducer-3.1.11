import { useEffect, useReducer } from 'react';
import './App.css';
import { User } from './types';

type State = {
  searchQuery: string;
  currentUser: User | null;
};

type Action =
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_USER'; payload: User | null };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload,
      };
    default:
      return state;
  }
};
const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    searchQuery: '',
    currentUser: null,
  });
  const currentUser = state.currentUser;
  const searchQuery = state.searchQuery;
  useEffect(() => {
    const fetchFunc = async () => {
      if (!searchQuery) {
        dispatch({
          type: 'SET_USER',
          payload: null,
        });

        return;
      }
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users?username=${searchQuery}`
      );
      const resJson = await response.json();
      dispatch({
        type: 'SET_USER',
        payload: resJson[0] ?? null,
      });
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
      {currentUser ? (
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
