
/* check for atto editor, and set message if found. Try to get user id so we can direct them to the editor page, otherwise direct them to preferences */
function setupInsertCode(){

	//get user id if possible
	let tmpURL=$("footer .logininfo a",parent.document).attr("href");
	let newURL="/user/preferences.php";
	if(tmpURL){newURL="/user/editor.php?id="+getParams(tmpURL,"id");	}

	//disable button if ATTO is used
	try {
		if (parent.Y.M.editor_atto !== undefined) {
			showErrorMsg('input-help','Please use TinyMCE to insert code. To change your editor to TinyMCE adjust your preferences <a href="'+newURL+'" target="_top">here</a>.',60000,function() {showingError=false});
			$("#insertCodeBtn").prop("disabled", true);
		}
	}catch(ex){
		console.log("Atto not found: "+ex);
	}

	//disable button if popup is used outside an edit page
	if(parent.location.href.indexOf("view.php")!==-1){
		showErrorMsg('input-help','Insert your code will be available when editing individual activities. Ensure you are using TinyMCE by adjusting your preferences <a href="'+newURL+'" target="_top">here</a>.',60000,function() {showingError=false});
		$("#insertCodeBtn").prop("disabled",true);
	}

}

/* get params - maybe this should be in helperFunctions.js */
function getParams(url,id){
	let params = new URL(url).searchParams;
	return params.get(id);
}

/* insert code into the editor */
function insertCodeInPage(id){

	console.log("--- insertCode ---");

	let txtarea=null;
	let code=$("#"+id).val();

	console.log("code: "+code);
	let txt="";

	// tinyMCE
	if(parent.tinyMCE){
		txt=parent.tinyMCE.activeEditor.getContent({format : 'raw'});
		code=txt+code;
		console.log(code);

		//tinyMCE stripping empty spans - maybe add a $nbsp;?

		parent.tinymce.activeEditor.setContent(code);
		parent.tinymce.activeEditor.setDirty(true);
		//tinymce.activeEditor.selection.getBookmark();

	}else if(window.parent.Y.M.editor_atto!=undefined) {

		/*txt = parent.Y.one('#id_introeditor').get('value');
		code=txt+code;
		parent.Y.one('#id_introeditor' + 'editable').setHTML(code);
		parent.Y.one('#id_introeditor').setHTML(code);
		$('#id_introeditoreditable').focus();*/

	}else{
		//todo: this is rubbish - make it better
		txtarea=$('textarea', parent.document)[0];
		txt=$(txtarea).html();
		code=txt+code;
		$(txtarea).html(code);
	}


}