import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { updateRecord } from "lightning/uiRecordApi";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import CASE_ID from "@salesforce/schema/Case.Id";
import STATUS_FIELD from "@salesforce/schema/Case.Status";
import getUserCases from '@salesforce/apex/ServiceCaseQueueService.getUserCases';

import { refreshApex } from "@salesforce/apex";

export default class ServiceCaseQueueFiltered extends NavigationMixin(LightningElement) {
    
    cases;
    wiredCasesResult;
    error;
    isCaseStatusUpdating = false;
    caseStatusPicklistValues = [];

    // ========================REACTIVE TOOLING:==========================
    @wire(getUserCases)
    wiredCases(result) {
        this.isCaseStatusUpdating = true;
        if(result.data) {
            this.wiredCasesResult = result;
            this.cases = result
            this.isCaseStatusUpdating = false;
        } else if(result.error) {
            this.error = result.error;
            this.isCaseStatusUpdating = false;
        }
    }

    @wire(getPicklistValues, { recordTypeId: "012000000000000AAA", fieldApiName: STATUS_FIELD })
    statusPicklistValues( {error, data} ) {
        if (data) {
            this.caseStatusPicklistValues = data.values.map(item => ({
              label: item.label,
              value: item.value
            }));
        } else if (error) {
            console.error('Error fetching picklist values:', error);
        }
    }
    // ===================================================================

    // =============================HANDLERS:===============================
    handleNavigateToCaseRecordView(event){
        const caseId = event.target.getAttribute('data-id');
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: caseId,
                objectApiName: 'Case',
                actionName: 'view'
            },
        });
    }
    handlePicklistChange = async (event) => {
        const selectedValue = event.detail.value;
        const caseId = event.target.getAttribute('data-id');
        try {
            await this.updateCaseStatus(selectedValue, caseId);
            this.showToast('Success', 'Record updated successfully', 'success');
        } catch (error) {
            this.showToast('Error', 'Error updating record', 'error');
            console.error('Error updating record:', error);
        }
    }
    // =====================================================================

    // ================================ASYNC================================
    updateCaseStatus = async (newStatusValue, caseId) => {
        this.isCaseStatusUpdating = true;
        const fields = {};
        fields[CASE_ID.fieldApiName] = caseId;
        fields[STATUS_FIELD.fieldApiName] = newStatusValue;
        await updateRecord( {fields} );
        return refreshApex(this.wiredCasesResult);
    }
    // =====================================================================
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}