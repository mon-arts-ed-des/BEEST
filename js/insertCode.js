
/* check for atto editor, and set message if found. Try to get user id so we can direct them to the editor page, otherwise direct them to preferences */
function setupInsertCode(isAtto,isEdit){

	console.log("setupInsertCode");

	//get user id if possible
	//let tmpURL=$("footer .logininfo a",parent.document).attr("href");
	let newURL="/user/preferences.php";
	//if(tmpURL){newURL="/user/editor.php?id="+getParams(tmpURL,"id");}

	//disable button if ATTO is used

	if(isAtto) {
		showErrorMsg('input-help','Please use TinyMCE to insert code. You can change to TinyMCE in your preferences <a href="'+newURL+'" target="_top">here</a>.',60000,function() {showingError=false});
		$("#insertCodeBtn").prop("disabled", true);
	}


	//disable button if popup is used outside an edit page
	if(!isEdit){
		showErrorMsg('input-help','Insert your code will be available when editing individual activities.',60000,function() {showingError=false});
		$("#insertCodeBtn").prop("disabled",true);
	}

}


function setupInsertCodeListener(){

	window.addEventListener( "message",function (e) {
		console.log("----------------- iframe --------------------");
		console.log(e);
		console.log(e.origin);
		console.log(e.target.origin);
		console.log(e.data);
		console.log("----------------- iframe --------------------");

		//check for event type
		if(e.data.type=="insertCheckReturn"){
			setupInsertCode(e.data.isAtto,e.data.isEdit);
		}
	});

	let obj={type:'insertCheck'};
	window.parent.postMessage(obj,"*");

}