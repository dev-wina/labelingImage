import { useCallback, useEffect, useRef, useState } from 'react';

export default function useStateWithPromise(initialState: any){
    const [state, setState] = useState(initialState);
    const resolverRef = useRef<any>(null);

    useEffect(()=> {
        if (resolverRef.current) {
            resolverRef.current(state)
            resolverRef.current = null
        }
    },[resolverRef.current, state])

    const handleSetState = useCallback((stateAction) => {
        setState(stateAction);
        return new Promise(resolve => {
            resolverRef.current = resolve;
        });
    }, [setState])

  return [state, handleSetState];
};