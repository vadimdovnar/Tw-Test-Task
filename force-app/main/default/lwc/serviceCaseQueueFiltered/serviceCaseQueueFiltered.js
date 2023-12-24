import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getUserCases from '@salesforce/apex/ServiceCaseQueueService.getUserCases';

export default class ServiceCaseQueueFiltered extends NavigationMixin(LightningElement) {
    
    data;
    error;
    @api recordId;

    // ========================REACTIVE TOOLING:==========================
    @wire(getUserCases)
    cases( {error, data} ) {
        this.data = data ? data : undefined;
        this.error = error ? error : undefined;
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
        }, {
            target: '_blank'
        });
    }
    // =====================================================================
}