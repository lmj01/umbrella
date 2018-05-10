import { Route } from "@thi.ng/router/api";

// route definitions:
// routes are 1st class objects and used directly throughout the app
// without ever referring to their specific string representation

// the `match` arrays specify the individual route elements
// docs here:
// https://github.com/thi-ng/umbrella/blob/master/packages/router/
// https://github.com/thi-ng/umbrella/blob/master/packages/router/src/api.ts#L31

export const HOME: Route = {
    id: "home",
    match: ["home"]
};

export const CONTACT: Route = {
    id: "contact",
    match: ["contact"]
};

export const USER_LIST: Route = {
    id: "user-list",
    match: ["users"],
};

// this is a parametric route w/ parameter coercion & validation
// if coercion or validation fails, the route will not be matched
// if no other route matches, the configured default route will
// be used (see full router config further below)

export const USER_PROFILE: Route = {
    id: "user-profile",
    match: ["users", "?id"],
    validate: {
        id: {
            coerce: (x) => parseInt(x),
            check: (x) => x > 0 && x < 100
        }
    }
};
