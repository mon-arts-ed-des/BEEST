function toggleBtnIcon(){
if ($('#beestRead i').hasClass('fa-plus')){
    $('#beestRead').click(function(){ 
    $(this).find('i').toggleClass('fa-plus fa-minus'); 
});
}
else if ($('#beestRead i').hasClass('fa-plus-circle')){
    $('#beestRead').click(function(){ 
    $(this).find('i').toggleClass('fa-plus-circle fa-minus-circle'); 
});
}
else if ($('#beestRead i').hasClass('fa-plus-square')){
    $('#beestRead').click(function(){ 
    $(this).find('i').toggleClass('fa-plus-square fa-minus-square'); 
});
}
else if ($('#beestRead i').hasClass('fa-plus-square-o')){
    $('#beestRead').click(function(){ 
    $(this).find('i').toggleClass('fa-plus-square-o fa-minus-square-o'); 
});
}
else if ($('#beestRead i').hasClass('fa-arrow-down')){
    $('#beestRead').click(function(){ 
    $(this).find('i').toggleClass('fa-arrow-down fa-arrow-up'); 
});
}
else if ($('#beestRead i').hasClass('fa-arrow-circle-down')){
    $('#beestRead').click(function(){ 
    $(this).find('i').toggleClass('fa-arrow-circle-down fa-arrow-circle-up'); 
});
}
else if ($('#beestRead i').hasClass('fa-arrow-circle-o-down')){
    $('#beestRead').click(function(){ 
    $(this).find('i').toggleClass('fa-arrow-circle-o-down fa-arrow-circle-o-up'); 
});
}
else if ($('#beestRead i').hasClass('fa-chevron-down')){
    $('#beestRead').click(function(){ 
    $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up'); 
});
}
else if ($('#beestRead i').hasClass('fa-chevron-circle-down')){
    $('#beestRead').click(function(){ 
    $(this).find('i').toggleClass('fa-chevron-circle-down fa-chevron-circle-up'); 
});
}
else if ($('#beestRead i').hasClass('fa-caret-down')){
    $('#beestRead').click(function(){ 
    $(this).find('i').toggleClass('fa-caret-down fa-caret-up'); 
});
}
else if ($('#beestRead i').hasClass('fa-caret-square-o-down')){
    $('#beestRead').click(function(){ 
    $(this).find('i').toggleClass('fa-caret-square-o-down fa-caret-square-o-up');
});
}
else if ($('#beestRead i').hasClass('fa-hand-o-down')){
    $('#beestRead').click(function(){ 
    $(this).find('i').toggleClass('fa-hand-o-down fa-hand-o-up'); 
});
}
}