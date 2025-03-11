import React from "react";
import zxcvbn from "zxcvbn";
import Dinero from "./dinero.js";

const jb_utils = Object.create(null);

jb_utils.deep_freeze = function (object) {
    if (typeof object === "object") {
        Object.keys(object).forEach(function (key) {
            (
                typeof object[key] === "object"
                && !Object.isFrozen(object[key])
            ) && jb_utils.deep_freeze(object[key]);
        });

        return Object.freeze(object);
    } else {
        return Object.freeze(Object.create(null));
    }
};

jb_utils.deep_merge = function (original_target, original_source) {

    if (!is_obj(original_target) || !is_obj(original_source)) {
        return original_source;
    }

    const target = structuredClone(original_target);
    const source = structuredClone(original_source);

    Object.keys(source).forEach(key => {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = targetValue.concat(sourceValue);
        } else if (is_obj(targetValue) && is_obj(sourceValue)) {
            target[key] = jb_utils.deep_merge(Object.assign({}, targetValue), sourceValue);
        } else {
            target[key] = sourceValue;
        }
    });

    return target;
};

function is_obj(item) {
    return item && typeof item === "object";
}


/**
 * @param {string} date - a MySQL date time stamp
 * @param {boolean} format - convert to a en-US string
 * @returns {string} date time
 */
jb_utils.gmt_to_local = function (date, format = false) {
    try {
        if (typeof date === "string") {

            // append "UTC" to a MySQL datetime string and then create the date
            // const local = new Date(date + " UTC"); // doesn't work in Safari, the below does

            // Add T inside the string and append .000Z so it's a UTC date
            const local = new Date(date.replace(" ", "T") + ".000Z");

            if (format) {
                const formatter = new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: false
                });
                return formatter.format(local);
            } else {
                return local;
            }
        } else {
            return "";
        }
    } catch (e) {
        return console.error("InvalidDate: " + date);
    }
};

jb_utils.debounce = function (func, wait, immediate) {
    let timeout;
    return function () {
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) {
                func.apply(this, args);
            }
        };

        const callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) {
            func.apply(this, args);
        }

    };
};

jb_utils.number_to_usd = function (number) {
    // used to format a float into a standard US currency value
    const currencyFormatter = Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});
    return currencyFormatter.format(number);
};

/**
 *
 * @param {string} password
 * @param {function=} callback
 * @returns {Readonly<{feedback, score, color: (string|*)}>}
 */
jb_utils.check_password_strength = function (password, callback) {

    const {score, feedback} = zxcvbn(password);

    const result = {
        color: get_color(score),
        feedback: feedback.warning,
        score: score
    };

    if (typeof callback === "function") {
        callback(score);
    }

    return Object.freeze(result);

    function get_color(score) {
        const colors = [
            {label: "Dangerous", color: "#dc3545"},
            {label: "Risky", color: "#fd7e14"},
            {label: "Poor", color: "#ffc107"},
            {label: "Good", color: "#198754"}
        ];

        if (score >= colors.length) {
            return colors.at(-1).color;
        } else {
            return colors[score].color;
        }
    }
};

/**
 * @param {Array} allowed_actions - Actions allowed for this user.
 * @param {number|String} action - The action number we are checking.
 * @returns {boolean} - True if user has access to this action.
 */
jb_utils.get_access = function (allowed_actions, action) {
    return allowed_actions.some(e => e === parseInt(action));
};

jb_utils.format_bytes = function (bytes, decimals = 2) {

    if (bytes === 0) {
        return "0 Bytes";
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((
        bytes / Math.pow(k, i)
    ).toFixed(dm)) + sizes[i];
};

jb_utils.format_phone = function (phone_number) {
    // try to coerce the phone number for display, if necessary
    // just a best faith effort on the number length, if it's just a number

    const number = parseInt(phone_number);

    if (Number.isNaN(number)) {
        return phone_number; // we got a phone number that is already something else, so return it
    } else {

        if (phone_number.length === 10) {

            const formatted = (
                "(" + phone_number
            ).split("");
            formatted.splice(4, 0, ") ");
            formatted.splice(8, 0, "-");
            return formatted.join("");

        } else {
            return phone_number; // unknown number format, so just return it
        }
    }
};

jb_utils.format_date_to_time = function (datetime) {
    return new Date(datetime).toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric"
    }).toLowerCase();
};

/*
 * @param {Date} datetime
 * @returns {string}
 */
jb_utils.format_datetime = function (datetime) {

    if (datetime instanceof Date && datetime.toString() !== "Invalid Date") {
        return datetime.toLocaleString("en-US");
    } else {
        const d = new Date(datetime);
        if (d instanceof Date && datetime.toString() !== "Invalid Date") {
            return datetime.toLocaleString("en-US");
        }
    }
};

/**
 * A helpful little function that shows the Bootstrap breakpoints in the bottom corner.
 * @returns {JSX.Element}
 */
jb_utils.show_breakpoints = function () {
    return <div className="rounded position-fixed bottom-0 end-0 px-2 bg-dark bg-opacity-75 text-warning" style={
        {zIndex: 10000}
    }>
        <div className="d-inline">XXS:&nbsp;</div>
        <div className="d-none d-sm-inline">SM:&nbsp;</div>
        <div className="d-none d-md-inline">MD:&nbsp;</div>
        <div className="d-none d-lg-inline">LG:&nbsp;</div>
        <div className="d-none d-xl-inline">XL:&nbsp;</div>
        <div className="d-none d-xxl-inline">XXL:&nbsp;</div>
    </div>;
};

/**
 * @param {Array<object>} data
 * @param {string} property_name
 * @param {string} order
 * @returns {Array} - A sorted and frozen array, or an empty array
 */
jb_utils.sort_by_datetime = function (data, property_name = "created", order = "descending") {
    // clone array in case it is frozen
    const to_sort = Array.isArray(data) ? [...data] : [];

    if (to_sort.length > 0) {
        if (order === "ascending") {
            return jb_utils.deep_freeze(to_sort.sort(function (a, b) {
                return Date.parse(a[property_name]) - Date.parse(b[property_name]);
            }));
        } else {
            return jb_utils.deep_freeze(to_sort.sort(function (a, b) {
                return Date.parse(b[property_name]) - Date.parse(a[property_name]);
            }));
        }
    } else {
        return [];
    }
};

// jb_utils.check_email_for_duplicate = checkEmail;

/**
 *
 * @param {Date} date
 * @returns {boolean} isToday
 */
jb_utils.date_is_today = function (date) {
    if (date instanceof Date && isFinite(date)) {
        return new Date().toLocaleDateString() === date.toLocaleDateString();
    }
    return false;
};

jb_utils.get_today = function () {
    const d = new Date();
    return {
        day: d.toLocaleDateString("en-US", {day: "numeric"}),
        month: d.toLocaleDateString("en-US", {month: "long"}),
        year: d.toLocaleDateString("en-US", {year: "numeric"})
    };
};

jb_utils.get_yesterday = function () {
    const d = new Date(new Date() - 864e5);
    return {
        day: d.toLocaleDateString("en-US", {day: "numeric"}),
        month: d.toLocaleDateString("en-US", {month: "long"}),
        year: d.toLocaleDateString("en-US", {year: "numeric"})
    };
};

/**
 * @typedef {Object} DateRange
 * @property {Date} from
 * @property {Date} to
 */

/**
 *
 * @param {Object} range
 * @param {String} range.from - number of months in the past
 * @param {String} range.to - number of months in the past or now, for today
 * @param {String} [range.type='month'] - calculate using days or months
 * @returns {DateRange} - a date range with two Date objects
 */
jb_utils.get_date_for_range = function (range = {from: "3", to: "now", type: "month"}) {

    const {from: filter_from, to: filter_to, type = "month"} = range;

    const today = new Date();

    const to = (
        filter_to === "now" ? today : new Date(filter_to)
    );
    const from = new Date();
    if (type === "month") {

        // from may be a dateable or an integer
        const try_int = parseInt(filter_from);
        const is_int = !Number.isNaN(try_int);

        if (is_int) {
            from.setMonth(today.getMonth() - (
                parseInt(filter_from) - 1
            ));
        } else {
            const try_date = new Date(filter_from);
            const is_date = isFinite(try_date);
            if (is_date) {
                from.setMonth(try_date.getMonth());
            } else {
                from.setMonth(today.getMonth() - 1);
            }
        }

        from.setDate(1);
    } else if (type === "days") {
        from.setDate(today.getDate() - parseInt(filter_from));
    }

    from.setHours(0, 0, 0, 0);

    // format to UTC time. The database server is in UTC time.
    const formatter = new Intl.DateTimeFormat("en-CA", {timeZone: "UTC"});

    return {
        from: formatter.format(from) + " 00:00:00",
        to: formatter.format(to) + " 23:59:59"
    };
};

jb_utils.get_date_months_ago = function (months = 0) {
    const months_ago = new Date();
    months_ago.setMonth(months_ago.getMonth() - months);
    months_ago.setDate(1);
    return months_ago;
};

/**
 *
 * @param {Array<string>} values - an array of strings parsable to floats, e.g. 12.34
 */
jb_utils.add_money = function (values = []) {
    return (
        values.reduce(function (accumulator, current_value) {
            // convert current_value to float and multiply by 100 to remove decimals
            const value = Math.floor(parseFloat(current_value) * 100);
            if (Number.isInteger(value)) {
                return Dinero({
                    amount: value
                }).add(Dinero({
                    amount: accumulator
                })).getAmount();
            } else {
                return 0;
            }
        }, 0) / 100
    );
};

/**
 * @param {string} string - the string to be tested
 * @returns {boolean}
 */
jb_utils.is_integer = function (string = "") {

    if (typeof string === "string") {
        return Array.isArray(string.match(/^\d+$/g));
    }

    return false;

};

jb_utils.number_with_commas = function (number) {

    const n = parseFloat(number);

    if (!Number.isNaN(n)) {
        return parseFloat(number)
            .toFixed(2)
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    return 0;
};

/**
 * Takes an array of strings and returns a single string that starts
 * with the capitalized first letter of each string.
 * @param {Array<string>} names - names to return initials for
 * @returns {String} initials
 */
jb_utils.get_initials = function (names = []) {
    return names.reduce(function (initials, name) {
        if (typeof name === "string") {
            return initials + name.charAt(0).toUpperCase();
        }
        return false;
    }, "");
};

// used to format a float into a standard US currency value
const currencyFormatter = Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});

// to format the y-axis labels of the bar chart
jb_utils.tick_format = function (label) {
    return `${currencyFormatter.format(label).split(".")[0]}`;
};

jb_utils.logout = function () {
    sessionStorage.removeItem("token");
};

jb_utils.get_device_language = function () {

    const l = navigator.language;

    if (l.includes("es")) {
        return "es";
    }

    if (l.includes("en")) {
        return "en";
    }

    return "en";

};

jb_utils.deep_freeze(jb_utils);

// async function checkEmail(email) {
//
//     // reject if too short or missing
//     if (!email || email.length < 5) {
//         return false;
//     }
//
//     // first check if passing regex and, if so,
//     // only then submit to server for unique check
//     if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i.test(email)) {
//         return false;
//     }
//
//     return new Promise((resolve) => {
//         api.check_for_duplicate({value: email})
//             .then(function (response) {
//                 resolve(response !== true); // true if it's in use
//             })
//             .catch(reason => resolve(false));
//     });
// }

export default jb_utils;