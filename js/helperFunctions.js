function textAreaActUpon(id,type,task,value){
	getBasic = function(id){return $('#'+id).val()}
	setBasic = function(id,value){$('#'+id).val(value)}
	
	mapping = {
		'tiny':{'get':getTinyContent,'set':setTinyContent},
		'basic':{'get':getBasic,'set':setBasic},
		'radio':{'get':getRadioOption,'set':setRadios},
		'drop':{'get':getDropdownValue,'set':setDropdown}
	}
	
	operation = mapping[type][task]
	if (task=='get'){
		return operation(id)
	}
	else if (task='set'){
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
            content = placeholder;
        }
		return content
	}
	function getId(id){return document.getElementById(id)}