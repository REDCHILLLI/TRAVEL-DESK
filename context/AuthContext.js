import { createContext, useEffect,  useReducer} from "react"

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    return null; // fallback if parsing fails
  }
};

const initial_state = {
  user: getUserFromStorage(),
  role: localStorage.getItem("role") || "user",
  loading: false,
  error: null,
};


  
export const AuthContext = createContext({
  user: null,
  loading: false,
  error: null,
  dispatch: () => {},
});


const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        role: "user",
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
  return {
    user: action.payload.user, // now safe
    role: action.payload.role || "user",
    loading: false,
    error: null,
  };



    case "LOGIN_FAILURE":
      return {
        user: null,
        role: "user",
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        role: "user",
        loading: false,
        error: null,
      };
    case "REGISTER_SUCCESS":
      return {
        user: null,
        role: "user",
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initial_state);

  useEffect(() => {
  if (state.user) {
    localStorage.setItem("user", JSON.stringify(state.user)); // stores entire user object
    localStorage.setItem("userId", state.user._id); // separate key for convenience
  } else {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
  }
  localStorage.setItem("role", state.role);
}, [state.user, state.role]);


  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        role: state.role,  // <-- expose role
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

