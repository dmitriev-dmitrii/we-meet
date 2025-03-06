export class TrackedMap  extends Map {

    _changeMapMethods = ['set', 'delete', 'clear']

    _callbacksSet = new Set()
    constructor(mapPayload) {
        super()
        if ( Array.isArray( mapPayload ) ) {
            for (const [ key, val ] of mapPayload) {
                this.set(key, val)
            }
        }

        return    new Proxy( this , {
            get: (target, propKey, mapReceiver) => {
                if (this._changeMapMethods.includes(propKey)) {

                    this._callbacksSet.forEach((item)=> {
                        item( mapReceiver , propKey )
                    })

                }

                return typeof target[propKey] === "function" ? target[propKey].bind(target) : Reflect.get(target, propKey, mapReceiver)
            }
        });

    }

    // Метод для добавления колбэка
    subscribe = (callback) => {
        if (typeof callback === "function") {
            this._callbacksSet.add(callback)
        }
    }

    // Метод для удаления колбэка
    unSubscribe = (callback) => {
        return  this._callbacksSet.delete(callback)
    }

}