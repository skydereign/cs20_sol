function Polygon () {
    this.points = [];
    this.count = 0;
    this.color = "rgba(255, 255, 255, 0.0)";
    this.draw = true; // draw it unless stated otherwise
    this.min_x;
    this.min_y;
    this.max_x;
    this.max_y;
}

Polygon.prototype.add = function (x, y) {
    if(this.count==0) {
	this.min_x = x;
	this.max_x = x;
	this.min_y = y;
	this.max_y = y;
    }
    this.points.push({x:x, y:y});
    this.count++;

    if(x < this.min_x) { this.min_x = x; }
    if(x > this.max_x) { this.max_x = x; }
    if(y < this.min_y) { this.min_y = y; }
    if(y > this.max_y) { this.max_y = y; }
}

// gets point in polygon (uses % to allow loops along edges)
Polygon.prototype.get = function (idx) {
    return this.points[idx%this.count];
}

Polygon.prototype.draw_fill = function (ctx) {
    if(this.count>0) {
	ctx.globalCompositeOperation = 'lighter';
	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.moveTo(this.get(0).x, this.get(0).y);

	for(var i=1; i<this.count+1; i++) {
	    ctx.lineTo(this.get(i).x, this.get(i).y);
	}
	ctx.fill();
    }
}

Polygon.prototype.draw_points = function (ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    for(var i=0; i<this.count; i++) {
	ctx.beginPath();
	console.log("x: ", this.get(i).x, " y: ", this.get(i).y);
	ctx.arc(this.get(i).x, this.get(i).y, 5, 0, 2*Math.PI);
	ctx.fill();
    }
}

Polygon.prototype.within = function (x, y) {
    var count = 0;
    var a = {x:x, y:y};
    var b = {x:this.max_x+1, y:this.max_y+1}; // <- some outer bound
    var c = {x:this.get(this.count-1).x, y:this.get(this.count-1).y};
    var d = {x:this.get(0).x, y:this.get(0).y};
    
    // check all other line segments
    for(var i=0; i<this.count; i++) {
	c = this.get(i);
	d = this.get(i+1);
	if(segment_intersection(a, b, c, d, false)) {
	    count++;
	}
    }

    return (count%2==1);
}

Polygon.prototype.intersection = function (other) {
    var polygons = [];
    var points = [];
    var edges = [];
    
    // fills in edges and points
    for(var i=0; i<this.count; i++) {
	var a = this.get(i);
	var b = this.get(i+1);
	edges["A"+i] = [];
	edges["A"+i].push(new InterPoint("A"+i, "B", a.x, a.y, 0, 0));
	edges["A"+i].push(new InterPoint("A"+i, "B", b.x, b.y, 1, 0));

	for(var j=0; j<other.count; j++) {
	    var c = other.get(j);
	    var d = other.get(j+1);
	    var point = segment_intersection(a, b, c, d, false);

	    // initialize once
	    if(edges["B"+j]===undefined) {
		edges["B"+j] = [];
		edges["B"+j].push(new InterPoint("A", "B"+j, c.x, c.y, 0, 0));
		edges["B"+j].push(new InterPoint("A", "B"+j, d.x, d.y, 0, 1));
	    }

	    if(point!==undefined) {
		var i_point = new InterPoint ("A"+i, "B"+j, point.x, point.y, point.t, point.u);
		edges["A"+i].push(i_point);
		edges["B"+j].push(i_point);
		console.log(edges["B"+j]);
		console.log("\n\n\n\n");
	    }
	}
    }
    // sort points along edges by forward direction
    for(var idx in edges) {
	console.log("before edges[",idx,"] ", edges[idx]);
	edges[idx].sort(function (a, b) {
	    // sort in reverse
	    if(idx.charAt(0)==='A') {
		return a.t-b.t;
	    } else {
		return a.u-b.u;
	    }
	});
	console.log("after edges[",idx,"] ", edges[idx]);
    }

    // processes new polygons
    // this polygon (A case)
    var new_edge_idx; // idx of the edge after intersection
    var cur_edge_idx = 0; // idx of current edge
    var cur_point_idx = 0; // index of point in edge array
    var dir = 1; // 1 = forward, -1 = backward
    var cur = "A"; // current polygon
    var polygon = new Polygon();
    var new_x;
    var new_y;

    polygon.add(this.get(0).x, this.get(0).y);
    do {
	console.log("edge: ", (cur+cur_edge_idx), " idx: ", cur_point_idx+dir);
	var new_point = edges[cur+cur_edge_idx][cur_point_idx+dir];
	// new_point is cur_edge[next point along edge]
	new_x = new_point.x;
	new_y = new_point.y
	polygon.add(new_x, new_y);
	new_point.count++;

	if(new_point.edge_a === "A" || new_point.edge_b === "B") {
	    // if not a real intersection point and not the end
	    if(polygon.get(0).x!==new_x || polygon.get(0).y!==new_y) {
		// note normally edges are A# or B#
		//console.log("no intersection");
		cur_edge_idx+=dir; // continue along same polygon
		if(dir===1) {
		    cur_point_idx = 0; // positive direction starts at 0
		} else {
		    console.log("cur_edge_idx: ", cur_edge_idx);
		    cur_point_idx = edges[cur+cur_edge_idx].length();
		}
	    }
	} else {
	    // real intersection
	    cur = cur === "A" ? "B" : "A";

	    // adjust paths taken
	    if(cur==="A") {
		if(new_point.edge_a.charAt(1)<new_point.edge_b.charAt(1)) {
		    dir*=-1; // not necesserialy so sir
		}

		new_edge_idx = new_point.edge_a;
		if(dir===1) {
		    new_point.ap=1;
		    new_point.bn=1;
		} else {
		    new_point.an=1;
		    new_point.bp=1;
		}
	    } else {
		if(new_point.edge_a.charAt(1)>=new_point.edge_b.charAt(1)) {
		    dir*=-1; // not necesserialy so sir
		}

		new_edge_idx = new_point.edge_b;
		if(dir===1) {
		    new_point.an=1;
		    new_point.bp=1;
		} else {
		    new_point.ap=1;
		    new_point.bn=1;
		}
	    }
	    cur_point_idx = edges[new_edge_idx].indexOf(new_point);
	    console.log("cur_point_idx: ", cur_point_idx);
	    cur_edge_idx = parseInt(new_edge_idx.charAt(1));
	    console.log("BLAH: ", cur_edge_idx);
	}
	// loop while not at the starting point
	// console.log("checking loop new_x:", new_x, " new_y: ", new_y);
	// console.log("checking loop (0).x:", polygon.get(0).x, " (0).y: ",polygon.get(0).y);
    } while(polygon.get(0).x!==new_x || polygon.get(0).y!==new_y);
    polygon.draw_points(document.getElementById("canvas").getContext("2d"));


    // TODO: clean this up, should right generic function
    // processes new polygons
    // other polygon (B case)
    var new_edge_idx; // idx of the edge after intersection
    var cur_edge_idx = 0; // idx of current edge
    var cur_point_idx = 0; // index of point in edge array
    var dir = 1; // 1 = forward, -1 = backward
    var cur = "B"; // current polygon
    var polygon = new Polygon();
    var new_x;
    var new_y;

    polygon.add(other.get(0).x, other.get(0).y);
    do {
	console.log("edge: ", (cur+cur_edge_idx), " idx: ", cur_point_idx+dir);
	var new_point = edges[cur+cur_edge_idx][cur_point_idx+dir];
	// new_point is cur_edge[next point along edge]
	new_x = new_point.x;
	new_y = new_point.y
	polygon.add(new_x, new_y);
	new_point.count++;

	if(new_point.edge_a === "A" || new_point.edge_b === "B") {
	    // if not a real intersection point and not the end
	    if(polygon.get(0).x!==new_x || polygon.get(0).y!==new_y) {
		// note normally edges are A# or B#
		//console.log("no intersection");
		cur_edge_idx+=dir; // continue along same polygon
		if(dir===1) {
		    cur_point_idx = 0; // positive direction starts at 0
		} else {
		    console.log("cur_edge_idx: ", cur_edge_idx);
		    cur_point_idx = edges[cur+cur_edge_idx].length();
		}
	    }
	} else {
	    // real intersection
	    cur = cur === "A" ? "B" : "A";

	    // adjust paths taken
	    if(cur==="A") {
		if(new_point.edge_a.charAt(1)<new_point.edge_b.charAt(1)) {
		    dir*=-1; // not necesserialy so sir
		}

		new_edge_idx = new_point.edge_a;
		if(dir===1) {
		    new_point.ap=1;
		    new_point.bn=1;
		} else {
		    new_point.an=1;
		    new_point.bp=1;
		}
	    } else {
		if(new_point.edge_a.charAt(1)>=new_point.edge_b.charAt(1)) {
		    dir*=-1; // not necesserialy so sir
		}

		new_edge_idx = new_point.edge_b;
		if(dir===1) {
		    new_point.an=1;
		    new_point.bp=1;
		} else {
		    new_point.ap=1;
		    new_point.bn=1;
		}
	    }
	    cur_point_idx = edges[new_edge_idx].indexOf(new_point);
	    console.log("cur_point_idx: ", cur_point_idx);
	    cur_edge_idx = parseInt(new_edge_idx.charAt(1));
	    console.log("BLAH: ", cur_edge_idx);
	}
	// loop while not at the starting point
	// console.log("checking loop new_x:", new_x, " new_y: ", new_y);
	// console.log("checking loop (0).x:", polygon.get(0).x, " (0).y: ",polygon.get(0).y);
    } while(polygon.get(0).x!==new_x || polygon.get(0).y!==new_y);


    // remaining intersection point polygons
    for(var i=0; i<points.length; i++) {
	
	var new_edge_idx; // idx of the edge after intersection
	var cur_edge_idx = 0; // idx of current edge
	var cur_point_idx = 0; // index of point in edge array
	var dir = 1; // 1 = forward, -1 = backward 
	var cur = "B"; // current polygon
	var polygon = new Polygon();
	var new_x;
	var new_y;

	polygon.add(other.get(0).x, other.get(0).y);
	do {
	    console.log("edge: ", (cur+cur_edge_idx), " idx: ", cur_point_idx+dir);
	    var new_point = edges[cur+cur_edge_idx][cur_point_idx+dir];
	    // new_point is cur_edge[next point along edge]
	    new_x = new_point.x;
	    new_y = new_point.y
	    polygon.add(new_x, new_y);
	    new_point.count++;

	    if(new_point.edge_a === "A" || new_point.edge_b === "B") {
		// if not a real intersection point and not the end
		if(polygon.get(0).x!==new_x || polygon.get(0).y!==new_y) {
		    // note normally edges are A# or B#
		    //console.log("no intersection");
		    cur_edge_idx+=dir; // continue along same polygon
		    if(dir===1) {
			cur_point_idx = 0; // positive direction starts at 0
		    } else {
			console.log("cur_edge_idx: ", cur_edge_idx);
			cur_point_idx = edges[cur+cur_edge_idx].length();
		    }
		}
	    } else {
		// real intersection
		cur = cur === "A" ? "B" : "A";

		// adjust paths taken
		if(cur==="A") {
		    if(new_point.edge_a.charAt(1)<new_point.edge_b.charAt(1)) {
			dir*=-1; // not necesserialy so sir
		    }

		    new_edge_idx = new_point.edge_a;
		    if(dir===1) {
			new_point.ap=1;
			new_point.bn=1;
		    } else {
			new_point.an=1;
			new_point.bp=1;
		    }
		} else {
		    if(new_point.edge_a.charAt(1)>=new_point.edge_b.charAt(1)) {
			dir*=-1; // not necesserialy so sir
		    }

		    new_edge_idx = new_point.edge_b;
		    if(dir===1) {
			new_point.an=1;
			new_point.bp=1;
		    } else {
			new_point.ap=1;
			new_point.bn=1;
		    }
		}
		cur_point_idx = edges[new_edge_idx].indexOf(new_point);
		console.log("cur_point_idx: ", cur_point_idx);
		cur_edge_idx = parseInt(new_edge_idx.charAt(1));
		console.log("BLAH: ", cur_edge_idx);
	    }
	    // loop while not at the starting point
	    // console.log("checking loop new_x:", new_x, " new_y: ", new_y);
	    // console.log("checking loop (0).x:", polygon.get(0).x, " (0).y: ",polygon.get(0).y);
	} while(polygon.get(0).x!==new_x || polygon.get(0).y!==new_y);
	polygon.draw_points(document.getElementById("canvas").getContext("2d"));
    }
}


// Intersection point, used for calculating new polygons
function InterPoint (a, b, x, y, t, u) {
    this.edge_a = a;
    this.edge_b = b;
    this.x = x;
    this.y = y;
    this.t = t;
    this.u = u;

    this.count = 0; // number of polygons using this point (3 total)
    this.ap = 0; // polygon
    this.an = 0;
    this.ba = 0;
    this.bn = 0;
}



function start() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var poly = new Polygon();
    poly.color = 'rgba(255, 0, 0, 0.3)';
    poly.add(0, 0);
    poly.add(200, 0);
    poly.add(0, 200);
    poly.draw_fill(ctx);
    //poly.draw_points(ctx);

    var poly2 = new Polygon();
    poly2.color = 'rgba(0, 255, 0, 0.3)';
    poly2.add(0, 0);
    poly2.add(200, 200);
    poly2.add(0, 200);
    poly2.draw_fill(ctx);

    poly.intersection(poly2);
    //poly.within(100, 101);

    /*var a = {x:0, y:0};
    var b = {x:100, y:100};
    var c = {x:100, y:0};
    var d = {x:100, y:99};
    segment_intersection(a, b, c, d, false);*/
}


// set to not count end point intersection
// should make it a parameter to specify
function segment_intersection (point_a1, point_a2, point_b1, point_b2, end_points) { 
    var a_width = point_a2.x - point_a1.x; 
    var a_height = point_a2.y - point_a1.y; 
    var b_width = point_b2.x - point_b1.x; 
    var b_height = point_b2.y - point_b1.y;
    
    var dot = a_width * b_height - a_height * b_width;
    
    if(dot == 0) {
	return undefined;
    }
    
    var x_dist = point_b1.x - point_a1.x;
    var y_dist = point_b1.y - point_a1.y;
    var t = (x_dist * b_height - y_dist * b_width) / dot;

    if(end_points) {
	if(t < 0 || t > 1) {
	    return undefined;
	}
    } else {
	if(t <= 0 || t >= 1) {
	    return undefined;
	}
    }	
    var u = (x_dist * a_height - y_dist * a_width) / dot;

    if(end_points) {
	if(u < 0 || u > 1) { 
	    return undefined;
	}
    } else {
	if(u <= 0 || u >= 1) { 
	    return undefined;
	}
    }

    // return intersection
    return {x:point_a1.x+t*a_width, y:point_a1.y+t*a_height, t:t, u:u};
}

