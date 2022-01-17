class modal{
	/*	
	arguments set through data (all optional unless otherwise specified, some may be replaced with placeholders if blank)
	
	how to use: create an instance (var X = new modal(data)) and then run the display function (X.display()). Hide with .hide (X.hide())
	
	Arguments:
		id [required]: a unique ID for this modal
		
		title: text to appear at top of modal
		
		description: text to appear within body of the modal. use <BR>'s for new lines and include special  codes (@ followed by a digit) to place text fields within the description text
		
		textField: the number of text fields to include (if no @ codes included in description, these appear at the end of the body of the modal). Note: you can find the values in these text fields at any time using the modal instance's     .args[index]    the index will match that of the text field
		
		placeholder: an array of text field placeholders (in order of appearance) e.g. ['your text here', 'your name', ...]. Note: if there are fewer placeholders than text fields, the last placeholder is repeated
		
		previewResult: the format for previewing the results - use dollar codes ($ followed by a digit) to specify which of the args to use where within the preview e.g. "$1 ($2)" with the first and second args as 'hello' and 'world' would be "hello (world)". Note: if you are using textfields but want arguments which aren't changed by these, you will need more arguments than text fields (e.g. $7 if there was just 1 text field would refer to your 7th argument only and would not change with user entry). If values are missing from args and specified by preview "???" will appear
		
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
	buildModalBody(hasDescription,descriptionHasWild,hasTextField,hasPlaceholder,hasPreview){
		var result = '<div class="modal-body">'
		var textFieldsArray = []
		if (hasTextField){
			var placeholder = "Your text here"
			if (hasPlaceholder){
				placeholder = this.placeholder
			}
			if (!(Array.isArray(placeholder))){
				placeholder = [placeholder]
			}
			var textFieldsInDesc = this.countWildCards(this.description,"@")
			var tFieldCount = Math.max(textFieldsInDesc,this.textField)
			for (var textFieldIndex = 0; textFieldIndex<tFieldCount;textFieldIndex++){
				textFieldsArray.push(this.buildTextField(textFieldIndex,placeholder,hasPreview))
			}
		}
		
		if (hasDescription){
			var revisedDescription = this.description
			if (hasTextField && descriptionHasWild){//we have text fields and they should be in description
				revisedDescription = this.replaceCodeWith(revisedDescription,"@",textFieldsArray)
				while ((textFieldsInDesc>0)&&(textFieldsArray.length>0)){
					textFieldsArray.shift()
					textFieldsInDesc-=1
					//remove those already included from the list
				}
			}
			result+=revisedDescription
		}
		if ((hasTextField)&&(textFieldsArray.length>0)){//we have them but they weren't in the description (or some remain)
			if (hasDescription){
				result+='<BR>'
			}
			while (textFieldsArray.length>0){
				result += textFieldsArray.shift()
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
	buildPreview(){
		if (!(Array.isArray(this.args))){
			this.args = [this.args]
		}
		var thePreview = this.previewResult
		thePreview = this.replaceCodeWith(thePreview,"$",this.args) //match last $num

		return thePreview
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
		var descriptionHasWild = ((hasDescription)&&(this.hasWildcards(this.description,"@")))
		var hasPlaceholder = this.hasOwnProperty('placeholder')
		var hasTitle = this.hasOwnProperty('title')
		
		this.modal = document.createElement('span')
		this.modal.setAttribute("id","modalContainer")
		
		var htmlModal = this.buildModalStart()
		
		htmlModal+= this.buildModalTitle(hasTitle)
		
		htmlModal+= this.buildModalBody(hasDescription,descriptionHasWild,hasTextField,hasPlaceholder,hasPreview)
		
		htmlModal+=this.buildModalFooter(hasPreview,hasButton)
		htmlModal += '</div></div></div>'
		
		this.modal.innerHTML=htmlModal
		
		document.body.appendChild(this.modal)
		this.hide()
	}
	hasWildcards(string,wildcard){
		return (this.countWildCards(string,wildcard)>0)
	}
	countWildCards(string,wildcard){
		var regex = '\\'+wildcard+"\\d+"
		return [...string.matchAll(regex)].length
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
		var regex = '(\\'+codePrefix+'\\d+)' //get last instance of prefix+digit
		var allMatches = [...string.matchAll(regex)] //... takes a sequence and breaks it up into individual elements
		for (var i=0;i<allMatches.length;i++){
			allMatches[i] = allMatches[i][0] //take just the match
			allMatches[i] = allMatches[i].replace(codePrefix,"") //remove the codePrefix
			allMatches[i] = Number(allMatches[i])//make it numeric 
		} 
		var lastArg = Math.max(...allMatches); //get the highest
		var result = string;
		
		for (var argN=0; argN<lastArg; argN++){
			var repWith = "???";
			if (replaceList.hasOwnProperty(argN)){
				repWith = replaceList[argN]
			}
			result = result.replace(codePrefix+(argN+1),repWith)
		}
		
		return result
	}
	setPreview(){
		$('#'+this.id+"Preview").html(this.buildPreview())
	}
	display(){
		$('#'+this.id).modal('show')
	}
	hide(){
		$('#'+this.id).modal('hide')
	}
}

function textAreaActUpon(id,type,task,value){
	getBasic = function(id){return $('#'+id).val()}
	setBasic = function(id,value){$('#'+id).val(value)}
	
	mapping = {
		'tiny':{'get':getTinyContent,'set':setTinyContent},
		'basic':{'get':getBasic,'set':setBasic},
		'radio':{'get':getRadioOption,'set':setRadios},
		'drop':{'get':getDropdownValue,'set':setDropdown},
		'checkbox':{'get':getCheckBox,'set':setCheckBox}
	}
	
	operation = mapping[type][task]
	if (task=='get'){
		return operation(id)
	}
	else if (task=='set'){
		operation(id,value)
	}
}

function actOnAllTextAreas(namesTypesValues,getOrSet){
	results = {}
	for (id in namesTypesValues){
		results[id] = null; //add the id into the results
		txtType = namesTypesValues[id].type
		value = namesTypesValues[id].value
		results[id] = textAreaActUpon(id,txtType,getOrSet,value)
	}
	return results	
}

function getTextAreas_util(namesAndTypes){
	/*Expected format:
	namesAndTypes = {
			'idOfArea': 'tiny'|'basic'|'radio'|'drop',
			...
	}
	*/
	for (id in namesAndTypes){
		namesAndTypes[id] = {type:namesAndTypes[id],value:null}
	}
	try{
		return actOnAllTextAreas(namesAndTypes,'get')
	}
	catch{
		console.error("getTextAreas unable to parse type of text given: ")
	} 
}

function setTextAreas_util(namesTypesValues){
	/*Expected format:
	namesAndTypes = {
			'idOfArea': {'type':'tiny'|'basic'|'radio'|'drop','value':value},
			...
	}
	*/
	try{
		actOnAllTextAreas(namesTypesValues,'set')
	}
	catch{
		console.error("setTextAreas unable to parse type of text given: ")
	}
	
}

function getDropdownValue(id){
	return $('select #'+id).find('option:selected').val() 
}
function setDropdown(id,selectedIndex){
	selectedIndex = castAsNumIfPossible(selectedIndex)
	
	$('#'+id).find("option").each(function(index){
			actOnIndex($(this),index,selectedIndex,"selected")
		})
}

function scrollTo(id){
	var pixelsDown = $("#"+id).position().top
	$("HTML, BODY").animate({
            scrollTop: pixelsDown
        }, 1000);
}

function getRadioOption(id){
		return $('div #'+id).find('input[name="'+id+'"]:checked').val()
	}

function actOnIndex(jQueryThis,index,selectedIndex,action){
	
	if (((index+1) == selectedIndex)||(jQueryThis.val() == selectedIndex)){
				jQueryThis.prop(action,true)
			}
			else{
				jQueryThis.prop(action,false)
			}
	
}
function default_XRadio_onEmpty_Y(textAreaId,radioAreaId,blankVal,defaultVal,callback){

		var textarea = $("#"+textAreaId);
		var checkRadio = function(){
			if ((getRadioOption(radioAreaId)==blankVal)&&(textarea.val()!=="")){
				$("#"+defaultVal).prop("checked", true);
			}
			callback();		  
		};
		// And when textarea changes
		textarea.on("change", checkRadio);
}

function findListInJQuery(container,list,listType){
	/**listType = tag | id | class**/
	results = {}
	for (var index=0;index<list.length;index++){
		var theElement = list[index]
		var found=null;
		switch(listType){
			case "tag":
				found = $(container).find(theElement)
				break;
			case "id":
				found = $(container).find("#"+theElement)
				break;
			case "class":
				found = $(container).find("."+theElement)
				break;
		}	
		if (found.length>0){
			results[theElement] = found
		}
	}
	return results
}

function getHeadingSize(htmlCode){
	/*
	finds which heading size is in this code (if any)
	returns: heading tag or 'noH' if not found
	*/
	var headings = ["h3","h4","h5"]
	var results = recoverFromPasted(htmlCode,{tags:headings})
	for (var headId=0;headId<headings.length;headId++){
		var theHeading = headings[headId]
		if (results.tags.hasOwnProperty(theHeading)){
			return theHeading
		}
	}
	return "noH"
}
function reverseObjectMap(objName){
	/*
	takes an object and returns the mirrored version (values mapped to ids instead)
	precondition -- unique values and ids
	*/
	var output = {}
	for (var objId in objName){
		var objVal = objName[objId]
		output[objVal] = objId
	}
	return output
}

function randomString(strLength,characterList){
		if (typeof(characterList) == "undefined"){
			characterList = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ"
		}
		var charLen = characterList.length;
		var output = ""
		var rInd = 0
		for (var charN = 0;charN < strLength; charN++){
			rInd = Math.floor((Math.random())*charLen)
			output+= characterList[rInd]
		}
		return output
	}

function getIconAndHeading(htmlCode){
	/*
	input -- html code copied from moodle
	return -- output={iconName,headSize,headText}
	*/
	var hSize = getHeadingSize(htmlCode)
	var tagSearch = ["i"]
	if (hSize != "noH"){// confirm there is a heading and add to the find list
		tagSearch.push(hSize)
	}
	var results = recoverFromPasted(htmlCode,{tags:tagSearch})
	var iconNameVal = null
	if (results.tags.hasOwnProperty("i")){
		iconNameVal = results.tags.i[0].className
	}
	var output = {
		iconName:iconNameVal,
		headSize:hSize
	}
	if (output.iconName!==null){
		output.iconName = output.iconName.replace("fa fa-","")
	}
	if (hSize != "noH"){
		output.headText = results.tags[hSize][0].innerText.trim()
	} 
	return output
}

function recoverFromPasted(htmlCode,dataToFind){
	/*
	dataToFind format
	{
		tags: [list of tag names],
		ids: [list of ids],
		classes: [list of classes]
	}
	*/
	var results = {}
	
	var container = $("<span>"+htmlCode+"</span>")
	//convert pasted html code into tags for access as objects (won't live on page though)
	
	if (dataToFind.hasOwnProperty("tags")){
		results.tags =findListInJQuery(container,dataToFind.tags,"tag")
	}
	if (dataToFind.hasOwnProperty("ids")){
		results.ids =findListInJQuery(container,dataToFind.ids,"id")
	}
	if (dataToFind.hasOwnProperty("classes")){
		results.classes =findListInJQuery(container,dataToFind.classes,"class")
	}
	return results
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

function showErrorMsg(id,content,duration,onfinish){
	$('#'+id).css("color","red").fadeOut(1)
	$('#'+id).html(content).fadeIn(500)
	setTimeout(function(){
		$('#'+id).fadeOut(1000,function(){
			$('#'+id).html("")
			if (typeof(onfinish)!==undefined){
				onfinish()
			}
		})
	},duration)
}

function hideButton(id){
	try{
		document.getElementById(id).disabled = true
		hideHTML(id)
	}
	catch{}
}
function showButton(id){
	try{
		document.getElementById(id).disabled = false
		showHTML(id)
	}
	catch{}
  }

function makeTinyWithID(id,callbacks,placeholder){
	tinymce.init({
		selector: '#'+id,
		menubar: false,
		plugins : 'advlist autolink link lists charmap print preview code placeholder',
		placeholder: (placeholder == undefined ? 'Input your text here' : placeholder),
		toolbar: ['styleselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | lists',
		'undo redo | charmap | autolink link | code | removeformat' ],
		setup : function(ed) {
			for (eventName in callbacks){
				ed.on(eventName, callbacks[eventName]);
			}
		}
	});
}

function basicTinyMCEWithID(id,callbacks,placeholder){
	tinymce.init({
		selector: '#'+id,
		menubar: false,
		plugins : 'autolink link placeholder table',
		placeholder: (typeof(placeholder) == undefined ? 'Input your text here' : placeholder),
		toolbar: ['bold italic | undo redo | autolink link | removeformat | table' ],
		setup : function(ed) {
			for (eventName in callbacks){
				ed.on(eventName, callbacks[eventName]);
			}
		}
	});
	
}

function castAsNumIfPossible(potentialNum){
	var casted = potentialNum * 1
	if (!(isNaN(casted))){potentialNum = casted}
	return potentialNum
}
	
	function setRadios(id,selectedIndex){
		//type cast if you can
		selectedIndex = castAsNumIfPossible(selectedIndex)
				
		$('div #'+id).find('input[name="'+id+'"]').each(function(index){
			actOnIndex($(this),index,selectedIndex,"checked")
		});
	}

	function getCheckBox(id){
		return $("#"+id)[0].checked
	}
	function setCheckBox(id,isChecked){
		$("#"+id).prop("checked",isChecked)
	}
	
	function disableButton(id){
		document.getElementById(id).disabled=true
	}
	function enableButton(id){
		document.getElementById(id).disabled=false
	}
	
	function setTinyContent(id,value){
		tiny = tinyMCE.get(id)
		tiny.setContent(value)
	}
	function getTinyContent(id,placeholder){
		var tiny = tinyMCE.get(id).getContent()
		if (tiny !== "") {
            content = tiny;
        } else {
            content = (typeof(placeholder)=="undefined" ? "" : placeholder);
        }
		return content
	}
	function getId(id){return document.getElementById(id)}
	function fullScreenToggle(){
	if (document.fullscreenEnabled) {
		var togglePreviewFS = document.getElementById("togglePreviewFS");
		togglePreviewFS.addEventListener("click", function (event) {
			if (!document.fullscreenElement) {
				document.querySelector("#previewFS").requestFullscreen();
			} else {
				document.exitFullscreen();
			}
		}, false);			
		document.addEventListener("fullscreenchange", function (event) {
			console.log(event);
			if (!document.fullscreenElement) {
				togglePreviewFS.innerHTML = "<i class=\"fa fa-fw fa-expand\"></i>";
				$('#previewFS').removeClass('pt-5');
				$(togglePreviewFS).appendTo('.previewButton');
			} else {
				togglePreviewFS.innerHTML = "<i class=\"fa fa-fw fa-compress\"></i>";
				$(togglePreviewFS).appendTo('#demo');
				$(togglePreviewFS).addClass('d-block mx-auto mt-3')
				$('#previewFS').addClass('pt-5');
			}
		});
		document.addEventListener("fullscreenerror", function (event) {
			console.log(event);		
		});
	}
}