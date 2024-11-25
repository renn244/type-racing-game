

/**
 *  This is only use for objects values
 *  if it is a string just use window.Localstorage
 */

export const StoragesetItem = <T=any> (key: string, value: T) => {
    window.localStorage.setItem(key, JSON.stringify(value))
}

export const StoragegetItem = <T=any> (key: string): T | undefined => {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : undefined    
}

export const StorageremoveItem = (key: string): void => {
    window.localStorage.removeItem(key)
}