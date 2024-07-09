import { useMemo } from 'react';

const useControlledState = (state) => {
  return useMemo(() => {
    if (state.groupBy.length) {
      return {
        ...state,
        hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter(
          (d, i, all) => all.indexOf(d) === i
        ),
      };
    }
    return state;
  }, [state]);
};

export default useControlledState;
