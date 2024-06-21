// api.js

import axios from "axios";

const getToken = () => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData).token : null;
};

export const getFunnels = () =>
    axios.get(`https://mediax-crm.com/v1/api/funnels`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getFunnelsPaginationData = (parametersObject) => {
    return axios.post("https://mediax-crm.com/v1/api/funnels", parametersObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const deleteFunnel = (id) =>
    axios.delete(`https://mediax-crm.com/v1/api/funnels/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const addFunnel = (dialogInputObject) =>
    axios.post(`https://mediax-crm.com/v1/api/funnels/store`, dialogInputObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const editFunnel = (dialogInputObject, id) =>
    axios.put(
        `https://mediax-crm.com/v1/api/funnels/update/${id}`,
        dialogInputObject,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const getUsers = () =>
    axios.get(`https://mediax-crm.com/v1/api/users`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getUsersPaginationData = (parametersObject) =>
    axios.post(`https://mediax-crm.com/v1/api/users`, parametersObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const addUser = (dialogInputObject) =>
    axios.post(`https://mediax-crm.com/v1/api/users/store`, dialogInputObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const editUser = (dialogInputObject, id) =>
    axios.put(
        `https://mediax-crm.com/v1/api/users/update/${id}`,
        {
            name: dialogInputObject.name,
            email: dialogInputObject.email,
            role: dialogInputObject.role,
        },
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const deleteUser = (id) =>
    axios.delete(`https://mediax-crm.com/v1/api/users/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getDomains = () =>
    axios.get(`https://mediax-crm.com/v1/api/domains`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getDomainsPaginationData = (parametersObject) =>
    axios.post(`https://mediax-crm.com/v1/api/domains`, parametersObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const deleteDomain = (id) =>
    axios.delete(`https://mediax-crm.com/v1/api/domains/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const addDomain = (dialogInputObject) =>
    axios.post(
        `https://mediax-crm.com/v1/api/domains/store`,
        {
            domain: dialogInputObject.name,
            name: dialogInputObject.user,
            user_id: dialogInputObject.user_id,
        },
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const editDomain = (dialogInputObject, id) =>
    axios.put(
        `https://mediax-crm.com/v1/api/domains/update/${id}`,
        {
            domain: dialogInputObject.name,
            name: dialogInputObject.user,
            user_id: dialogInputObject.user_id,
        },
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const getSpends = () =>
    axios.get(`https://mediax-crm.com/v1/api/spends`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getSpendsPaginationData = (parametersObject) =>
    axios.post(
        `https://mediax-crm.com/v1/api/spends/filtersForSpend`,
        parametersObject,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const addSpend = (dialogInputObject) =>
    axios.post(`https://mediax-crm.com/v1/api/spends/store`, dialogInputObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const deleteSpend = (id) =>
    axios.delete(`https://mediax-crm.com/v1/api/spends/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const editSpend = (dialogInputObject, id) =>
    axios.put(
        `https://mediax-crm.com/v1/api/spends/update/${id}`,
        dialogInputObject,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const getOffers = () =>
    axios.get(`https://mediax-crm.com/v1/api/offers`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getOffersPaginationData = (parametersObject) =>
    axios.post(`https://mediax-crm.com/v1/api/offers`, parametersObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getCountries = () =>
    axios.get(`https://mediax-crm.com/v1/api/country`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const addOffer = (dialogInputObject) =>
    axios.post(
        `https://mediax-crm.com/v1/api/offers/store`,
        {
            name: dialogInputObject.name,
            cap: dialogInputObject.cap,
            funnels: JSON.stringify(dialogInputObject.funnels),
            geo: JSON.stringify(dialogInputObject.geo),
            offer_start: dialogInputObject.offer_start,
            offer_end: dialogInputObject.offer_end,
            source: JSON.stringify(dialogInputObject.source),
        },
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const editOffer = (dialogInputObject, id) =>
    axios.put(
        `https://mediax-crm.com/v1/api/offers/update/${id}`,
        {
            name: dialogInputObject.name,
            cap: dialogInputObject.cap,
            funnels: JSON.stringify(dialogInputObject.funnels),
            geo: JSON.stringify(dialogInputObject.geo),
            offer_start: dialogInputObject.offer_start,
            offer_end: dialogInputObject.offer_end,
            source: JSON.stringify(dialogInputObject.source),
        },
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const deleteOffer = (id) =>
    axios.delete(`https://mediax-crm.com/v1/api/offers/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const editActivity = (id, active) =>
    axios.put(
        `https://mediax-crm.com/v1/api/offers/activity`,
        {
            id,
            active,
        },
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const editCapControl = (id, cap_control) =>
    axios.put(
        `https://mediax-crm.com/v1/api/offers/cap_control`,
        {
            id,
            cap_control,
        },
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const getSources = () =>
    axios.get(`https://mediax-crm.com/v1/api/sources`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const deleteSource = (id) =>
    axios.delete(`https://mediax-crm.com/v1/api/sources/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const addSource = (sourceName) =>
    axios.post(
        `https://mediax-crm.com/v1/api/sources/store`,
        {
            name: sourceName,
        },
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const getLeads = () =>
    axios.get(`https://mediax-crm.com/v1/api/leads`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

// export const getLeadsPaginationData = (parametersObject) =>
//   axios.post(`https://mediax-crm.com/v1/api/leads`, parametersObject);

export const sendLead = (dialogInputObject) =>
    axios.post(
        `https://mediax-crm.com/v1/api/offer/control-send`,
        dialogInputObject,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const postLead = (parametersObject) =>
    axios.post(`https://mediax-crm.com/v1/api/leads`, parametersObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const addLead = (dialogInputObject) =>
    axios.post(`https://mediax-crm.com/v1/api/leads/store`, dialogInputObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const editLead = (dialogInputObject, id) =>
    axios.put(
        `https://mediax-crm.com/v1/api/leads/update/${id}`,
        dialogInputObject,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const deleteLead = (id) =>
    axios.delete(`https://mediax-crm.com/v1/api/leads/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getLeadStatus = () => {
    axios.get(`https://mediax-crm.com/v1/api/offers/leadsStatus`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const getLogs = (date) =>
    axios.post(
        `https://mediax-crm.com/v1/api/logs`,
        { created_at: date },
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const getStatuses = () =>
    axios.get(`https://mediax-crm.com/v1/api/status`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getStatusesCRM = () =>
    axios.get(`https://mediax-crm.com/v1/api/status-crm`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const editStatusCRMValidity = (id, is_valid) =>
    axios.put(
        `https://mediax-crm.com/v1/api/status-crm/validity`,
        {
            id,
            is_valid,
        },
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const addStatus = (dialogInputObject) =>
    axios.post(`https://mediax-crm.com/v1/api/status/store`, dialogInputObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const deleteStatus = (id) =>
    axios.delete(`https://mediax-crm.com/v1/api/status/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const editStatus = (dialogInputObject, id) =>
    axios.put(
        `https://mediax-crm.com/v1/api/status/update/${id}`,
        dialogInputObject,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const editStatusBroker = (dialogInputObject, id) =>
    axios.put(
        `https://mediax-crm.com/v1/api/status-brokers/update/${id}`,
        {
            crm_status: dialogInputObject.crm_status,
            status_id: dialogInputObject.status_id,
        },
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const getLeadsForChart = (obj) =>
    axios.post(`https://mediax-crm.com/v1/api/leads-chart`, obj, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getStats = (obj) =>
    axios.post(`https://mediax-crm.com/v1/api/leads-stats`, obj, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });


export const postLeadsStats = (postDates) =>
    axios.post(`https://mediax-crm.com/v1/api/leads/leads-stats`, postDates, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const postOffersStats = (postDates) =>
    axios.post(`https://mediax-crm.com/v1/api/leads/offer-stats`, postDates, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const postFunnelsStats = (postDates) =>
    axios.post(`https://mediax-crm.com/v1/api/leads/funnel-stats`, postDates, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const postLeadsGeoStats = (postDates) =>
    axios.post(`https://mediax-crm.com/v1/api/leads/geo-stats`, postDates, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getDuplicateLeads = (parametersObject) =>
    axios.post(
        `https://mediax-crm.com/v1/api/duplicate-leads`,
        parametersObject,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const getFilteredSpends = (filtersObject) =>
    axios.post(
        `https://mediax-crm.com/v1/api/spends/filtersForSpend`,
        filtersObject,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const getFilteredOffers = (filtersObject) =>
    axios.post(
        `https://mediax-crm.com/v1/api/offer/filtersOffer`,
        filtersObject,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const getFilteredFunnels = (filtersObject) =>
    axios.post(
        `https://mediax-crm.com/v1/api/funnels/filtersFunnel`,
        filtersObject,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const getFilteredDomains = (filtersObject) =>
    axios.post(
        `https://mediax-crm.com/v1/api/domains/filtersDomains`,
        filtersObject,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const postOfferForLead = (dialogInputObject) =>
    axios.post(
        `https://mediax-crm.com/v1/api/offers/offerforlead`,
        dialogInputObject,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

export const generatePassword = () =>
    axios({
        method: "get",
        url: "https://api.api-ninjas.com/v1/passwordgenerator?length=16",
        headers: { "X-Api-Key": "AavHY7KdIR2V8+sTlGxCcA==fAnbORAjskzshSrB" },
        contentType: "application/json",
    });

export const getLeadsInHoldPaginationData = (parametersObject) =>
    axios.post(`https://mediax-crm.com/v1/api/nosend-leads`, parametersObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getImportedLeads = () =>
    axios.get(`https://mediax-crm.com/v1/api/imported-leads`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const getFilteredLeads = (filtersObject) =>
    axios.post(`https://mediax-crm.com/v1/api/leads`, filtersObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

export const login = (loginObject) =>
    axios.post(`https://mediax-crm.com/v1/api/login`, loginObject, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
