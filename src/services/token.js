import  Cookies from  "js-cookie"

/* eslint-disable import/no-anonymous-default-export */
class TokenService {
    getToken() {
        // return localStorage.getItem("token")
        return Cookies.get("token")
    }
    // setToken(token) {
    //     // return localStorage.setItem("token", token)
    //     return Cookies.set("token", AUTHENTICATION)
    // }
    removeUser() {
        // localStorage.removeItem("token")
        Cookies.remove("token") 
    }
}
export default new TokenService();
