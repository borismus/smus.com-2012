(function() {

   	//results variables
  	var springKidAvg = 0;
  	var springClassAvg = 0;
  	
  	var summerKidAvg = 0;
  	var summerClassAvg = 0;

	var fallKidAvg = 0;
  	var fallClassAvg = 0;
  	
  	//count variables
  	var springCount= 0;
  	var summerCount=0;
  	var fallCount = 0;
  	
  	//picker variables
  	var pickerValue= $('#pt-graph-subjectpicker').val();
  	var buttonValue="All";
  	
  	//listeners for year and subject
  	$('#pt-graph-subjectpicker').change( function() { 
		pickerValue = $(this).val();
		init(); //always redraw graph when changed
	});
	
	$('#pt-graph-yearpicker a').click( function() { 
		$(this).addClass("ui-btn-active");   
		buttonValue = $(this).text();
		init(); //always redraw graph when clicked
	});
	
  var init = function() {
  
    $.getJSON('data/reports.json', function(data) {
    
      calculateAverage(pickerValue, buttonValue);
    });
  };
  
  var calculateAverage = function(pickerValue, buttonValue) {

    $.each(reports, function(index, item) {
    
      //search data by based on UI interactive elements
      if(item.subject == pickerValue && item.year ==buttonValue 
      || pickerValue == "All Subjects" && item.year == buttonValue 
      || pickerValue == "All Subjects" && buttonValue == "All"
      || item.subject == pickerValue && buttonValue == "All"  ) {
      	
      	//check what season in each element, so different means can be made
      	switch(item.season){
      	
      	case "spring": 
      	springCount = springCount +1;	
      	springKidAvg = springKidAvg+ parseGrade(item.grade); 
      	springClassAvg = springClassAvg + parseGrade(item.average);
      	break;
      	
      	case "summer":
      	summerCount = summerCount +1; 	
      	summerKidAvg = summerKidAvg+ parseGrade(item.grade); 
      	summerClassAvg = summerClassAvg + parseGrade(item.average);
      	break;
      	
      	case "fall":
      	fallCount = fallCount +1;
      	fallKidAvg = fallKidAvg+ parseGrade(item.grade); 
      	fallClassAvg = fallClassAvg + parseGrade(item.average);
      	break;
      	
      	default:
      	}        	
      	
      }
                 	
    });
    
     arithmeticMean();
     generateGraph();
     refreshVariables();
  };
  
  var arithmeticMean = function(){
  
  	 //division tweak
	 if(springCount == 0){
	  springCount = 1;
	 }
	  
	 if(summerCount == 0){
	  summerCount = 1;
	 }
	  
	if(fallCount == 0){
	  fallCount = 1;
	 }
  
	springKidAvg = springKidAvg/springCount;
	springClassAvg = springClassAvg/springCount;
	
	summerKidAvg = summerKidAvg/summerCount;
	summerClassAvg = summerClassAvg/summerCount;
	
	fallKidAvg = fallKidAvg/fallCount;
	fallClassAvg = fallClassAvg/fallCount;

 };
  
 
  var generateGraph= function(){
  	$('#pti-graph-img').attr("src", "http://chart.apis.google.com/chart"+
   "?chxl=0:|%2B|A|-|%2B|B|-|%2B|C|-|1:|Spring|Summer|Fall"+
   "&chxp=0,4,3.5,3,2.5,2,1.5,1,0.5,0"+
   "&chxr=0,0,4|1,1,3"+
   "&chxt=y,x"+
   "&chbh=a"+
   "&chs=250x225"+
   "&cht=bvg"+
   "&chco=A2C180,3D7930"+
   "&chds=0,4,0,4"+
   "&chd=t:"+springKidAvg+","+summerKidAvg+","+fallKidAvg+"|"+springClassAvg+","+summerClassAvg+","+fallClassAvg+
   "&chdl=Paulo|Average"+
   "&chg=0,4,1,7");
 	
  }; 
  
  var refreshVariables = function(){
  
  	springKidAvg = 0;
  	springClassAvg = 0;
  	
  	summerKidAvg = 0;
  	summerClassAvg = 0;

	fallKidAvg = 0;
  	fallClassAvg = 0;
  	
  	springCount= 0;
  	summerCount=0;
  	fallCount = 0;

  }
  
  //function that reads incoming json element grade and transforms into a number to calculate the mean properly
  var parseGrade = function(grade){
  
  	switch(grade){
  	
  	case "A+":
  	return 4;
  	break;
  	
  	case "A":
  	return 3.5;
  	break;
  	
  	case "A-":
  	return 3;
  	break;
  	
  	case "B+":
  	return 2.5;
  	break;
  	
  	case "B":
  	return 2;
  	break;
  	
  	case "B-":
  	return 1.5;
  	break;
  	
  	case "C+":
  	return 1;
  	break;
  	
  	case "C":
  	return 0.5;
  	break;
  	
  	case "C-":
  	return 0;
  	break;
  	
  	default:
  	return 0;
  	}
  	
  }
  
  // whenever this page is loaded, call init
  // scriptCache.onPageLoad('item.html', refresh);
  // call init the first time it's loaded too
  init();
})();