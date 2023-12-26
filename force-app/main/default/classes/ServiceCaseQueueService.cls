public inherited sharing class ServiceCaseQueueService {
  @AuraEnabled(cacheable=true)
  public static List<Case> getUserCases() {
    Id currentUserId = UserInfo.getUserId();
    List<GroupMember> groupMembers = getGroups(currentUserId);

    List<Id> userOrGroupIds = new List<Id>();
    for (GroupMember groupMember : groupMembers) {
      userOrGroupIds.add(groupMember.GroupId);
    }
    // Owner_Index_Formula__c is a formula field that is indexed depending on the user context from which the code is executed
    // Priority_Index_Formula__c is a formula field that is indexed depending on the Case Priority values (0 High -> 1 Medium -> 2 Low)
    List<Case> cases = [
      SELECT Id, CaseNumber, Owner.Name, Status, Priority, Origin
      FROM Case
      WHERE OwnerId =: currentUserId OR (Owner.Type = 'Queue' AND OwnerId IN :userOrGroupIds)
      ORDER BY Owner_Index_Formula__c, Priority_Index_Formula__c, CreatedDate DESC
      LIMIT 25
    ];
    return cases;
  }

  private static List<GroupMember> getGroups(Id userId) {
    return [SELECT Id, GroupId, UserOrGroupId FROM GroupMember WHERE UserOrGroupId = :userId];
  }
}