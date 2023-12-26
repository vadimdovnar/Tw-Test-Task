public inherited sharing class ServiceCaseQueueService {

    @AuraEnabled(cacheable=true)
    public static List<Case> getUserCases() {
        // Owner_Index_Formula__c is a formula field that is indexed depending on the user context from which the code is executed
        // Priority_Index_Formula__c is a formula field that is indexed depending on the Case Priority values (0 High -> 1 Medium -> 2 Low) 
        List<Case> cases = [SELECT Id, CaseNumber, Owner.Name, Status, Priority, Origin FROM Case ORDER BY Owner_Index_Formula__c, Priority_Index_Formula__c, CreatedDate DESC LIMIT 25];
        return cases;
    }
}