/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-debugger */
/* eslint-disable eqeqeq */
import { LightningElement, track, wire } from 'lwc';
import fetchAccountTable from '@salesforce/apex/AccountController.fetchAccountRecord';
/*
import ID_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import TYPE_FIELD from '@salesforce/schema/Account.Type';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
*/
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label : 'Id' , fieldName:'Id', editable: false },
    { label : 'Name' , fieldName : 'Name', editable: true },
    { label : 'Type' , fieldName : 'Type', editable: true },
    { label: 'Website', fieldName: 'Website', type: 'url', editable: true }
];

export default class EditableDataTable extends LightningElement {
    @track columns = columns;
    @track rowOffset = 0;
    @track tableLoadingState = false;
    @track accounts;
    @track err;
    @track offset=0;
    @track Prevoffset=0;
    @track rowOffset=0;
    @track draftValues = [];
    limit = 7;
    
    @wire(fetchAccountTable, { offset: '$offset', l : '$limit' }) wiredAcc;

    @wire(fetchAccountTable, { offset: '$offset', l : '$limit' }) wiredAccounts({ error, data }) {
        this.tableLoadingState = false;
        if (data) {
            this.accounts = data;
            this.err = undefined;
            if(this.accounts.length == 0)
                this.offset= this.Prevoffset;
        } else if (error) {
            this.err = error;            
            this.accounts = undefined;
        }
    }

    refresh() {
        return refreshApex(this.wiredAcc); 
    }

    handleSave(event){
        debugger;
        const recordInputs=event.detail.draftValues.slice().map(draft=>{
            const fields = Object.assign({},draft);
            return {fields};
        });

        const promises = recordInputs.map(recordInput=> updateRecord(recordInput));

        Promise.all(promises).then(()=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Success',
                    message : 'Records Saved',
                    variant : 'success'
                })
            );
            this.draftValues = [];
            return refreshApex(this.wiredAcc);
        }).catch(error=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Error Updating Record',
                    message : error.body.message,
                    variant : 'error'
                })
            );
        });
    }

    // Single record Save
    /*
    handleSave(event){
        debugger;
        const fields = {};
        fields[ID_FIELD.fieldApiName] =  event.detail.draftValues[0].Id;
        fields[NAME_FIELD.fieldApiName] = event.detail.draftValues[0].Name;
        fields[TYPE_FIELD.fieldApiName] = event.detail.draftValues[0].Type;
        fields[WEBSITE_FIELD.fieldApiName] = event.detail.draftValues[0].Website;

        const recordInput = {fields};

        updateRecord(recordInput)
        .then(()=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Success',
                    message : 'Record Update',
                    variant : 'success'
                })
            );
            this.draftValues = [];

            return refreshApex(this.wiredAcc); 
        }).catch(error =>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Error Updating Record',
                    message : error.body.message,
                    variant : 'error'
                })
            );
        });
    }*/

    handlePrev () {
        if(this.offset - this.limit >=0)
        {
            this.tableLoadingState = true;
            this.Prevoffset=this.offset;
            this.offset = this.offset - this.limit;
        }
    }

    handleNext () {
        this.tableLoadingState = true;
        this.Prevoffset=this.offset;
        this.offset = this.offset + this.limit;
    }
}