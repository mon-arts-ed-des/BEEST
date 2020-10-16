function getRadioOption(id){
		return $('div #'+id).find('input[name="'+id+'"]:checked').val()
	}
	
	function setRadios(id,selectedIndex){
		selectedIndex = selectedIndex * 1 //type cast as number
		$('div #'+id).find('input[name="'+id+'"]').each(function(index,value){
			if ((index+1) == selectedIndex){
				$(this).prop("checked",true)
			}
			else{
				$(this).prop("checked",false)
			}
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
