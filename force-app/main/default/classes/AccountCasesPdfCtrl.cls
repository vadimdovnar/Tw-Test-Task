public without sharing class AccountCasesPdfCtrl {
  public static List<Case> getAccountCasesPrevWeek() {
    List<Case> cases = [
      SELECT Id, Account.Name, Account.Owner.Name, CaseNumber, Status, Priority, Origin
      FROM Case
      WHERE CreatedDate >= LAST_WEEK AND CreatedDate < THIS_WEEK
      ORDER BY Account.Name, Account.Owner.Name
    ];
    return cases;
  }
}
