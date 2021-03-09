const MAX_HIST = 20;
const UNSELECTED = "Select the item you wish to load..."
var historicalData = null
var histIndex = null;
var currentLocalSet = null
var theModal = null;

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
	/*
	arguments set through data (all optional unless otherwise specified, some may be replaced with placeholders if blank)
		id [required]: a unique ID for this modal
		
		title: text to appear at top of modal
		
***		description: text to appear within body of the modal. use <BR>'s for new lines and include special  codes (@ followed by a digit) to place text fields within the description text
		
***		textField: the number of text fields to include (if no @ codes included in description, these appear at the end of the body of the modal). Note: you can find the values in these text fields at any time using the modal instance's     .args[index]    the index will match that of the text field
		
***		placeholder: an array of text field placeholders (in order of appearance) e.g. ['your text here', 'your name', ...]. Note: if there are fewer placeholders than text fields, the last placeholder is repeated
		
		previewResult: the format for previewing the results - use dollar codes ($ followed by a digit) to specify which of the args to use where within the preview e.g. "$1 ($2)" with the first and second args as 'hello' and 'world' would be "hello (world)". Note: if you are using textfields but want arguments which aren't changed by these, you will need more arguments than text fields (e.g. $7 if there was just 1 text field would refer to your 7th argument only and would not change with user entry)
		
		args: an array of data the modal will have access to. Note: if you have text fields, the ones of these matching a text field number (e.g. arg 3 to the third text field) will be overwritten by the user. You do not need to specify these if you wish (e.g. [,,'non text field argument'] if there were 2 text fields) and they will be updated when the user enters something into the field
		
		buttons: an array of button objects in order of appearance in the footer of the modal. a button object has the form {text: TEXT TO APPEAR IN BUTTON, colour: BOOTSTRAP COLOUR CLASS, result: FUNCTION TO TRIGGER OR 'close' TO CANCEL} e.g. {text:'save',colour:'success',result:'doThing()'} or {text:'cancel',colour:'danger',result:'close'}	
	*/
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
		result+=' data-dismiss="modal"'
		if (action!=="close"){
			result+=' onclick="'+action+'"'
		}
		result+='>'+contents+'</button>'
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
	buildTextField(index,placeholder,hasPreview){
		var result = ""
		var thisPlace = placeholder[placeholder.length-1]
		if (placeholder.length > index){
			thisPlace = placeholder[index]
		}
		
		result+='<textarea maxlength="75" class="rounded p-2 w-100 border border-dark" rows="1" name="modalTextArea" type="text" id="'+this.id+'TextField'+index+'" placeholder="'+thisPlace+'"'
		if (hasPreview){
			result+=' onkeyup="theModal.textFieldChanged('+hasPreview+','+index+')"'
		}
		result+='></textarea>'
		
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
			if (!(Array.isArray(placeholder))){
				placeholder = [placeholder]
			}
			for (var textFieldIndex = 0; textFieldIndex<this.textField;textFieldIndex++){
				result += this.buildTextField(textFieldIndex,placeholder,hasPreview)
			}
			
		}
		
		if (hasPreview){
			result+="<BR><BR>"
			result+='<span><b>Preview:</b></span><table border=1><tbody><tr><td><span style="font-size: large" id="'+this.id+'Preview">'
			result+=this.buildPreview()
			result+='</span></td></tr></tbody></table>'
		}
		
		result+='</div>'
		return result
	}
	textFieldChanged(hasPreview,index){
		var changedVal = $('#'+this.id+'TextField'+index).val()
		if (this.hasOwnProperty('args')){
			if (!(Array.isArray(this.args))){
				this.args = [this.args]
			}
		}
		else{
			this.args = []
		}
		this.args[index] = changedVal
		if (hasPreview){
			this.setPreview()
		}
	}
	replaceCodeWith(string,codePrefix,replaceList){
		
		
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
		$('#'+this.id+"Preview").html(this.buildPreview())
	}
	buildModalFooter(hasPreview,hasButton){
		var result = ""
		if (hasButton){
			result+='<div class="modal-footer">'

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
		$("#modalContainer").remove() //in case one already exists
		var hasButton = this.hasOwnProperty("buttons")
		var hasPreview = this.hasOwnProperty('previewResult')
		var hasTextField = this.hasOwnProperty('textField')
		hasTextField = hasTextField && (this.textField>0)
		var hasDescription = this.hasOwnProperty('description')
		var hasPlaceholder = this.hasOwnProperty('placeholder')
		var hasTitle = this.hasOwnProperty('title')
		
		this.modal = document.createElement('span')
		this.modal.setAttribute("id","modalContainer")
		
		var htmlModal = this.buildModalStart()
		
		htmlModal+= this.buildModalTitle(hasTitle)
		
		htmlModal+= this.buildModalBody(hasDescription,hasTextField,hasPlaceholder,hasPreview)
		
		htmlModal+=this.buildModalFooter(hasPreview,hasButton)
		htmlModal += '</div></div></div>'
		
		this.modal.innerHTML=htmlModal
		
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
	var send_placeholder = currentItem.mainHead
	if ((send_placeholder == undefined)||(send_placeholder=="")){
		send_placeholder = "[placeholder]"
	}
	var time = currentItem.timestamp
	time = time.toLocaleDateString() + " " + time.toLocaleTimeString()
	var data = {
		id: "savePopup",
		title:"Save in browser?",
		description: "<b>Code copied!</b><br><br>Save this element in your browser?<br><br>Name:",
		textField: 1,
		placeholder: send_placeholder,
		previewResult: "$1 ($2)",
		args:[currentItem.mainHead,time],
		buttons: [
			{
				text:"cancel",
				colour:"danger",
				result:"close"
			},
			{
				text:"save",
				colour:"success",
				result:"addToHistory_Aux(theModal.args[0])"
			}
		]
	}
	if (theModal==null){
		theModal = new modal(data)
	}
	else{
		theModal.setData(data)
		theModal.build()
	}
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