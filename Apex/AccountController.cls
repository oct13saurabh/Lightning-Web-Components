public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> fetchAccountRecord(Integer offset, Integer l){
        return [Select Id, Name, Website, Type from Account limit :l  offset :offset ];
    }
}