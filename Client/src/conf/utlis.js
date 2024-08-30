const trimTolength = (str, s) => {
    if (str.length > s) {
        str = str.substring(0,s)+"..."
    }
    return str;
}

export {
    trimTolength
}