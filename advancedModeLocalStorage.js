	const ADV_MODE_KEY = "Advanced_Mode"
	const ON_STATE = true
	const OFF_STATE = false
	var AdvancedMode = OFF_STATE;
	if (localStorageAvailable){
		AdvancedMode = getAdvancedModeInStorage();
	}

$(document).ready(function() {activateDeactivateAdvancedMode(AdvancedMode)}) //trigger the advanced mode updater when the page is finished loading

	function getAdvancedModeInStorage(){
		if (localStorageAvailable()){
			var result = localStorage.getItem(ADV_MODE_KEY)
			result = JSON.parse(result)
			if (result === null){
				setAdvancedModeInStorage(OFF_STATE)
				return OFF_STATE
			}
			else{
				return result
			}
		}
		else{
			return OFF_STATE
		}
	}
	
	function setAdvancedModeInStorage(state){
		if (localStorageAvailable()){
			localStorage.setItem(ADV_MODE_KEY,state) //if unable to save to localStorage then return it and just keep in this session as a global variable
		}
		return state
	}
	
	function localStorageAvailable(){
		if (typeof localStorage !== 'undefined') {
			try {
				localStorage.setItem('is_local_storage_available', 'yes');
				if (localStorage.getItem('is_local_storage_available') === 'yes') {
					localStorage.removeItem('is_local_storage_available');
					return true;
				} else {
					return false;
				}
			} catch(e) {
				return false;
			}
		} else {
			return false;
		}
	}
	
	function flipTooltip(){
  if (AdvancedMode === OFF_STATE) //if flipping mode and was in the OFF state
	{
		activateDeactivateAdvancedMode(ON_STATE)
	}
	else{
		activateDeactivateAdvancedMode(OFF_STATE)
	}
}


function activateDeactivateAdvancedMode(newMode){
  //var otherInstr = document.getElementById("allInstructExceptMode")
  var displayMode;
  var statusText;
  var tooltipmode;
  
  if (newMode === ON_STATE){
	tooltipmode = 'disable'; //hide tooltips
	statusText = "on" //set button and status text vars
	displayMode = "none" //none meaning hide
	AdvancedMode = setAdvancedModeInStorage(ON_STATE) // turn *ON* advanced mode
  }
  else{
	tooltipmode = 'enable'; //show tool tips
	statusText = "off"
	displayMode = "block" //block meaning show
	AdvancedMode = setAdvancedModeInStorage(OFF_STATE) // turn *OFF* advanced mode
  }
	$('h5').tooltip(tooltipmode)
	$(".onoffswapinstr").each(function(){
		this.innerHTML = statusText
	})
	$(".hideableinstruct").each(function(){
		this.style.display = displayMode //set display mode
	});
}