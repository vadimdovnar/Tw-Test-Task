@isTest
public class ServiceCaseQueueServiceTest {
    @isTest
    static void getUserCasesPositiveTest() {
        List<User> testUsers = TestDataFactory.createTestUsers(1);
        List<Case> testCases = TestDataFactory.createTestCases(25, testUsers[0].Id);

        System.runAs(testUsers[0]) {
            List<Case> result = ServiceCaseQueueService.getUserCases();
            System.assertEquals(25, result.size());
        }
    }

    @isTest
    static void getUserCasesNegativeTest() {
        List<Case> result = ServiceCaseQueueService.getUserCases();
        System.assertEquals(0, result.size());
    }
}