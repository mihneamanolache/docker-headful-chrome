export const isValidUrl = (input) => {
    let url;
    try {
        url = new URL(input);
    } catch {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}