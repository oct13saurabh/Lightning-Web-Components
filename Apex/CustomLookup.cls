public with sharing class CustomLookup {

    @AuraEnabled(cacheable=true)
    public static List<Records> fetchRecords( String ObjectName, String field, String searchString, Integer NumRecords ) {
        List<Records> recordsList = new List<Records>();

        try {
	        String query = 'SELECT Id, ' + field + ' FROM '+ objectName + ' WHERE '+ field +' LIKE ' +
             '\'' + String.escapeSingleQuotes(searchString.trim()) + '%\'' + ' LIMIT ' + NumRecords;
			System.debug(query);
	        for(SObject s : Database.query(query)){
	            Records record = new Records();
	            record.Id = String.valueOf(s.get('id'));
	            record.val = String.valueOf(s.get(field));
	            recordsList.add(record);
	        } 
	    } catch (Exception err) {	    	
                throw new AuraHandledException(err.getMessage());
        }
        
        return recordsList;
    }

    public class Records{
        @AuraEnabled public String Id {get;set;}
        @AuraEnabled public String val {get;set;}
    }
}