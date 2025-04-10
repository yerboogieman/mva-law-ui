import {API_BASE_URL} from "../Constants";
import {axiosInstance} from "./axiosInstance";
import mva_utils from "./functions.jsx";

const mva_api = Object.create(null);

mva_api.base_url = API_BASE_URL;

mva_api.get_jwt = function () {
    return sessionStorage.getItem("jwt") || "";
};

mva_api.validate = function () {

    // use the roles endpoint to both validate the logged in token
    // and get back what roles the current user has
    return axiosInstance.get("/users/current/validate")
        .then(response => {
            if (response.success === true) {
                return mva_utils.deep_freeze(response);
            } else {
                sessionStorage.clear();
                return {success: false};
            }
        });
};


mva_api.get_client_form_data = function () {

    // Data needed for user forms includes roles and statuses

    return Promise.allSettled([
        mva_api.get_all_statuses(),
        mva_api.get_clients()
    ]).then(function (results) {

        const [
            statuses_result,
            clients_result
        ] = results;

        // what we'll return from here
        const success = statuses_result.value.success
            && clients_result.value.success;

        if (success) {

            return mva_utils.deep_freeze({
                success,
                statuses: statuses_result.value.data || [],
                clients: clients_result.value.data || []
            });
        }

        return {
            success
        };
    });
};

mva_api.get_user_form_data = function () {

    // Data needed for user forms includes
    // roles, statuses and organizations

    return Promise.allSettled([
        mva_api.get_all_roles(),
        mva_api.get_all_statuses(),
        mva_api.get_businesses(),
        mva_api.get_clients()
    ]).then(function (results) {

        const [
            roles_result, statuses_result, businesses_result
        ] = results;

        // what we'll return from here
        const success = roles_result.value.success && statuses_result.value.success && businesses_result.value.success;

        if (success) {
            return mva_utils.deep_freeze({
                success,
                roles: roles_result.value.data || [],
                statuses: statuses_result.value.data || [],
                businesses: businesses_result.value.data || []
            });
        }

        return {
            success
        };
    });
};

mva_api.get_all_roles = function () {
    return axiosInstance.get("/roles")
        .then(response => {
            return response;
        });
};

mva_api.get_all_statuses = function () {
    return axiosInstance.get("/users/statuses")
        .then(response => {
            return response;
        });
};

mva_api.get_businesses = function () {
    return axiosInstance.get("/organizations")
        .then(response => {
            return response;
        });
};

mva_api.get_types = function (endpoint) {
    // Generic function, ensure Accept header is set for JSON response
    return axiosInstance.get(endpoint, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            // The interceptor already handles freezing and success property
            return response;
        });
};

mva_api.do_login = function ({
    email,
    password
}) {

    sessionStorage.clear();

    if ((
        typeof email !== "string" || typeof password !== "string"
    ) && (
        email.length > 0 || password.length > 0
    )) {
        return new Promise(resolve => {
            resolve({
                success: false
            });
        });
    }

    return axiosInstance.post("/auth/login?message=true", {
        username: email,
        password
    });
};

mva_api.do_signup = function ({
    first_name,
    middle_name,
    last_name,
    email,
    password,
    phone,
    username
}) {

    if (typeof email
        === "string"
        && typeof password
        === "string"
        && email.length
        > 0
        && password.length
        > 0
        && username.length
        > 0) {
    }

    const body = {
        name: {
            first: first_name,
            middle: middle_name,
            last: last_name
        },
        email,
        password,
        phone
    };

    return axiosInstance.post("/auth/signup", body);
};

mva_api.enroll_business = function ({
    business_name,
    first_name,
    last_name,
    email,
    password,
    phone
}) {

    const body = {
        business: business_name,
        name: {
            first: first_name,
            last: last_name
        },
        email,
        password,
        phone
    };

    return axiosInstance.post("/account/signup", body);
};


mva_api.request_password_reset = function (email = "") {

    if (typeof email === "string" && email.length > 0) {
        return axiosInstance.get(`/email/password-reset?u=${btoa(email)}`)
            .then(response => {
                return response;
            });
    }

    return new Promise(res => res({
        success: false,
        message: "Missing user email"
    }));
};

mva_api.validate_password_reset_token = function (token) {
    return axiosInstance.post("/auth/validate-change-password-token", {
        token
    }).then(response => response);
};

mva_api.submit_password_reset = function ({
    password,
    repeat_password,
    token
}) {
    return axiosInstance.post("/auth/password-reset", {
        password,
        repeatPassword: repeat_password,
        token
    });
};

// the idea is we can look up a set of users against some kind of match
mva_api.find_user = function () {


};

mva_api.get_client = function (id) {
    return axiosInstance.get(`/users/${id}`);
};

mva_api.get_clients = function () {
    return axiosInstance.get("/clients")
        .then(result => {
            if (result.success === true) {
                return mva_utils.deep_freeze(result);
            }
        });
};

mva_api.delete_client = function (email) {
    return axiosInstance.delete(`/clients/${email}`);
};

mva_api.create_client = function (values) {
    return axiosInstance.post("/clients", values);
};


mva_api.get_employees = function () {
    return axiosInstance.get("/employees");
};

// users
mva_api.get_users = function () {

    return axiosInstance.get("/users")
        .then(result => {

            if (result.success === true) {

                return mva_utils.deep_freeze(result);

            }

        });
};


mva_api.get_user = function (email) {
    return axiosInstance.get("/users" + email)
        .then(response => {
            return response;
        });
};

mva_api.update_user = function (data) {

    const method = data.username === ""
        ? "POST" // create
        : "PUT"; // update

    data.username = data.email;

    if (method === "POST") {
        return axiosInstance.post("/users", data);
    } else if (method === "PUT") {
        return axiosInstance.put("/users", data);
    }
};

mva_api.delete_user = function (username) {
    return axiosInstance.delete(`/users/${username}`);
};

/**
 * Check with the server to see if the provided value is a duplicate, such as for an email
 * @param {object} config
 * @param {string} config.value - the string to check
 * @returns {Promise<{}>}
 */
mva_api.check_for_duplicate = function (config) {

    const {value} = config;

    if (typeof value === "string" && value.length > 0) {
        return axiosInstance.post("/users/email/duplicate", {
            value
        }).then(response => {

            if (response.success === true) {
                return response;
            }
        });
    }

    return new Promise(res => res({
        success: false,
        message: "No value provided to check"
    }));
};

mva_api.get_user_menu = function () {
    return axiosInstance.get("/menus")
        .then(response => {
            if (response.success === true) {
                return mva_utils.deep_freeze({
                    success: true,
                    menu: response.data
                });
            }
            return response;
        });
};

mva_api.get_workflow_view = function (process_instance_business_key = "") {

    if (process_instance_business_key.length === 0) {
        return new Promise(res => res({success: false}));
    }

    return axiosInstance.request({
        method: "GET",
        url: `/workflow-views/${process_instance_business_key}`
    }).then(function (response) {
        return response;
    });
};

mva_api.update_case = function (values) {
    return axiosInstance.patch("/cases", {
        id: values.id,
        properties: {
            values
        }
    });
};

mva_api.update_whole_case = function (body) {
    return axiosInstance.put("/cases", body);
};


mva_api.get_case = function (case_id) {
    return axiosInstance.get(`/cases/${case_id}`).then(response => {
        if (response.success === true) {
            return mva_utils.deep_freeze(response);
        } else {
            return {};
        }
    });
};

mva_api.update_case_item = function (case_id, values) {
    return axiosInstance.patch(`/cases/${case_id}/items`, {
        id: values.id,
        properties: {
            values
        }
    });
};

/**
 *
 * Fetch the panel data the current step in the workflow.
 *
 * @param {number} task_id - equates to the activity process instance id
 * @param {string} step_id - this equates to the task definition key
 * @return {Promise<axios.AxiosResponse<any>>}
 */
mva_api.get_workflow_panel_data = function (task_id, step_id) {


    return axiosInstance.get(`/workflow-panel?????/${task_id}/${step_id}`)
        .then(response => {


        });
};

mva_api.get_cases = function (config = {}) {

    const params = {
        status: config.status || "Active",
        completed: config.completed || false
    };

    return axiosInstance.request({
        method: "GET",
        url: "/cases/assigned",
        params
    }).then(function (response) {
        return response;
    });

};

mva_api.create_case = function (config = {}) {

    const body = {
        title: config.title,
        description: config.description,
        clientId: config.client_id,
        items: config.items
    };

    return axiosInstance.post("/cases", body);
};

mva_api.complete_workflow_step = function (config = {}) {

    const {
        workflow_business_key,
        task_definition_key,
        variables = {}
    } = config;

    if (workflow_business_key && task_definition_key) {

        return axiosInstance.post(`/tasks/${workflow_business_key}/${task_definition_key}`, {
            action: "complete",
            variables
        });

    }


};


mva_api.fetch_step_info_panel = function (process_instance_id, task_definition_key) {

    return axiosInstance.get(`/tasks/${process_instance_id}/${task_definition_key}`)
        .then(response => {
            return response;
        });
};

mva_api.delete_case = function (case_id) {
    return axiosInstance.delete("/cases/" + case_id);
};

mva_api.modify_case = function (config = {}) {

    const body = {
        id: config.id,
        properties: {
            description: config.description || undefined,
            name: config.name || undefined
        }
    };

    return axiosInstance.patch("/cases", body);
};

// Organizations (including Medical Providers)
mva_api.create_organization = function (providerData) {
    // Assuming providerData has the correct structure { name, address, phone, website, types: [...] }
    return axiosInstance.post("/organizations", providerData);
};

const api = mva_utils.deep_freeze(mva_api);

export default api;