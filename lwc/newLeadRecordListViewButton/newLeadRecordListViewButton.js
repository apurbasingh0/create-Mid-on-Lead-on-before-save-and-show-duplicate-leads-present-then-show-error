/*
    @description       : Lighting web Component for New Lead List View Button
    @author            : Apurba Singh, Appstrail             
    @last modified on  : 23-05-2023
    @last modified by  : Apurba Singh, Appstrail
    Modifications Log 
    Ver   Date         Author          Modification
    1.0   25-05-2023   Apurba Singh   Initial Version
*/
import { LightningElement,api,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import creationMid from '@salesforce/apex/leadRecordListCreation.creationMid';
import getDuplicateRecordsLead from '@salesforce/apex/leadRecordListCreation.getDuplicateRecordsLead';
import getDuplicateRecordsAccount from '@salesforce/apex/leadRecordListCreation.getDuplicateRecordsAccount';

export default class NewLeadRecordListViewButton extends NavigationMixin(LightningElement) {
    @api recordId;
    @track isLoading = false;
    @track isLoading2 = false;
    @track isDuplicate = false;
    @track thedisableok = true;
    @track duplicateView = false;
    @track isrecordform = true;
    @track duplicateList = [];
    @track duplicateListAccount = [];
    @track LeadReq={Name:'',Email:'',MobilePhone:''};
   
    
    handleSubmit(event) {
        event.preventDefault();
        console.log('Enter into submit'+JSON.stringify(event.detail.fields));
        this.fetchMIDFunction(event);
        
    }

    // handleError(error) {
    //     this.isLoading = false;
    //     this.isrecordform = true;
    //     console.log('onerror event recordEditForm', error);
    //     let errorMessage = 'An error occurred. Please try again.';
        
    //     if (error.body && error.body.message && error.body.message.includes('specific validation error message')) {
    //         errorMessage = 'Specific validation error message';
    //     }
        
    //     this.showToastMessage('error', errorMessage, 'error');
    // }

    handleSuccess(event) {
        console.log('onsuccess event recordEditForm',event.detail.id);
        console.log('isLoading1st',this.isLoading);
        console.log('recordId',this.recordId);
        console.log('isLoading2',this.isLoading);
        this.isLoading = false;
        this.showToastMessage('success','Record created successfully','success');
        this.handlenavigateView(event); 
        // window.location.reload();
        // window.top.reload();
        this.isrecordform =true;
    }

    //Api calling through fetchMIDFunction 
    fetchMIDFunction(event){
        this.LeadReq.Name=event.detail.fields.Salutation+' '+event.detail.fields.LastName;
        this.LeadReq.Email=event.detail.fields.Email; 
        this.LeadReq.MobilePhone=event.detail.fields.MobilePhone;
        console.log('nAME',this.LeadReq.Name);
        console.log('EMAIL',event.detail.fields.Email);
        console.log('MOBILE PHONE',this.LeadReq.MobilePhone);

        if (
            !event.detail.fields.Email ||
            !event.detail.fields.LeadSource ||
            !event.detail.fields.Lead_Type__c
          ) {
            this.isrecordform = true;
            this.showToastMessage('Error', 'Email, Lead Type, and Lead Source Fields Cannot Be Empty', 'error');
          }
          else{

            this.checkDuplicateRecords(this.LeadReq.Email); 
            this.checkDuplicateRecordsAccount(this.LeadReq.Email); 
          }

       

        creationMid({ pName: this.LeadReq.Name, pEmail: this.LeadReq.Email, pMobilePhone: this.LeadReq.MobilePhone,LeadId : null})
            .then(result => {
                event.detail.fields.MID__c = result;
                console.log('API call success:'+ result+" "+event.detail.fields.MID__c); 
                this.template.querySelector('lightning-record-form').submit(event.detail.fields); 
                this.isLoading = true;
                //this.showToastMessage('success','Record created successfully','success');
                this.isrecordform = false;
                this.isDuplicate = false;
            })
            .catch(error => {
                this.isLoading = false;
                // if (event.detail.fields.Email == null || (event.detail.fields.LeadSource).value === null || (event.detail.fields.Lead_Type__c).value === null) {
                //     this.isrecordform = true;
                //     this.showToastMessage('Error', 'Email, Lead Type and Lead Source Field Cannot Be Empty', 'error');
                // }
                // else{ 
                    this.isrecordform = true;
                    this.showToastMessage('Error', 'Cannot Save This Record. Please Enter Correct Value.', 'error');
                    console.log('API call error:', error);
               
            });
    }

    alerts(){
        this.thedisableok = !this.thedisableok ;
    }

    canceldup(){
        this.duplicateView = false;        
        this.isDuplicate = false;
        this.isLoading = false;
       
    }

    duplicateDetails(){
        this.duplicateView = true;
        console.log('isLoading2',this.isLoading);
        setTimeout(() => {
            this.isLoading2 = true;
            
        }, "1000");
        console.log('isLoading2',this.isLoading);
    }
    
   //checking leads duplicates
    checkDuplicateRecords() {
        //this.LeadReq.Email=event.detail.fields.Email; 
        getDuplicateRecordsLead({ email: this.LeadReq.Email })
        .then((result) => {
            if (result && result.length > 0) {
                // Duplicate records found
                this.isDuplicate = true;
                this.isLoading2 = false;
                this.duplicateList = result; 
                console.log("Duplicate list"+JSON.stringify(this.duplicateList));
                this.showToastMessage('Duplicate Records', 'Duplicate records found.', 'warning');
            } 
        })
        .catch((error) => {
            console.error('Error retrieving duplicate records:', error);
        });
        
    }
    
    //checking accounts duplicates
    checkDuplicateRecordsAccount(){
       // this.LeadReq.Email=event.detail.fields.Email;
        console.log("this.LeadReq.Email for account",this.LeadReq.Email);  
        getDuplicateRecordsAccount({ email: this.LeadReq.Email })
        .then((result) => {
            if (result && result.length > 0) {
                this.isDuplicate = true;
                this.isLoading2 = false;
                this.duplicateListAccount = result; 
                console.log("Duplicate list for account"+JSON.stringify(this.duplicateListAccount));
            } 
        })
        .catch((error) => {
            console.error('Error retrieving duplicate records:', error);
        });
    }

    leadduplinavigation(event){
        this.isLoading2 = true;
        const leadid =event.currentTarget.dataset.id;
        console.log("leadid" +leadid);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
            recordId: leadid,
            objectApiName: 'Lead',
            actionName: 'view'
            }
        }); 
       
        this.duplicateView = false;
        this.isDuplicate = false; 
        this.isrecordform = false;
        console.log('isrecordform',this.isrecordform);
        this.isrecordform = true;
        console.log('isrecordform',this.isrecordform);

    }

    accountduplinavigation(event){
        this.isLoading2 = true;
        const accid =event.currentTarget.dataset.id;
        console.log("accid" +accid);
        
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
            recordId: accid,
            objectApiName: 'Account',
            actionName: 'view'
            }
        });
        
        this.duplicateView = false; 
        this.isDuplicate = false;
        this.isrecordform = false; 
        this.isrecordform = true;
       
    }

    handlenavigateView(event){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
            recordId: event.detail.id,
            objectApiName: 'Lead',
            actionName: 'view'
            }
        }); 
    }

    handleCancel(){
        this.isrecordform = false;
        this.isDuplicate = false;
        this.navigateToLeadListView();
        this.isrecordform = true;      
       
    }

    showToastMessage(type, message, variant, mode) {
        const evt = new ShowToastEvent({
        title: type,
        message: message,
        variant: variant,
        mode: mode
        });
        this.dispatchEvent(evt);
    }

    navigateToLeadListView() {
        this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
        objectApiName: 'Lead',
        actionName: 'list'
        }
        });
    }
}