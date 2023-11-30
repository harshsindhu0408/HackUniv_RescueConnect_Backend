const BASE_URL = process.env.REACT_APP_BASE_URL

// AGENCY END POINTS
export const agencyEndPoints = {
    REGISTER_API: BASE_URL + "/agency/registerAgency",
    LOGIN_API: BASE_URL + "/agency/loginAgency",
    UPDATE_PASSWORD_API: BASE_URL + "agency/updatePassword",
    UPDATE_AGENCY_INFO_API: BASE_URL + "agency/updateAgency",
    GET_AGENCY_RESOURCE_AND_DISASTER_API: BASE_URL + "agency/getAllAgencyLocations/:id",
    GET_ALL_AGENCY_LOCATIONS_API: BASE_URL + "agency/getAgencyResourcesAndDisasters",
}

// RESOURCE END POINTS
export const resourceEndPoints = {
    CREATE_RESOURCE_API: BASE_URL + "/resource/createResource",
    UPDATE_RESOURCE_API: BASE_URL + "/resource/updateResource/:id",
    GET_RESOURCE_API: BASE_URL + "resource/getResource/:resourceName",
    LIST_RESOURCES_API: BASE_URL + "resource/listResources",
    STATUS_OF_RESOURCES_API: BASE_URL + "resource/getResourceStatus",
    SHARE_RESOURCES_API: BASE_URL + "resource/shareResource",
    DELETE_RESOURCES_API: BASE_URL + "resource/deleteResource/:resourceId",
}

// DISASTER END POINTS
export const disasterEndPoints = {
    ADD_DISASTER_API: BASE_URL + "/disaster/addDisaster",
    UPDATE_DISASTER_API: BASE_URL + "/disaster/updateDisaster/:id",
    GET_DISASTER_API: BASE_URL + "disaster/getDisaster/:id",
    FETCH_ALL_DISASTERS_API: BASE_URL + "disaster/fetchDisasters",
    DELETE_DISASTER_API: BASE_URL + "disaster/deleteDisaster/:disasterId",
}

// ALERT END POINTS
export const alertEndPoints = {
    CREATE_ALERT_API: BASE_URL + "/alert/createalerts",
    GET_AGENCY_ALERTS_API: BASE_URL + "/alert/getalerts",
}