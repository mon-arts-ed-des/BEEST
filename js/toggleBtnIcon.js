var classToggles = {
	"1":'fa-plus fa-minus',
	"2":'fa-plus-circle fa-minus-circle',
	"3":'fa-plus-square fa-minus-square',
	"4":'fa-plus-square-o fa-minus-square-o',
	"5":'fa-arrow-down fa-arrow-up',
	"6":'fa-arrow-circle-down fa-arrow-circle-up',
	"7":'fa-arrow-circle-o-down fa-arrow-circle-o-up',
	"8":'fa-chevron-down fa-chevron-up',
	"9":'fa-chevron-circle-down fa-chevron-circle-up',
	"10":'fa-caret-down fa-caret-up',
	"11":'fa-caret-square-o-down fa-caret-square-o-up',
	"12":'fa-hand-o-down fa-hand-o-up'
} // list of all possible class toggles

var flippedClassToggles = null //to be run on page load to ensure no issues of accessing function before defined

function reverseSplitMapping(mapObj,splitBy){
/*takes an object and reverses it using the split version of the value*/	
	rev = {}
	for (prop in mapObj){
		vals = mapObj[prop] // grab the value
		vals = vals.split(splitBy) // split it by the argument
		for (v=0;v<vals.length;v++){
			rev[vals[v]] = prop // for each split value, make it a key with prop as its value
		}
	}
	return rev
}

window.onload=function(){
	flippedClassToggles = reverseSplitMapping(classToggles," ") // turn it into the form 'fa-caret-down':10,'fa-hand-o-up':12,etc.
	
	$('div #beestRead').click(function(){
		var iconElement = $(this).find('i,svg')//get the i/svg tag holding the icon
		var iconClasses = iconElement.attr('class').split(" ") //if there are multiple classes, convert them to a list of each (if only one it will be an array of size 1)
		var faIcon = null
		
		for (clsI=0; clsI < iconClasses.length; clsI++){ //go through each class
			iconClass =  iconClasses[clsI]
			if (flippedClassToggles.hasOwnProperty(iconClass)){//check if this is the icon
				faIcon = flippedClassToggles[iconClass]//if so get the number for class toggling
				break
			}
		}
		
		iconElement.toggleClass(classToggles[faIcon])
		//,svg in case i tag swapped with an svg tag
	});
}
