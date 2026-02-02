/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Ignacio A.
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "./Functions/TransactionFunctions"], function (require, exports, log, TransactionFunctions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.saveRecord = void 0;
    function saveRecord(pContext) {
        try {
            var currentRecord = pContext.currentRecord;
            var customerOverride = currentRecord.getValue({ fieldId: "custbody_mw_order_amount_override" });
            var subTotal = currentRecord.getValue({ fieldId: "subtotal" });
            var eSurcharge = currentRecord.getValue({ fieldId: "shippingcost" });
            log.debug("[saveRecord] customerOverride", customerOverride);
            log.debug("[saveRecord] totalAmount", subTotal);
            log.debug("[saveRecord] eSurcharge", eSurcharge);
            var totalAmount = Number(subTotal) + Number(eSurcharge);
            if (!customerOverride) {
                var customer = currentRecord.getValue({ fieldId: "entity" });
                var customerMinimumOrderAmount = (0, TransactionFunctions_1.getCustomerMinimumOrderAmount)(customer);
                log.debug("[saveRecord] customerMinimumOrderAmount", customerMinimumOrderAmount);
                if (Number(totalAmount) < customerMinimumOrderAmount) {
                    var response = confirm("This customer minimum order amount is ".concat(formatAsCurrency(customerMinimumOrderAmount), ". Do you want to continue?"));
                    currentRecord.setValue({ fieldId: "custbody_mw_complement_order_min", value: response });
                    return response;
                }
                else {
                    currentRecord.setValue({ fieldId: "custbody_mw_complement_order_min", value: false });
                }
            }
            return true;
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.saveRecord = saveRecord;
    function formatAsCurrency(value) {
        return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    }
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
