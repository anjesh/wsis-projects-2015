var nominatedprojects = document.querySelectorAll('.nominatedProjects-slider-panel')
for(var i=0;i<nominatedprojects.length;i++) {   
    var np = nominatedprojects[i];
    var li = np.getElementsByTagName('li');
    for(var j=0;j<li.length;j++) {
        console.log(np.getElementsByTagName('H5')[0].outerText , ";",li[j].getElementsByTagName('span')[0].outerText, ";", li[j].getElementsByTagName('span')[1].outerText);
    }
}