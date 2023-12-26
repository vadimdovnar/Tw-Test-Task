// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

string tempvar = 'Enter_your_name_here';
System.debug('Hello World!');
System.debug('My name is ' + tempvar);

Id currentUserId = UserInfo.getUserId();
System.debug('USER ID::::: ' + currentUserId);
List<Case> cases = [SELECT Id, Owner.Name, Owner_Index_Formula__c, Priority_Index_Formula__c, Priority FROM Case ORDER BY Owner_Index_Formula__c, Priority_Index_Formula__c];
System.debug('SIZE:::::; ' + cases.size());
for(Case c : cases) {
    System.debug('RECORD:::::; ' + c + ' ' + c.Owner.Name + ' ' + ' ' + c.Priority);
}

List<Case> result = AccountCasesPdfCtrl.getAccountCasesPrevWeek();
for (Case c : result) {
    System.debug('DATA::::::: ' + c.Account.Name + ' ' + c.Account.Owner.Name + ' ' + c.CaseNumber + ' ' + c.CreatedDate);
}
