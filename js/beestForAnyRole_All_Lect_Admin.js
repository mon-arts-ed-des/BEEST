//single script to add any

const match_admin = /Restore/;
const match_lect = /Edit settings/;
const cog_presence_regex = /Recycle bin/;
const key_current_role_raw = "CURRENT_ROLE"
const key_current_role = sha256(key_current_role_raw)
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
}

function setup_beest(MODE,visibilityMethod){
	var cog_present=false;
	var correct_role=false;
	var role = null;
	mode = MODE.toString();
	
	$(".dropdown-item").each(function(){
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
			correct_role = ((innerText.match(MODE))!=null)
		}
		
	});
	
	//now we've explored EACH menu option let's check if we should display the icon.
	
	if((cog_present)&&(correct_role)){
		//if at any point cog present and can find the required text...
		role = sha256(regex_to_role[mode])
		
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
		role = sha256("invalid")
		save_to_local(key_current_role,role)
		//override localStorage with 'invalid' option
	}
	else if (!(cog_present)){
		//if can't find cog -- pull from local storage
		role = retrieve_from_local(key_current_role) //should already be encrypted in SHA256
		
		//to decide whether to show or hide beest
		if (sha256(regex_to_role[mode])===role){
			//if the role (encrypted) matches the role for the lookup (encrypted) then make visible
			if (!(beest_icon_visible)){
				make_beest_visible(visibilityMethod);
				beest_icon_visible = true;
			}
		}
	}
};

function createButtonAndModal(){
	$(".header-right").prepend(
		'<div class="custom-menus my-auto dropdown"><button type="button" target="_blank" class="border border-dark rounded-circle p-2 text-dark" role="button" title="BEEST" style="width: 38px; height: 38px;" data-toggle="modal" data-target=".beest-home-modal" id="beestDropdown"><img src="https://mon-arts-ed-des.github.io/BEEST/img/dragon-solid-black.png" width="20px" height="20px" style="margin-bottom: 4px;" /></button>'
	);
	$("#region-main").append(
		'<style>.modal-beest{max-width: 80% !important;}</style><div class="modal fade beest-home-modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg modal-beest"><div class="modal-content"><div class="modal-header mb-0 p-2 bg-danger text-white px-5"><h5 class="modal-title text-white my-auto" id="exampleModalLabel">To close this window click the button on the right or anywhere outside this box.</h5><button type="button" class="btn btn-outline-light btn-lg rounded" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">Close <i class="fa fa-times"></i></span></button></div><iframe src="https://mon-arts-ed-des.github.io/BEEST/index.html" width="100%" height="900px"></iframe></div></div></div>'
	);
}
	

function create_iFrameInEditScreen(){
	var CSS_page = document.createElement('link')
	CSS_page.rel = 'stylesheet'
	CSS_page.href = 'https://mon-arts-ed-des.github.io/BEEST/css/beest_editScreen_iFrame.css'
	document.getElementsByTagName('head')[0].appendChild(CSS_page)
	$('#id_general, #id_generalhdr, #id_qtypeheading').after('<fieldset class="clearfix collapsible" id="id_beest"><legend class="ftoggler"><a href="#" class="fheader" role="button" aria-controls="id_beest" aria-expanded="false">BEEST</a></legend><div class="fcontainer clearfix iframeResp"><iframe src="https://mon-arts-ed-des.github.io/BEEST/index.html" frameborder="0" class="responsive-iframe"></iframe></div></fieldset>');
}

function make_beest_visible(visibilityMethod){
	if (typeof(visibilityMethod)=="undefined"){
		createButtonAndModal() //compatibility with previous versions of setup function -- not having an argument means use the basic button version only
		return
	}
	else{
		if (visibilityMethod.hasOwnProperty("button")){
			createButtonAndModal()
		}
		if (visibilityMethod.hasOwnProperty("iFrame")){
			create_iFrameInEditScreen()
		}
	}
}


/*SHA256 function to encrypt sensitive data (make it hard for someone to dynamically change role in localStorage) -- credit: https://geraintluff.github.io/sha256/*/
function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    
    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return; // ASCII check: only accept characters in range 0-255
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
    
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);
        
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if 
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                    )|0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
            
            hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1)|0;
        }
        
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }
    
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};
