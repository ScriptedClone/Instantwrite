// This script serves as a wrapper to React-router's useNavigate
// to enable its usage on js files, specifically request.js
//

let nav

/** Store React-router useNavigate */
export function setNavigate(routerNavigate) {
    nav = routerNavigate
}

/** Export useNavigate wrapper. */
export function redirect() {
    nav('/login')
}
