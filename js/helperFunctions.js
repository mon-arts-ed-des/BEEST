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
		plugins : 'autolink link placeholder',
		placeholder: (placeholder == undefined ? 'Input your text here' : placeholder),
		toolbar: ['bold italic | undo redo | autolink link | removeformat' ],
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
