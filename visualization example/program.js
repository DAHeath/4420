//config values:
var colors = ['coral','green','steelblue','seagreen','yellow','cyan','salmon','skyblue','pink']
var radius = 8;
var trans_secs = 2;
var update_ms = 150;
var svg_size = {width:600,height:400};

//initialization
var mouse_x;
var mouse_y;
var new_points = false;
var points = new Array();
var centers = new Array();
var algo_started = false;
var svg = d3.select('#kmeans').append('svg')
.attr('width',svg_size.width)
.attr('height',svg_size.height);
canvas = document.getElementById('kmeans');
var stream = false;
var stop_update = false;

//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

function safeShuffle(o){
  var x = new Array();
  for(var i = 0; i < o.length; i++){ 
    x[i] = o[i]; 
  }
  return shuffle(x);
}

function addPoint(){
  //add new point to canvas (d3)
  if (algo_started) {return true;}
  var rel_x = mouse_x - canvas.offsetLeft;
  var rel_y = mouse_y - canvas.offsetTop;
  if (points.length >= 1 && (points[points.length-1].x == rel_x)
      && (points[points.length-1].y == rel_y)){ //making sure double-clicks don't get counted as two points
        return true;
      }
  points.push({x:(rel_x),y:(rel_y),plotted:false,nearest_center:null});
  new_points = true;
}

//tracking mouse:
document.captureEvents(Event.MOUSEMOVE);
document.onmousemove = getMousePosition;
function getMousePosition(mp) {
  mouse_x = mp.pageX;
  mouse_y = mp.pageY;
  return true;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function createCenters () {
  //creating centroids
  document.getElementById('create').style.display = 'none';
  document.getElementById('move').style.display = 'block';
  algo_started = true;
  rand_points = safeShuffle(points);
  for (var i = 0; i < Math.round(Math.sqrt(rand_points.length / 2)); i++){
    centers.push({x:rand_points[i].x, y:rand_points[i].y, color:colors[i%colors.length], old_x:null, old_y:null});
  }
  svg.selectAll('.center')
    .data(centers)
    .enter()
    .append('circle')
    .attr('cx', function(d){return d.x;})
    .attr('cy', function(d){return d.y;})
    .attr('r', radius)
    .attr('style', function(d){return 'fill:' + d.color;})
    .attr('class','center')
    .append("svg:title")
    .text(function(d){return capitalize(d.color) + ' cluster center'});
}

function moveCenters () {
  //recalculate centroid positions given their assigned points
  for (var i = 0; i < centers.length; i++){
    var center = centers[i];
    center.old_x = center.x;
    center.old_y = center.y;
    var new_x = 0;
    var new_y = 0;
    var point_count = 0;
    for (var j = 0; j < points.length; j++){
      if (points[j].nearest_center == center){
        new_x += points[j].x;
        new_y += points[j].y;
        point_count++;
      }
    }
    center.x = Math.round(new_x / point_count);
    center.y = Math.round(new_y / point_count);
  }
  svg.selectAll('.center')
    .data(centers)
    .transition()
    .ease('linear')
    .duration(trans_secs * 1000)
    .attr('cx', function(d){return d.x;})
    .attr('cy', function(d){return d.y;});

  //check to see if centroids have failed to move any more (i.e. algorithm complete)
  var all_finalized = true;
  var svg_centers = svg.selectAll('.center')[0];
  for (var i = 0; i < centers.length; i++){
    var center = centers[i];
    var svg_center = {x: Math.round(svg_centers[i].cx.baseVal.value),
      y: Math.round(svg_centers[i].cy.baseVal.value)};
    all_finalized &= (center.x == center.old_x 
        && center.y == center.old_y 
        && Math.round(center.x) == svg_center.x 
        && Math.round(center.y) == svg_center.y
        );
  }
  if (all_finalized){
    stream = false;
    document.getElementById('movecenters').disabled = true;
    document.getElementById('togglestream').disabled = true;
    document.getElementById('final').innerHTML = "<b>Finalized!</b>";
    stop_update = true;
  }
}

function eucDist(a,b){
  return Math.sqrt(Math.pow((a.x - b.x),2) + Math.pow((a.y - b.y),2));
}

function updatePoints(){
  //either creates new svg objects based on clicked points,
  //or re-colors points based on current centroid locations
  if (new_points && !algo_started){
    svg.selectAll('.point')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', function(d){return d.x;})
      .attr('cy', function(d){return d.y;})
      .attr('r', radius)
      .attr('class','point');
    new_points = false;
  }
  if (algo_started){
    for (var i = [0]; i < points.length; i++){
      var point = points[i];
      var center_candidate = null;
      var center_candidate_dist = 99999;
      var svg_centers = svg.selectAll('.center')[0]
        for (var j = 0; j < centers.length; j++){
          var svg_center = svg_centers[j];
          center_dist = eucDist(point,{x:svg_center.cx.baseVal.value,y:svg_center.cy.baseVal.value});
          if (center_dist < center_candidate_dist){
            center_candidate_dist = center_dist;
            center_candidate = centers[j];
          }
        }
      point.nearest_center = center_candidate;
      point.color = 'light' + point.nearest_center.color;
    }
    svg.selectAll('.point')
      .data(points)
      .attr('style', function(d){return 'fill:' + d.color;});
  }
}

function updateDisplay(){
  document.getElementById('numpoints').innerHTML = points.length;
  document.getElementById('numclusters').innerHTML = Math.round(Math.sqrt(points.length / 2));
}

function toggleStream(){
  stream ^= true;
}

window.setInterval(update,update_ms);
function update(){
  if (stop_update){return true;}
  updatePoints();
  updateDisplay();
  if (stream) { moveCenters(); }
}
