
export function isSameObjects(object1, object2) {
    if(typeof object1 !== 'object' || typeof object2 !== 'object') return 'error'

    // if the number of keys in both objects aren't same it'll return false
    if (Object.keys(object1).length !== Object.keys(object2).length) { return false }
    // if any property value in both objects aren't same it'll return false
    for (const key in object1) {
        if (object1[key] !== object2[key]) { return false }
    }
    // if both objects don't passes above conditions then it'll return true
    return true;
}