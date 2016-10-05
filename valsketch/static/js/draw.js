//////////////////////
// Global Variables //
//////////////////////

var gPaths;
var canvas;
var gMODE;
var gModeEnum = {
    DRAW: 1
};
let gEndPoints = new Set();
var gTool, zTool;
var activePath, curPart, gParts;

var cursors = {
    near_endpt: 'url(http://cur.cursors-4u.net/others/oth-5/oth499.cur), auto',
    draw: 'url(http://cur.cursors-4u.net/others/oth-5/oth498.cur), auto'
};


/* Attach event handler to Tools */
var drawButton        = document.getElementById('draw-button');
var completeButton    = document.getElementById('complete-button');
var deleteButton      = document.getElementById('delete-button');
var undoButton        = document.getElementById('undo-button');

/* change cursor on click */
drawButton.onclick = function() {
    gTool.activate();
    canvas.style.cursor = cursors.draw;
};
completeButton.onclick = function() {
    if(activePath) {
        activePath.closePath();
        activePath.simplify(0);
        activePath.strokeColor = 'yellow';
        gParts.push({curPart : activePart });
        activePath = undefined;
    }
};

undoButton.onclick = function() {
    if(activePath) {
        activePath.lastSegment.remove();
    }
}

deleteButton.onclick = function() {
    if(activePath) {
        activePath.remove();
        activePath = undefined;
    }
}

/* Update Endpoints */
var updateEndPoints = function() {
    gEndPoints = new Set();
    var paths = gPaths.getItems({ class: Path });
    for(var i = 0; i < paths.length; ++i) {
        var path = paths[i];
        gEndPoints.add(path.firstSegment._point).add(path.lastSegment._point);
    }
};

//////////////////////
// Initialize Paper //
//////////////////////

paper.install(window);

window.onload = function() {
    /* Setup canvas */
    canvas = document.getElementById('myCanvas');
    paper.setup(canvas);
    zTool = new Tool(); zTool.activate();
    gTool = new Tool();

    /* Import SVG and break into paths */
    project.importSVG(document.getElementById('svg'), {
        expandShapes: true,
        onLoad: function(group) {
            /* get paths */
            group.visible = true;

            pArray = group.getItems({
                class: Path
            });
            pArray.map(function(path) {
                path.strokeWidth = 4;
                path.selected = false;
            });

            gPaths = new Group(pArray);
            _DEBUG = {gpaths: gPaths};
        }
    });

    /* Setup Draw Tool */
    const magThreshold     = 15;
    const edgeThreshold    = 10;

    gTool.minDistance       = 10;
    gTool.distanceThreshold = 5;

    gTool.onMouseDown = function(event) {
        if(!activePath) {
            activePath = new Path({
                strokeWidth: 4,
                strokeColor: 'red',
                selected: true
            });
        }
        activePath.add(event.point);

    };

    gTool.onMouseMove = function(event) {
        if (activePath) {
            var vec = event.point.subtract(activePath.firstSegment._point);
            if(vec.length <= magThreshold) {
                canvas.style.cursor = cursors.near_endpt;
            } else {
                canvas.style.cursor = cursors.draw;
            }
        }
    };

    gTool.onMouseDrag = function(event) {
        var oPaths = gPaths.getItems({ class: Path });
        var nearestPt, minDist = Number.POSITIVE_INFINITY;
        for(var idx = 0; idx < oPaths.length; ++idx) {
            let pt = oPaths[idx].getNearestPoint(event.point);
            let vec = pt.subtract(event.point);
            if(minDist > vec.length) {
                minDist = vec.length;
                nearestPt = pt;
            }
        }
        if(minDist < edgeThreshold) {
            activePath.add(nearestPt);
        } else {
            activePath.add(event.point);
        }
    };

    gTool.onMouseUp = function(event) {
        var vec = event.point.subtract(activePath.firstSegment._point);
        if(vec.length > magThreshold) {
            activePath.add(event.point);
        } else {
            activePath.closePath();
            activePath.simplify(0);
            activePath.strokeColor = 'yellow';
            gParts.push({curPart : activePar});
            activePath = undefined;
        }
    };

    /* attach click handler to all children */
    var part_list = document.getElementById('part-list').querySelectorAll('li');

    for (var i = 0; i < part_list.length; ++i) {
        var li  = part_list[i];
        li.onclick = function() {
            for(var j = 0; j < part_list.length; ++j) {
                var other_part = part_list[j];
                other_part.style.background = '#fff';
            }
            curPart = this.innerText;
            this.style.background = '#eabfce';
        };
    }
};



