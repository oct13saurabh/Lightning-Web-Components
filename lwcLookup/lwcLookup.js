/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable eqeqeq */
import { LightningElement,api,track } from 'lwc';
import fetchRecords from '@salesforce/apex/CustomLookup.fetchRecords';

export default class LwcCustomLookup extends LightningElement {
    @api objectname = '';  // default is Account. Can be modified by parent cmp
    @api fieldname = '';      //default field is Name. Can be modified by parent cmp
    @api numrecords=10; // Number of records to be fetched from Apex while searching
    @api iconname = ''
    @api selectRecordId = '';
    @api selectRecordName;
    @api lookupstyle = 'width : 50%;';
    @track Label;
    @track searchRecords = [];
    @track LoadingText = false;
    @track txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    @track noResultFound = false;
    @track iconFlag =  true;
    @track clearIconFlag = false;
    @track inputReadOnly = false;
    
   

    searchField(event) {
        var searchTxt = event.target.value;
        this.LoadingText = true;
        
        fetchRecords({ ObjectName: this.objectname, field: this.fieldname, searchString: searchTxt , NumRecords : this.numrecords})
        .then(result => {
            this.searchRecords= result;
            this.LoadingText = false;
            
            this.txtclassname =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
            if(searchTxt.length > 0 && result.length == 0) {
                this.noResultFound = true;
            }
            else {
                this.noResultFound = false;
            }

            if(this.selectRecordId != null && this.selectRecordId.length > 0) {
                this.iconFlag = false;
                this.clearIconFlag = true;
            }
            else {
                this.iconFlag = true;
                this.clearIconFlag = false;
            }
        })
        .catch(error => {
            console.log('-------error-------------'+error);
            console.log(error);
        });        
    }
    
   setSelectedRecord(event) { 
        this.txtclassname =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        this.iconFlag = false;
        this.clearIconFlag = true;
        this.selectRecordName = event.currentTarget.dataset.name;        
        this.selectRecordId = event.currentTarget.dataset.id;
        this.inputReadOnly = true;
        const selectedEvent = new CustomEvent('selected', { detail: 
            {recordId : event.currentTarget.dataset.id,
            fieldValue : event.currentTarget.dataset.name}
        });
        this.dispatchEvent(selectedEvent);
    }
    
    resetData() {
        this.selectRecordName = "";
        this.selectRecordId = "";
        this.inputReadOnly = false;
        this.iconFlag = true;
        this.clearIconFlag = false;
        const selectedEvent = new CustomEvent('unselected', { detail: 
            {recordId : null,
            fieldValue : null}
        });
        this.dispatchEvent(selectedEvent);
    }

}