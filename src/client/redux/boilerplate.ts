import { ClientStoreState } from "../../model/ClientStoreState";
import { CallHistoryMethodAction } from "connected-react-router";

export interface SimpleAction<valueType> {
  type: string,
  value: valueType,
}

export interface ActionCreator<ValueType> {
  (value: ValueType): SimpleAction<ValueType>
}

export interface GetState {
  (): ClientStoreState
}

/**
 * We are using this interface to also work for non-async but "compound" action creators; i.e., those that dispatch
 * multiple actions but don't return a promise (because say, they dispatch multiple synchronous actions).
 *
 * @example
 * ```
 * const fetchStuff = (): AsyncActionCreator =>
 *  async (dispatch: Dispatch): Promise<void> => {
 *    dispatch(setFetchingStuff(true));
 *    const stuff = await axios.get('foo/bar');
 *    dispatch(setStuff(stuff));
 *    dispatch(setFetchingStuff(false));
 *  };
 * 
 * // Or, non-async compound action
 * const handleStuffFetchError = (error): AsyncActionCreator =>
 *   (dispatch: dispatch): void => {
 *     dispatch(setFetchingStuff(false));
 *     dispatch(setStuff(null));
 *     dispatch(setStuffFetchError(error));
 *   };
 * ```
 */
export interface AsyncActionCreator {
  (dispatch: Dispatch, getState?: GetState): any,
}

export interface ActionCreatorFactory {
  <ValueType>(type: string): ActionCreator<ValueType>
}

export interface Dispatch {
  (actionOrCreator: SimpleAction<any> | ActionCreator<any> | AsyncActionCreator | CallHistoryMethodAction): void
}

export interface Reducer<ValueType> {
  (state: ValueType, action: SimpleAction<ValueType>): ValueType
}

export interface ReducerFactory {
  <ValueType>(type: string, defaultValue: ValueType): Reducer<ValueType>
}

/**
 * @example
 * ```
 * const MyBool = "MyBool"; // type of action; we expect the associated state to be boolean.
 * const NumJobs = "NumJobs";
 * const setMyBool = actionCreatorFactory<boolean>(MyBool);
 * const setNumJobs = actionCreatorFactory<number>(NumJobs);
 * 
 * dispatch(setMyBool(false)); // { type: MyBool, value: false }
 * dispatch(setNumJobs(42));   // { type: NumJobs, value: 42 }
 * ```
 */
export const actionCreatorFactory:ActionCreatorFactory = <ValueType>(type: string): ActionCreator<ValueType> => {
  const creator:ActionCreator<ValueType> = (value: ValueType): SimpleAction<ValueType> => ({ type, value });
  return creator;
}

/**
 * @example
 * ```
 * const MyBool = "MyBool"; // type of action; we expect the associated state to be boolean.
 * const NumJobs = "NumJobs";
 * const reducers = combineReducers({
 *   myBool: reducerFactory<boolean>(MyBool),
 *   numJobs: reducerFactory<number>(NumJobs, 0),
 * })
 * ```
 */
export const reducerFactory: ReducerFactory = <valueType>(targetType: string, defaultValue: valueType): Reducer<valueType> => {
  const reducer = (state:valueType = defaultValue, { type, value }: SimpleAction<valueType>) => type === targetType ? value : state;
  return reducer;
}
