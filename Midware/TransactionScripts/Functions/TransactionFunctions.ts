/**
 * @author Midware
 * @developer Ignacio A.
 * @contact contact@midware.net
 */

import * as https from "N/https";
import * as search from "N/search";

const queriesCache = {};

export function getCustomerMinimumOrderAmount(customerId: number) {
    if (queriesCache[`${customerId}-custentity_mw_minimum_order_amount`]) {
        const { executionTime, value } = queriesCache[`${customerId}-custentity_mw_minimum_order_amount`];

        const currentTime = Date.now();
        const cacheExpirationTime = 0; //2 * 60 * 1000; // 2 minutes in milliseconds

        if (currentTime - executionTime < cacheExpirationTime) {
            return value;
        }
    }

    const customerLookup = search.lookupFields({
        type: search.Type.CUSTOMER,
        id: customerId,
        columns: ["custentity_mw_minimum_order_amount"],
    });

    const minimumOrderQuantity =
        customerLookup && customerLookup.custentity_mw_minimum_order_amount
            ? Number(customerLookup.custentity_mw_minimum_order_amount)
            : getGlobalCustomerMinimumOrderAmount();

    queriesCache[`${customerId}-custentity_mw_minimum_order_amount`] = {
        executionTime: Date.now(),
        value: minimumOrderQuantity,
    };

    return minimumOrderQuantity;
}

function getGlobalCustomerMinimumOrderAmount() {
    const response = https.requestSuitelet({
        scriptId: "customscript_mw_comp_info_st",
        deploymentId: "customdeploy_mw_comp_info_st_d",
    });

    if (response) {
        return Number(response.body);
    }

    return 0;
}
