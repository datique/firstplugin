import * as handleActions from '../handleActions';

export function registerHandleActions({ diHelper }) {
  Object.values(handleActions).forEach((handleAction) => diHelper.invoke(handleAction));
}
