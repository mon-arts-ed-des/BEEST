const MAX_HIST = 20;
const UNSELECTED = "Select the item you wish to load..."
var historicalData = null
var histIndex = null;
var currentLocalSet = null

function getHistory(){
	return localStorage.getItem(localStorageHistory)
}
function setHistory(value){
	localStorage.setItem(localStorageHistory,value)
}

function initHistory(){
	historicalData = recoverHistory();
	if (historicalData == null){
		showRecoveryDate(0,historicalData) //should trigger 'none available'
	}
	else{
		histIndex = historicalData.length-1
		showRecoveryDate(histIndex,historicalData)
	}
	try{
		hideButton("loadHist")
	}catch{}
	try{
	hideButton("delHist")
	}catch{}
}

function idSelectedRecData(){
	histIndex = JSON.parse(document.getElementById("recoveryDate").value)
	if (histIndex == null){
		hideButton("delHist")
		return
	}
	else{
		showButton("delHist")
		getHistoryI(histIndex,historicalData)	
	}
}

function delHistI(){
	if (histIndex==null){
		console.error("unable to delete non-data from history")
	}
	else if (confirm("This will delete the selected record, click 'OK' to proceed")){
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
			if (element.hasOwnProperty("historyTitle")){
				heading = element.historyTitle
			}
			else{
				heading = element.mainHead
			}
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
	var startAt = aRecoveryDataSet.length-1
	var stopAt = Math.max(0,aRecoveryDataSet.length-MAX_HIST)
	if (aRecoveryDataSet.length>0){
		outputHTML += HTMLOption(null,UNSELECTED,true)
	}
	for (var dataI = startAt; dataI>=stopAt; dataI--){
		element = aRecoveryDataSet[dataI].toString()
		HTMLElement = HTMLOption(dataI,element,false)//dataI==selectedIndex)
		outputHTML+=HTMLElement
	}
	return outputHTML
}

function showRecoveryDate(index,history){
	try{
		if ((history==null)||(!history.hasOwnProperty("length"))||(history.length==0)){
			throw Error("localStorage is empty")
		}
		var recHistSet = new recoveryDataSet(history)
		var element = recHistSet[index]
		document.getElementById("recoveryDate").innerHTML = recoveryOptionGenerator(index,recHistSet)
	}
	catch (error){
		console.log(error)
		document.getElementById("recoveryDate").innerHTML = HTMLOption(null,"no history available",true)
		hideButton("delHist")
		hideButton("loadHist")
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

	function hideButton(id){
		document.getElementById(id).disabled = true
		hideHTML(id)
	}
	function showButton(id){
		document.getElementById(id).disabled = false
		showHTML(id)
  }
  
  
	function showHTML(id){
		htmlStyle(id,"display","")
	}
	function hideHTML(id){
		htmlStyle(id,"display","none")
	}
		
	function htmlStyle(id,styleName,styleResult){
		document.getElementById(id).style[styleName]=styleResult
	}

class modal{
	constructor(data){
		this.id=data.id //there will always be an id, allow to crash otherwise
		this.modal=null
		this.setData(data)
		this.build()
	}
	setData(data){
		for (var item in data){
			this[item] = data[item]
		}
	}
	buildButton(contents,action,colour){
		var result = '<button type="button" class="btn btn-'
		if (typeof(colour)!=='undefined'){
			result+=colour+'"'
		}
		else{
			result+='secondary"'
		}
		if (action=="close"){
			result+='data-dismiss="modal"'
		}
		else{
			result+='onclick="'+action
		}
		result+=contents+'</button>'
		return result
	}
	buildModalStart(){
		return '<div class="modal fade" id="'+this.id+'" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content">'
	}
	buildModalTitle(hasTitle){
		var result = '<div class="modal-header"><h5 class="modal-title" id="'+this.id+'Label">'
		if (hasTitle){
			result+=this.title
		}
		result += '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
		return result
	}
	buildModalBody(hasDescription,hasTextField,hasPlaceholder,hasPreview){
		var result = '<div class="modal-body">'
		if (hasDescription){
			var correctedDesc = this.description.replace('\n','<br>')
			result+=correctedDesc
		}
		if (hasTextField){
			if (hasDescription){
				result+='<BR>'
			}
			var placeholder = "Your text here"
			if (hasPlaceholder){
				placeholder = this.placeholder
			}
			result+='<textarea maxlength="75" class="rounded p-2 w-100 border border-dark" rows="1" name="modalTextArea" type="text" id="'+this.id+'TextField" placeholder="'+placeholder+'"'
			if (hasPreview){
				result+=' onchange="textFieldChanged()"'
			}
			result+='></textarea>'
		}
		result+='</div>'
		return result
	}
	textFieldChanged(){
		if (this.hasOwnProperty('args')){
			var changedVal = $('#'+this.id+'TextField').val()
			if (this.args.hasOwnProperty(0)){
				this.args[0] = changedVal
			}
			else{
				this.args = [changedVal]
			}
			setPreview()
		}
	}
	buildPreview(){
		var thePreview = ""
		var lastArg = this.previewResult.match(/(\$\d+)(?!.*\$\d)/) //match last $num
		lastArg = Number(lastArg[0].replace("$",""))
		
		thePreview = this.previewResult
		if (!(this.args.hasOwnProperty(0))){
			this.args = [this.args]
		}
		
		for (var argN=0; argN<lastArg; argN++){
			var repWith = "???";
			if (this.args.hasOwnProperty(argN)){
				repWith = this.args[argN]
			}
			thePreview = thePreview.replace("$"+(argN+1),repWith)
		}
		return thePreview
	}
	setPreview(){
		$('#'+this.id+"Preview").html(buildPreview())
	}
	buildModalFooter(hasPreview,hasButton){
		var result = ""
		if (hasButton || hasPreview){
			
			result+='<div class="modal-footer">'
			if (hasPreview){
				result+='<span id="'+this.id+'Preview">'
				result+=this.buildPreview()
				result+='</span>'
			}
			if (hasButton){
				for (var bId=0;bId<this.buttons.length;bId++){
					result+=this.buildButton(this.buttons[bId].text,this.buttons[bId].result,this.buttons[bId].colour)
				}
			}
			result+='</div>'
		}
		return result
	}
	build(){
		var hasButton = this.hasOwnProperty("buttons")
		var hasPreview = this.hasOwnProperty('previewResult')
		var hasTextField = this.hasOwnProperty('textField')
		hasTextField = hasTextField && this.textField
		var hasDescription = this.hasOwnProperty('description')
		var hasPlaceholder = this.hasOwnProperty('placeholder')
		var hasTitle = this.hasOwnProperty('title')
		
		this.modal = document.createElement('span')
		this.modal.setAttribute("id","modalContainer")
		
		var htmlModal = this.buildModalStart()
		
		htmlModal+= this.buildModalTitle(hasTitle)
		
		htmlModal+= this.buildModalBody(hasDescription,hasTextField,hasPlaceholder,hasPreview)
		
		htmlModal+=this.buildModalFooter(hasPreview,hasButton)
		
		this.modal.innerHTML=htmlModal+'</div></div></div>'
		
		document.body.appendChild(this.modal)
		this.hide()
	}
	display(){
		$('#'+this.id).modal('show')
	}
	hide(){
		$('#'+this.id).modal('hide')
	}
}

function savePopup(currentItem){
	theModal = new modal({
		id: "savePopup",
		title:"Save in browser",
		description: "Also save this element locally in this browser?\n\n Name:",
		textField: true,
		placeholder: currentItem,
		previewResult: "$1 ($2)",
		args:[currentItem.mainHead,currentItem.timestamp],
		buttons: [
			{
				text:"do not save",
				colour:"danger",
				result:"close"
			},
			{
				text:"save",
				colour:"success",
				result:"addToHistory_Aux(this.args[0])"
			}
		]
	})
	theModal.display()
}

function addToHistory_Aux(name){
	//currentLocalSet will have the most recent element added to the end and ready to updateCommands
	currentInstance = currentLocalSet.pop()
	currentInstance.historyTitle = name
	currentLocalSet.push(currentInstance)
	
	currentLocalSet = JSON.stringify(currentLocalSet) //now a string again -- currentInstance should have had its toString method called
	setHistory(currentLocalSet)
	historicalData = recoverHistory()
	histIndex = historicalData.length-1
	showRecoveryDate(histIndex,historicalData);
	showButton("delHist")
	//showButton("loadHist")
}
function addToHistory(currentInstance){
	currentLocalSet = getHistory()
	if ((currentLocalSet == undefined)||(currentLocalSet=="")){
		currentLocalSet = "[]"
		setHistory(currentLocalSet)
	}
	currentLocalSet = JSON.parse(currentLocalSet) //now an array of objects
	currentInstance = JSON.parse(JSON.stringify(currentInstance))
	currentInstance.timestamp = new Date()
	currentLocalSet.push(currentInstance)
	savePopup(currentInstance)
}