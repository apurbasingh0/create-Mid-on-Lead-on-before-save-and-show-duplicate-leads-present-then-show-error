/*
    @description       : apex class for creating mid id on the submit time 
    @author            : Apurba Singh, Appstrail             
    @last modified on  : 25-05-2023
    @last modified by  : Apurba Singh, Appstrail
    Modifications Log 
    Ver   Date         Author          Modification
    1.0   25-05-2023   Apurba Singh   Initial Version
*/
public without sharing class leadRecordListCreation {

    @AuraEnabled
    public static String creationMid(String pName, String pEmail, String pMobilePhone){
        try{
        System.debug('newLeadvalues for Name:;'+pName);
        System.debug('newLeadvalues for EMail:;'+pEmail);
        System.debug('newLeadvalues for MobilePhone:;'+pMobilePhone);
            String mid = null;
            String phone;
            if(String.isBlank(pMobilePhone)){
                phone = '0000000000'; 
            }
            else{
                phone = pMobilePhone;
            }
            mid =  PostAddMerchantAPIClass.leadCreation_Method_Callout(pName,pEmail,phone,null); 
      
            if(mid == null){
                throw new AuraHandledException('Mid Failed to Create');
            }
            
            List<Lead> lmid= [SELECT Id,MID__c FROM LEAD Where MID__c =: mid];
            List<Account> amid = [SELECT Id, MID__c FROM Account Where MID__c =: mid];   
            if(lmid.size() != 0 || amid.size() != 0){
                System.debug('Condition Passed::::');
                throw new AuraHandledException('Mid Already Registered');
            }
            return mid;
        }catch(Exception e){
            System.debug('Error::::'+ e.getMessage()+' '+e.getLineNumber()+' '+e.getCause());
               throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<SObject> getDuplicateRecordsLead(String email) {
        List<SObject> duplicateRecords = new List<SObject>();
        
        List<Lead> duplicateLeads = [SELECT Id, Lead_ID_Formula__c,lead_ID__c, Name, Email, Company, Products_Interested_in__c,Status, LeadSource, Action_Type__c, 
                                        Lead_Type__c, Owner.Alias
                                     FROM Lead
                                     WHERE Email = :email];
        duplicateRecords.addAll(duplicateLeads);
        
        return duplicateRecords;
    }

    @AuraEnabled
    public static List<SObject> getDuplicateRecordsAccount(String email) {
        List<SObject> duplicateRecords = new List<SObject>();
    
        List<Account> duplicateAccounts = [SELECT Id, Name, Account_ID_Formula__c,Account_ID__c, Primary_SPOC_Email__c, Phone, Territory__c, MID__c, Industry, Type, Owner.Alias
                                           FROM Account
                                           WHERE Primary_SPOC_Email__c = :email];
        duplicateRecords.addAll(duplicateAccounts);
        
        return duplicateRecords;
    }

}