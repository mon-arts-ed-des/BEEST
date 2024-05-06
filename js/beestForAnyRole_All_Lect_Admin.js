//single script to add any
const LOCAL_STORAGE_ERROR_MSG = "localStorage unavailable, cannot retrieve key"
const match_admin = /Banner settings|Restore/; //Restore applies to moodle 3.9, Banner settings to moodle 4.1
const match_lect = /Unit completion|Edit settings/; //Edit settings applies to moodle 3.9, Unit completion to moodle 4.1
const cog_presence_regex = /Recycle bin/;
const COLLAPSED_MODE = "collapsed"
const UNCOLLAPSED_MODE_49 = "show"
const KEY_COLLAPSE_BEEST_EDIT_RAW = "wasSeen"
const KEY_MOODLE_VERSION = "moodle_version_for_BEEST"
const KEY_COLLAPSE_BEEST_EDIT = encodehash(KEY_COLLAPSE_BEEST_EDIT_RAW);







//todo: swap HOST before push
const HOST = "https://beest.monash.edu/insert_code";
//const HOST = "http://localhost/moodle/_BEEST";

console.log("HOST: "+HOST);




const key_current_role_raw = "CURRENT_ROLE"
const key_current_role = encodehash(key_current_role_raw)
var match = [
	[match_admin.toString(),"admin"],
	[match_lect.toString(),"lect"]
]//if further roles are needed they can be added here with a corresponding regex as const above (see match_admin, match_lect)
var regex_to_role = {} //to go from regex to role name
for (var mappingId=0;mappingId<match.length;mappingId++){
	regex_to_role[match[mappingId][0]]=match[mappingId][1]
}
var beest_icon_visible=false;
var mode;
var RegExpMode;
var cog_present=false;
var correct_role=false;
 
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


function save_to_local(key,value){
	if (localStorageAvailable()){
		localStorage.setItem(key,JSON.stringify(value))
	}
}

function retrieve_from_local(key){
	if (localStorageAvailable()){
		return JSON.parse(localStorage.getItem(key))
	}
	throw new TypeError(LOCAL_STORAGE_ERROR_MSG,key)
}

function check_for_edit_and_role(){
	
		if ((cog_present)&&(correct_role)){
			return false;
			//if we've discovered all we need to know end the .each() operation
			//.each ends on a return false.
		}
		
		var innerText = $(this).text()
		if (!(cog_present)){
			//if you haven't *yet* found the any staff option check if this one is it
			cog_present = ((innerText.match(cog_presence_regex))!=null)
			//null being the value when **not** a match
		}
		if (!(correct_role)){
			//keep checking until you find the menu option matching the correct role (or you run out of menu options)
			correct_role = ((innerText.match(RegExpMode))!=null)
		}
		
	
}

function setup_beest(MODE,visibilityMethod){
	console.log("imported beest loader 17897ca version")
	cog_present=false;
	correct_role=false;
	var role = null;
	RegExpMode = MODE;
	mode = MODE.toString();
	
	$(".dropdown-menu, .dropdown-item").each(check_for_edit_and_role); //this version applies to moodle 4.1 and 3.9 (the dropdown-item class is 3.9 and dropdown-menu is 4.1)
	
	//now we've explored EACH menu option let's check if we should display the icon.


	window.addEventListener( "message",function (e) {

			console.log("-------------------------------------");
			console.log(e.origin);
			console.log(e.data);
			console.log("-------------------------------------");

			if(e.origin!=='https://learning.monash.edu'){return;}
			insertCodeInPage(e.data);
		});

	
	if((cog_present)&&(correct_role)){
		//if at any point cog present and can find the required text...
		role = encodehash(regex_to_role[mode])
		
		/*POSSIBLE DANGER: someone with cog access could change in the page the role by modifying localStorage in their browser directly
		SOLUTION: encrypt both the localStorage key and value to make it practically impossible to change without knowledge of this code
		*/
		
		//update current role of user to localStorage
		save_to_local(key_current_role,role)
		if (!(beest_icon_visible)){
			make_beest_visible(visibilityMethod);
			beest_icon_visible = true;
			//paranoid checking -- don't show the icon if you're already done this on this page load
		}
	}
	else if ((cog_present)&&(!(correct_role))){
		//cog present but not correct role
		role = encodehash("invalid")
		save_to_local(key_current_role,role)
		//override localStorage with 'invalid' option
	}
	else if (!(cog_present)){
		//if can't find cog -- pull from local storage
		try{
			role = retrieve_from_local(key_current_role) //should already be encrypted in SHA256
		
			//to decide whether to show or hide beest
			if (encodehash(regex_to_role[mode])===role){
				//if the role (encrypted) matches the role for the lookup (encrypted) then make visible
				if (!(beest_icon_visible)){
					make_beest_visible(visibilityMethod);
					beest_icon_visible = true;
				}
			}
		}
		catch{
			console.log("beest button cannot display, localStorage disabled and no cog menu found")
		}
	}
};

function checkMoodleVersion(){
	/*checks for key elements on the page identifying as moodle 3.9 or 4.1 and saves to local storage*/
	/*check which version of moodle we have 
	for moodle 4.1, header-custom-menus, moodle 3.9 header-right*/
	if ($(".header-right").length>0){
		save_to_local(KEY_MOODLE_VERSION,3.9)
	}
	else if ($(".header-custom-menus").length>0){
		save_to_local(KEY_MOODLE_VERSION,4.1)
	}
	else{
		save_to_local(KEY_MOODLE_VERSION,"NOT AVAILABLE")
	}
}

function createButtonAndModal(){
	var beest_button_for_menu = '<div class="custom-menus my-auto dropdown"><a type="button" target="_blank" class="border border-dark rounded-circle p-2 text-dark" role="button" title="BEEST" style="width: 38px; height: 38px;" data-toggle="modal" data-target=".beest-home-modal" id="beestDropdown"><img src="'+HOST+'/img/dragon-solid-black.png" width="20px" height="20px" style="margin-bottom: 4px;" /></a>'
	var beest_modal_to_appear = '<style>.modal-beest{max-width: 80% !important;}</style><div class="modal fade beest-home-modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg modal-beest"><div class="modal-content"><div class="modal-header mb-0 p-2 bg-danger text-white px-5"><h5 class="modal-title text-white my-auto" id="exampleModalLabel">To close this window click the button on the right or anywhere outside this box.</h5><button type="button" class="btn btn-outline-light btn-lg rounded" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">Close <i class="fa fa-times"></i></span></button></div><iframe src="'+HOST+'/index.html" width="100%" height="900px"></iframe></div></div></div>'
	
	switch (retrieve_from_local(KEY_MOODLE_VERSION)){
		case 3.9:
			$(".header-right").prepend(beest_button_for_menu);
			$("#region-main").append(beest_modal_to_appear);/*for moodle 3.9 #region-main*/
			break;
		default:
			console.log("unable to determine moodle version, assuming 4.1")
		case 4.1:
			//todo: replace header-custom-menu before push
			$(".header-custom-menus").prepend(beest_button_for_menu);
			//$(".usermenu").prepend(beest_button_for_menu);

			$("#region-main-box").append(beest_modal_to_appear);/*for moodle 4.1, #region-main-box*/
			break;

	}
}
	

function create_iFrameInEditScreen(){
	var expand;
	try{
		var wasSeen = retrieve_from_local(KEY_COLLAPSE_BEEST_EDIT)
		
		if (wasSeen === null){
			//so never seen
			expand = true
			save_to_local(KEY_COLLAPSE_BEEST_EDIT,false)
		}
		else if (wasSeen){
			//so wasSeen is true
			expand = false
		}
		else{
			expand = true
		}
	}
	catch (err){
		if (err.message == LOCAL_STORAGE_ERROR_MSG){
			expand = false
		}
		else{
			throw err //send it onwards if not a localStorage issue
		}
	}
	
	var classToAdd;
	var class49Add;
	
	if (expand){
		classToAdd = ""
		class49Add = " "+UNCOLLAPSED_MODE_49
	}
	else{
		classToAdd = " "+COLLAPSED_MODE
		class49Add = ""
	}
	
	const MOODLE39_BEESTEDIT_INPAGE = '<fieldset class="clearfix collapsible'+classToAdd+'" id="id_beest"><legend class="ftoggler"><a href="#" class="fheader" role="button" aria-controls="id_beest" aria-expanded="false">BEEST</a></legend><div class="fcontainer clearfix iframeResp"><iframe src="'+HOST+'/index.html" frameborder="0" class="responsive-iframe"></iframe></div></fieldset>'
	const MOODLE41_BEESTEDIT_INPAGE = '<fieldset class="clearfix collapsible'+classToAdd+'" id="id_beest"><legend class="sr-only">BEEST</legend><div class="position-relative d-flex ftoggler align-items-center position-relative mr-1"><a data-toggle="collapse" href="#id_beest_container" role="button" aria-expanded="true" aria-controls="id_beest_container" class="btn btn-icon mr-1 icons-collapse-expand stretched-link fheader '+classToAdd+'" id="collapseElement-1"><span class="expanded-icon icon-no-margin p-2" title="Collapse"><i class="icon fa fa-chevron-down fa-fw " aria-hidden="true"></i></span><span class="collapsed-icon icon-no-margin p-2" title="Expand"><span class="dir-rtl-hide"><i class="icon fa fa-chevron-right fa-fw " aria-hidden="true"></i></span><span class="dir-ltr-hide"><i class="icon fa fa-chevron-left fa-fw " aria-hidden="true"></i></span></span><span class="sr-only">BEEST</span></a><h3 class="d-flex align-self-stretch align-items-center mb-0" aria-hidden="true">BEEST</h3></div>'+'<div id="id_beest_container" class="fcontainer collapseable collapse '+class49Add+'"><div id="fitem_id_page" class="form-group row  fitem   "><div class="fcontainer clearfix iframeResp"><iframe src="'+HOST+'/index.html" frameborder="0" class="responsive-iframe" id="beest-ifrm"></iframe></div></div></div></fieldset>'
	
	var CSS_page = document.createElement('link')
	CSS_page.rel = 'stylesheet'
	CSS_page.href = HOST+'/css/beest_editScreen_iFrame.css'
	document.getElementsByTagName('head')[0].appendChild(CSS_page)
	var matchEditArea = $('#id_general, #id_generalhdr, #id_qtypeheading')
	if (matchEditArea.length>0){
		switch(retrieve_from_local(KEY_MOODLE_VERSION)){
			case 3.9:
				matchEditArea.after(MOODLE39_BEESTEDIT_INPAGE);
				break;
			default: //if not able to tell, assume version 4.1
				console.log("unable to determine moodle version, assuming 4.1")
			case 4.1:
				matchEditArea.after(MOODLE41_BEESTEDIT_INPAGE);
				break;
		}
		save_to_local(KEY_COLLAPSE_BEEST_EDIT,true)
	}
}

function make_beest_visible(visibilityMethod){
	checkMoodleVersion()//check moodle version
	if (typeof(visibilityMethod)=="undefined"){
		createButtonAndModal() //compatibility with previous versions of setup function -- not having an argument means use the basic button version only
		return
	}
	else{
		if (visibilityMethod.hasOwnProperty("button")){
			if (visibilityMethod.button){ //should be true if enabled
				createButtonAndModal()
			}
		}
		if (visibilityMethod.hasOwnProperty("iFrame")){
			if (visibilityMethod.iFrame){ //should be true if enabled
				create_iFrameInEditScreen()
			}
		}
	}
}

function encodehash(input){
	return murmurhash2_32_gc(input, 0xFFECD ).toString(16)
}

/*function to encrypt sensitive data (make it hard for someone to dynamically change role in localStorage)*/

/**
 * JS Implementation of MurmurHash2
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param {string} str ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */

function murmurhash2_32_gc(str, seed) {
  var
    l = str.length,
    h = seed ^ l,
    i = 0,
    k;
  
  while (l >= 4) {
  	k = 
  	  ((str.charCodeAt(i) & 0xff)) |
  	  ((str.charCodeAt(++i) & 0xff) << 8) |
  	  ((str.charCodeAt(++i) & 0xff) << 16) |
  	  ((str.charCodeAt(++i) & 0xff) << 24);
    
    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    k ^= k >>> 24;
    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

	h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

    l -= 4;
    ++i;
  }
  
  switch (l) {
  case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
  case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
  case 1: h ^= (str.charCodeAt(i) & 0xff);
          h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  }

  h ^= h >>> 13;
  h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  h ^= h >>> 15;

  return h >>> 0;
}



/* insert code into the editor */
function insertCodeInPage(obj){

	console.log("--- insertCode ---");

	let txtarea=null;
	let code=obj.code;
	let txt="";

	// tinyMCE
	if(tinyMCE){
		txt=tinyMCE.activeEditor.getContent({format : 'raw'});
		code=txt+code;
		console.log(code);

		//tinyMCE stripping empty spans - maybe add a $nbsp;?

		tinymce.activeEditor.setContent(code);
		tinymce.activeEditor.setDirty(true);
		//tinymce.activeEditor.selection.getBookmark();

	}else{
		//todo: this is rubbish - make it better

		txtarea=$('textarea')[0];
		txt=$(txtarea).html();
		code=txt+code;
		txtarea.innerHTML = code;
	}
}
