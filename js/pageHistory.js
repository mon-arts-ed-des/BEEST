var historicalData = null
var histIndex = 0;

function initHistory(){
	historicalData = recoverHistory();
	if (historicalData == null){
		showRecoveryDate(0,historicalData) //should trigger 'none available'
	}
	else{
		histIndex = historicalData.length-1
		showRecoveryDate(histIndex,historicalData)
	}
}

function idSelectedRecData(){
	histIndex = document.getElementById("recoveryDate").value
}

function delHistI(){
	if (confirm("This will delete the selected record, click 'OK' to proceed")){
		historicalData = recoverHistory()
		historicalData.splice(histIndex,1)
		setHistory(JSON.stringify(historicalData))
		histIndex= (historicalData.length>0 ? historicalData.length-1 : 0)
	}
	showRecoveryDate(histIndex,historicalData)
}

class recoveryData{
	constructor(name,timestamp){
		this.name = name
		this.timestamp = timestamp
	}
	toString(){
		var time = this.timestamp
		time = time.toLocaleDateString()+" "+time.toLocaleTimeString()
		return this.name+" ("+time+")"
	}
}
class recoveryDataSet{
	constructor(recoveryDataArray){
		var element;
		var time;
		var heading;
		this.length=0
		for (var recoveryI=0;recoveryI<recoveryDataArray.length;recoveryI++){
			element = recoveryDataArray[recoveryI]
			heading = element.mainHead
			time = new Date(element.timestamp)
			this[recoveryI] = new recoveryData(heading,time)
			this.length++
		}
	}
	toString(){
		return JSON.stringify(this.dataSet)
	}
}

function HTMLOption(value,inner,selected){
	return "<option "+(selected ? "selected " : "")+"value=\""+value+"\">"+inner+"</option>"
}

function recoveryOptionGenerator(selectedIndex,aRecoveryDataSet){
	var outputHTML = ""
	var element;
	var HTMLElement;
	for (var dataI = 0; dataI<aRecoveryDataSet.length; dataI++){
		element = aRecoveryDataSet[dataI].toString()
		HTMLElement = HTMLOption(dataI,element,dataI==selectedIndex)
		outputHTML+=HTMLElement
	}
	return outputHTML
}

function showRecoveryDate(index,history){
	try{
		if (history.length==0){
			throw Error("localStorage is empty")
		}
		var recHistSet = new recoveryDataSet(history)
		var element = recHistSet[index]
		document.getElementById("recoveryDate").innerHTML = recoveryOptionGenerator(index,recHistSet)
	}
	catch (error){
		console.error(error)
		document.getElementById("recoveryDate").innerHTML = HTMLOption(null,"no history available",true)
		hideButton("delHist")
	}
}
	
	
function recoverHistory(){
	/*get from local then populate the text fields*/
	var localSet = getHistory()
	if (localSet == undefined){
		return null
	}
	localSet = JSON.parse(localSet) //converted the string to an array of public objects
	return localSet
}

function addToHistory(currAccord){
	var localCurr = getHistory()
	if ((localCurr == undefined)||(localCurr=="")){
		localCurr = "[]"
		setHistory(localCurr)
	}
	localCurr = JSON.parse(localCurr) //now an array of objects
	localCurr.push(currAccord)
	localCurr = JSON.stringify(localCurr) //now a string again -- currAccord should have had its toString method called
	setHistory(localCurr)
	historicalData = recoverHistory()
	histIndex = historicalData.length-1
	showRecoveryDate(histIndex,historicalData);
	showButton("delHist")
}