import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import CASE_ID from "@salesforce/schema/Case.Id";
import STATUS_FIELD from "@salesforce/schema/Case.Status";
import getUserCases from '@salesforce/apex/ServiceCaseQueueService.getUserCases';



export default class ServiceCaseQueueFiltered extends NavigationMixin(LightningElement) {
    
    cases;
    wiredCasesResult;
    error;
    isCaseStatusUpdating = false;
    caseStatusPicklistValues = [];

    // ========================REACTIVE TOOLING:==========================
    @wire(getUserCases)
    wiredCases(result) {
        console.log('DATA::::::: ' , result.data);
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
        const caseNumber = event.target.getAttribute('data-casenumber');
        try {
            await this.updateCaseStatus(selectedValue, caseId);
            this.showNotification('Success', `Case Number "${caseNumber}" updated successfully, new value of Case Status is "${selectedValue}"`, 'success');
        } catch (error) {
            this.showNotification('Error', `Case Number "${caseNumber}" was not updated successfully`, 'error');
            console.error('Error updating record:', error);
        }
    }

    handleRefresh = async () => {
        this.isCaseStatusUpdating = true;
        await this.refreshData();
    };
    // =====================================================================

    // ================================ASYNC================================
    updateCaseStatus = async (newStatusValue, caseId) => {
        this.isCaseStatusUpdating = true;
        const fields = {};
        fields[CASE_ID.fieldApiName] = caseId;
        fields[STATUS_FIELD.fieldApiName] = newStatusValue;
        await updateRecord( {fields} );
        await this.refreshData();
    }
    async refreshData() {
        return new Promise((resolve, reject) => {
            refreshApex(this.wiredCasesResult)
                .then(() => resolve())
                .catch(error => reject(error))
                .finally(() => {
                    this.isCaseStatusUpdating = false
                });
        });
    }
    // =====================================================================
    showNotification(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}