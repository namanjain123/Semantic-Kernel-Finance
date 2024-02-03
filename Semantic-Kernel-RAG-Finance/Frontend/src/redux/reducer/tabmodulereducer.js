const initialState = {
  selectedId: null,
  };
  
  const tabmoduleReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_SELECTED_ID':
        return {
          ...state,
          selectedId: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default tabmoduleReducer;