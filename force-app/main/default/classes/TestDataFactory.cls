@isTest
public class TestDataFactory {
  public static List<User> createTestUsers(Integer numberOfUsers) {
    List<User> testUsers = new List<User>();

    for (Integer i = 0; i < numberOfUsers; i++) {
      User testUser = new User(
        FirstName = 'Test',
        LastName = 'User' + i,
        Email = 'testuser' + i + '@etest.com',
        Username = 'testuser' + i + '@etest.com',
        Alias = 'TUser' + i,
        CommunityNickname = 'testuser' + i,
        ProfileId = [SELECT Id FROM Profile WHERE Name = 'Service Agent' LIMIT 1]
        .Id,
        EmailEncodingKey = 'UTF-8',
        LanguageLocaleKey = 'en_US',
        LocaleSidKey = 'en_US',
        TimeZoneSidKey = 'America/Los_Angeles'
      );
      testUsers.add(testUser);
    }

    insert testUsers;
    return testUsers;
  }

  public static List<Case> createTestCases(Integer numberOfCases, Id ownerId) {
    List<Case> testCases = new List<Case>();

    for (Integer i = 0; i < numberOfCases; i++) {
      Case testCase = new Case(Subject = 'Test Case ' + i, OwnerId = ownerId, Status = 'New', Priority = 'Low', Origin = 'Web');
      testCases.add(testCase);
    }

    insert testCases;
    return testCases;
  }
}
