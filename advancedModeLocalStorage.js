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