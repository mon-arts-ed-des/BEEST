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
