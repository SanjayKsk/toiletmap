import cookies from "js-cookie";


//get tokens from the cookie.
export const getTokenCookie = () => cookies.get("token");


//receives a token and sets it in the cookie and when it expires.
export const setTokenCookie = (token: string) => {
    cookies.set("token", token, {
        expires: 1 / 24,
    })
}

//deletes cookie when function is called
export const removeTokenCookie = () => cookies.remove("token");