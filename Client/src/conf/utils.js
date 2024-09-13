const trimTolength = (str, s=20) => {
    if (str?.length > s) {
        str = str.substring(0,s)+"..."
    }
    return str;
}

const getImageUrl = (song) => {
    if (song.songThumbnailUrl) {
        return song.songThumbnailUrl;
    }
    const placeholderImage = `https://via.placeholder.com/100.png?text=${encodeURIComponent(
        song.songName
    )}`;
    return placeholderImage;
};

export {
    trimTolength,
    getImageUrl
}