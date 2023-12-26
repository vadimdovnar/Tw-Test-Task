@isTest(SeeAllData=true)
// We use real data in Salesforce, since we need to get records for the past week
public class AccountCasesPdfCtrlTest {
  @isTest
  static void getAccountCasesPrevWeekTest() {
    AccountCasesPdfCtrl controller = new AccountCasesPdfCtrl();
    List<Case> result = controller.getAccountCasesPrevWeek();
    System.assertNotEquals(0, result.size(), 'There should be at least one case in the last week.');
  }
}
