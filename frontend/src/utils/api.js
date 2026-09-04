export const API_BASE = "/api";

export function token() {
    return localStorage.getItem("token") || "";
}

export async function api(path, options = {}) {

    const headers =
        new Headers(options.headers || {});


    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {

        headers.set(
            "Content-Type",
            "application/json"
        );

    }


    const t = token();

    if (t) {

        headers.set(
            "Authorization",
            `Bearer ${t}`
        );

    }


    const response =
        await fetch(
            `${API_BASE}${path}`,
            {
                ...options,
                headers
            }
        );


    const text =
        await response.text();


    let data = {};

    try {

        data =
            text
                ? JSON.parse(text)
                : {};

    }
    catch {

        data = {
            message: text
        };

    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Request failed"
        );

    }


    return data;

}


export function logout() {

    localStorage.removeItem(
        "token"
    );

    window.location.href =
        "/login";

}