import React from "react";

const useEffectOnce = (effect) => {
    const [needToCall, setNeedToCall] = React.useState(false);

    React.useEffect(() => {
        if (needToCall) {
            effect();
        }
        else {
            setNeedToCall(true);
        }
    }, [needToCall]);
};
export default useEffectOnce;