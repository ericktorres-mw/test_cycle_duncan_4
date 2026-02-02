/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @author Midware
 * @developer Ignacio A.
 * @contact contact@midware.net
 */
define(["require", "exports", "N/log", "./Functions/TransactionFunctions"], function (require, exports, log, TransactionFunctions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.beforeSubmit = exports.beforeLoad = void 0;
    function beforeLoad(pContext) {
        try {
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeLoad = beforeLoad;
    function beforeSubmit(pContext) {
        try {
            var newRecord = pContext.newRecord, type = pContext.type, UserEventType = pContext.UserEventType;
            var isCreateMode = type === UserEventType.CREATE;
            var isEditMode = type === UserEventType.EDIT;
            if (!isCreateMode && !isEditMode)
                return;
            var complementOrderMin = newRecord.getValue({
                fieldId: "custbody_mw_complement_order_min",
            });
            if (complementOrderMin) {
                var customerId = newRecord.getValue({ fieldId: "entity" });
                var minAmount = (0, TransactionFunctions_1.getCustomerMinimumOrderAmount)(customerId);
                var subTotal = newRecord.getValue({ fieldId: "subtotal" });
                //const eSurcharge = newRecord.getValue({ fieldId: "shippingcost" });
                var currentTotal = Number(subTotal); // + Number(eSurcharge);
                var complementaryMinAmount = Number(minAmount) - Number(currentTotal);
                if (complementaryMinAmount <= 0) {
                    return;
                }
                newRecord.insertLine({ sublistId: "item", line: 0 });
                newRecord.setSublistValue({
                    sublistId: "item",
                    fieldId: "item",
                    line: 0,
                    value: 329, //TODO: check id on Prod
                });
                newRecord.setSublistValue({
                    sublistId: "item",
                    fieldId: "custcol_mw_bill_by",
                    line: 0,
                    value: null,
                });
                newRecord.setSublistValue({
                    sublistId: "item",
                    fieldId: "quantity",
                    line: 0,
                    value: 1,
                });
                newRecord.setSublistValue({
                    sublistId: "item",
                    fieldId: "description",
                    line: 0,
                    value: "Minimum Order Charge",
                });
                newRecord.setSublistValue({
                    sublistId: "item",
                    fieldId: "rate",
                    line: 0,
                    value: complementaryMinAmount,
                });
                newRecord.commitLine({ sublistId: "item" });
            }
        }
        catch (error) {
            handleError(error);
        }
    }
    exports.beforeSubmit = beforeSubmit;
    function handleError(pError) {
        log.error({ title: "Error", details: pError.message });
        log.error({ title: "Stack", details: JSON.stringify(pError) });
    }
});
