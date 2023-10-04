import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import rootReducer from '../reducers/rootReducer';


/**************************************************************************************************************************************************************************************************************************************************
 * `configureStore` automatically adds the `thunk` middleware and the `Redux DevTools` extension.
 * `configureStore` wraps around the original `createStore` method and handles most of the setup automatically.
 ****************************************************************************************************************************************************************************************************************************************************/
export const store = configureStore({
  // Automatically calls `combinedReducers`.
  // Import the `reducer function` e.g. "rootReducer" from the specified reducer e.g. "rootReducer" and add it to the store's `reducer` parameter so as to tell the store to use the specified reducer function to handle all updates to that state.
  reducer: {
    root: rootReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself.
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {root: RootState etc}
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
