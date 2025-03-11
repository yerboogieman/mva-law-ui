import {BASE_URL} from "../Constants";
import {axiosInstance} from "./axiosInstance";
import jb_utils from "./functions.jsx";

const jb_api = Object.create(null);

jb_api.base_url = BASE_URL;

jb_api.get_jwt = function () {
    return sessionStorage.getItem("jwt") || "";
};

jb_api.validate = function () {

    // use the roles endpoint to both validate the logged in token
    // and get back what roles the current user has
    return axiosInstance.get("/users/current/validate")
        .then(response => {
            if (response.success === true) {
                return jb_utils.deep_freeze(response);
            } else {
                sessionStorage.clear();
                return {success: false};
            }
        });
};


jb_api.get_client_form_data = function () {

    // Data needed for user forms includes roles and statuses

    return Promise.allSettled([
        jb_api.get_all_statuses(),
        jb_api.get_clients()
    ]).then(function (results) {

        const [
            statuses_result,
            clients_result
        ] = results;

        // what we'll return from here
        const success = statuses_result.value.success
            && clients_result.value.success;

        if (success) {

            return jb_utils.deep_freeze({
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

jb_api.get_user_form_data = function () {

    // Data needed for user forms includes
    // roles, statuses and organizations

    return Promise.allSettled([
        jb_api.get_all_roles(),
        jb_api.get_all_statuses(),
        jb_api.get_businesses(),
        jb_api.get_clients()
    ]).then(function (results) {

        const [
            roles_result, statuses_result, businesses_result
        ] = results;

        // what we'll return from here
        const success = roles_result.value.success && statuses_result.value.success && businesses_result.value.success;

        if (success) {
            return jb_utils.deep_freeze({
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

jb_api.get_all_roles = function () {
    return axiosInstance.get("/roles")
        .then(response => {
            return response;
        });
};

jb_api.get_all_statuses = function () {
    return axiosInstance.get("/users/statuses")
        .then(response => {
            return response;
        });
};

jb_api.get_businesses = function () {
    return axiosInstance.get("/organizations")
        .then(response => {
            return response;
        });
};

jb_api.do_login = function ({
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

jb_api.do_signup = function ({
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

jb_api.enroll_business = function ({
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


jb_api.request_password_reset = function (email = "") {

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

jb_api.validate_password_reset_token = function (token) {
    return axiosInstance.post("/auth/validate-change-password-token", {
        token
    }).then(response => response);
};

jb_api.submit_password_reset = function ({
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
jb_api.find_user = function () {


};

jb_api.get_client = function (id) {
    return axiosInstance.get(`/users/${id}`);
};

jb_api.get_clients = function () {
    return axiosInstance.get("/clients")
        .then(result => {
            if (result.success === true) {
                return jb_utils.deep_freeze(result);
            }
        });
};

jb_api.delete_client = function (email) {
    return axiosInstance.delete(`/clients/${email}`);
};

jb_api.create_client = function (values) {
    return axiosInstance.post("/clients", values);
};


jb_api.get_employees = function () {
    return axiosInstance.get("/employees");
};

// users
jb_api.get_users = function () {

    return axiosInstance.get("/users")
        .then(result => {

            if (result.success === true) {

                return jb_utils.deep_freeze(result);

            }

        });
};


jb_api.get_user = function (email) {

    return axiosInstance.get("/users" + email)
        .then(response => {

            console.log(response);

        });

};

jb_api.update_user = function (data) {

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

jb_api.delete_user = function (username) {
    return axiosInstance.delete(`/users/${username}`);
};

/**
 * Check with the server to see if the provided value is a duplicate, such as for an email
 * @param {object} config
 * @param {string} config.value - the string to check
 * @returns {Promise<{}>}
 */
jb_api.check_for_duplicate = function (config) {

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

jb_api.get_user_menu = function () {
    return axiosInstance.get("/menus")
        .then(response => {
            if (response.success === true) {
                return jb_utils.deep_freeze({
                    success: true,
                    menu: response.data
                });
            }
            return response;
        });
};

jb_api.get_workflow_view = function (process_instance_business_key = "") {

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

jb_api.update_job = function (values) {
    return axiosInstance.patch("/jobs", {
        id: values.id,
        properties: {
            values
        }
    });
};

jb_api.update_whole_job = function (body) {
    return axiosInstance.put("/jobs", body);
};


jb_api.get_job = function (job_id) {
    return axiosInstance.get(`/jobs/${job_id}`).then(response => {
        if (response.success === true) {
            return jb_utils.deep_freeze(response);
        } else {
            return {};
        }
    });
};

jb_api.update_job_item = function (job_id, values) {
    return axiosInstance.patch(`/jobs/${job_id}/items`, {
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
jb_api.get_workflow_panel_data = function (task_id, step_id) {


    return axiosInstance.get(`/workflow-panel?????/${task_id}/${step_id}`)
        .then(response => {


        });
};

jb_api.get_jobs = function (config = {}) {

    const params = {
        status: config.status || "Active",
        completed: config.completed || false
    };

    return axiosInstance.request({
        method: "GET",
        url: "/jobs/contractor",
        params
    }).then(function (response) {
        return response;
    });

};

jb_api.create_job = function (config = {}) {

    const body = {
        name: config.name,
        description: config.description,
        clientId: config.client_id,
        items: config.items
    };

    return axiosInstance.post("/jobs", body);
};

jb_api.complete_workflow_step = function (config = {}) {

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


jb_api.fetch_step_info_panel = function (process_instance_id, task_definition_key) {

    return axiosInstance.get(`/tasks/${process_instance_id}/${task_definition_key}`)
        .then(response => {
            return response;
        });
};

jb_api.delete_job = function (job_id) {
    return axiosInstance.delete("/jobs/" + job_id);
};

jb_api.modify_job = function (config = {}) {

    const body = {
        id: config.id,
        properties: {
            description: config.description || undefined,
            name: config.name || undefined
        }
    };

    return axiosInstance.patch("/jobs", body);
};


const api = jb_utils.deep_freeze(jb_api);

export default api;