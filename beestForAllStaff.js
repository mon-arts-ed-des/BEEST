<!--Add for administrator, lecturer, non-primary lectuer and tutor level roles-->
window.onload = function(){
$(".block-region .type_course a").each(function(){
if($(this).text().match(/Recycle bin/)){
$(".header-right").prepend('<div class="custom-menus my-auto dropdown"><button type="button" target="_blank" class="border border-dark rounded-circle p-2 text-dark" role="button" title="BEEST" style="width: 38px; height: 38px;" data-toggle="modal" data-target=".beest-home-modal" id="beestDropdown"><img src="https://mon-arts-ed-des.github.io/BEEST/dragon-solid-black.png" width="20px" height="20px" style="margin-bottom: 4px;" /></button>');
$("#region-main").append('<style>.modal-beest{max-width: 80% !important;}</style><div class="modal fade beest-home-modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg modal-beest"><div class="modal-content"><div class="modal-header mb-0 p-2 bg-danger text-white px-5"><h5 class="modal-title text-white my-auto" id="exampleModalLabel">To close this window click the button on the right or anywhere outside this box.</h5><button type="button" class="btn btn-outline-light btn-lg rounded" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">Close <i class="fa fa-times"></i></span></button></div><iframe src="https://mon-arts-ed-des.github.io/BEEST/index.html" width="100%" height="900px"></iframe></div></div></div>');
};
});
};
