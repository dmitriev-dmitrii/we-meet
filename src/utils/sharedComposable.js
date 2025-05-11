export const createSharedComposable = (composable) => {
    let instance = null;
    let isInitializing = false;
    let proxy = null;


    return () => {
        try {
            if (instance) {
                return instance;
            }

            if (isInitializing && proxy) {
                return proxy;
            }

            proxy = new Proxy({}, {
                get(target, prop) {
                    if (!instance) {
                        return (...args) => {
                            if (!instance) {
                                return undefined;
                            }
                            if (typeof instance[prop] === 'function') {
                                return instance[prop](...args);
                            }
                            return instance[prop];
                        };
                    }
                    if (typeof instance[prop] === 'function') {
                        return instance[prop].bind(instance);
                    }
                    return instance[prop];
                }
            });

            isInitializing = true;


            instance = composable();
            return instance;
        } catch (err) {
            console.log('createSharedComposable err', err)
        } finally {
            isInitializing = false;
        }
    };
};