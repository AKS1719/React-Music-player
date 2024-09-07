const trimTolength = (str, s=20) => {
    if (str.length > s) {
        str = str.substring(0,s)+"..."
    }
    return str;
}

export {
    trimTolength
}