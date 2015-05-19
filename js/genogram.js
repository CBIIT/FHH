var myDiagram;
var diagram_instance;
var diagram_data;

function init(diagram_data) { 
  this.diagram_data = diagram_data;
  if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
  var $ = go.GraphObject.make;
  // if (typeof myDiagram == 'undefined') {
  myDiagram =
    $(go.Diagram, "myDiagramDiv", {
        initialAutoScale: go.Diagram.Uniform,
        initialContentAlignment: go.Spot.TopCenter,
        "toolManager.hoverDelay": 100,  // how quickly tooltips are shown

        layout:  // use a custom layout, defined below
          $(GenogramLayout, { direction: 90, layerSpacing: 30, columnSpacing: 10 })
      });
    this.myDiagram = myDiagram;
    window.myDiagram = myDiagram;
  // }
    
  // determine the color for each attribute shape
      function attrFill(a) {

        switch (a) {
          case "A": return "#FFFF9A"; // background color for adopted
          case "S": return "white"; // background color for spouse
          case "D": return "red"; // background color for deceased
          case "SD": return "#9ffe92"; // background color for has specific disease
          case "SELF": return "darkblue"; // background color for self
          default: return "#999797"; // default background color
        }
      }

  // determine the geometry for each attribute shape in a male;
  // except for the slash these are all squares at each of the four corners of the overall square
  var fillsq = go.Geometry.parse("F M0  -19  L-19 -19 -19 21 21 21 21 -19 Z");
  var slash = go.Geometry.parse("F M38 0 L40 0 40 2 2 40 0 40 0 38z");
  function maleGeometry(a) {
    switch (a) {
      case "A": return fillsq;
      case "D": return slash;
      default: return fillsq;
    }
  }

  // gets diseases and displays them //
  function displayDiseases(diseases) {
    var diseaseString = "";
    diseaseList = diseases;
    if (diseaseList!="") {
      for (key in diseaseList) {
        diseaseString += "\u2022 " + diseaseList[key]['translatedDiseaseName'];
        if (parseInt(key)+1<diseaseList.length) diseaseString+='\n';
      }
    }
    return diseaseString;
  }

  // determine the geometry for each attribute shape in a female;
  // except for the slash these are all pie shapes at each of the four quadrants of the overall circle
  var fillarc = go.Geometry.parse("F M20 20 B 0 360 20 20 19 19 z");
  function femaleGeometry(a) {
    switch (a) {
      case "A": return fillarc;
      case "D": return slash;
      default: return fillarc;
    }
  }

  var fillColor = "lightgray";  
//  if (a[0] = "A") fillColor = "lightgray";
//  else fillColor = "white";

  // two different node templates, one for each sex,
  // named by the category value in the node data object

  myDiagram.nodeTemplateMap.add("M",  // female
    $(go.Node, "Vertical",
      { locationSpot: go.Spot.Center, locationObjectName: "ICON" },
      $(go.Panel,
        { name: "ICON" },
        $(go.Shape, "Square",
          { width: 40, height: 40, strokeWidth: 2, fill: "#999797", portId: "" }),
      {
        toolTip:
          $(go.Adornment, "Auto",
            $(go.Shape, { fill: "#FFFFCC" },
              new go.Binding("visible", "diseases", function(d) { return d ? true : false; })),
            $(go.Panel, "Vertical",
            $(go.TextBlock, { margin: 4 },
              new go.Binding("text", "diseases", function(d) { return displayDiseases(d);})))
          )
      },    
        $(go.Panel,
          { // for each attribute show a Shape at a particular place in the overall circle
            itemTemplate:
              $(go.Panel,
                $(go.Shape,
                  { stroke: null, strokeWidth: 0 },
                  new go.Binding("fill", "", attrFill),
                  new go.Binding("geometry", "", maleGeometry))
              ),
            margin: 1
          },
          new go.Binding("itemArray", "a")
        )
      ),
      $(go.TextBlock,
        { textAlign: "center", maxSize: new go.Size(100, NaN) },
        new go.Binding("text", "n")),
      $(go.TextBlock,
        { textAlign: "center", maxSize: new go.Size(100, NaN) },
        new go.Binding("text", "t_n"))      
    ));

  myDiagram.nodeTemplateMap.add("F",  // female
    $(go.Node, "Vertical",
      { locationSpot: go.Spot.Center, locationObjectName: "ICON" },
      $(go.Panel,
        { name: "ICON" },
        $(go.Shape, "Circle",
          { width: 40, height: 40, strokeWidth: 2, fill: "#999797", portId: "" }),
      {
        toolTip:
          $(go.Adornment, "Auto",
            $(go.Shape, { fill: "#FFFFCC" },
              new go.Binding("visible", "diseases", function(d) { return d ? true : false; })),
            $(go.TextBlock, { margin: 4 },
              new go.Binding("text", "diseases", function(d) { return displayDiseases(d);}))
          )
      },    
        $(go.Panel,
          { // for each attribute show a Shape at a particular place in the overall circle
            itemTemplate:
              $(go.Panel,
                $(go.Shape,
                  { stroke: null, strokeWidth: 0 },
                  new go.Binding("fill", "", attrFill),
                  new go.Binding("geometry", "", femaleGeometry))
              ),
            margin: 1
          },
          new go.Binding("itemArray", "a")
        )
      ),
      $(go.TextBlock,
        { textAlign: "center", maxSize: new go.Size(100, NaN) },
        new go.Binding("text", "n")),
      $(go.TextBlock,
        { textAlign: "center", maxSize: new go.Size(100, NaN) },
        new go.Binding("text", "t_n"))  
    ));

  // the representation of each label node -- nothing shows on a Marriage Link
  myDiagram.nodeTemplateMap.add("LinkLabel",
    $(go.Node, { selectable: false, width: 1, height: 1, fromEndSegmentLength: 20 }));


  myDiagram.linkTemplate =  // for parent-child relationships
    $(go.Link,
      {
        routing: go.Link.Orthogonal, curviness: 10,
        layerName: "Background", selectable: false,
        fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top
      },
      $(go.Shape, { strokeWidth: 2 })
    );

  myDiagram.linkTemplateMap.add("Marriage",  // for marriage relationships
    $(go.Link, { selectable: false },
      $(go.Shape, { strokeWidth: 2, stroke: "darkgreen" })
  ));

// KEY LINE BELOW
  // n: name, s: sex, m: mother, f: father, ux: wife, vir: husband, a: attributes/markers
//  console.dir(diagram_data);
  // console_ids(diagram_data);
  setupDiagram(myDiagram, diagram_data, -1 );
}

function console_ids(diagram_data) {
  for (var i=0; i<diagram_data.length;i++) {
    if (diagram_data[i]) console.log(diagram_data[i].n + ":" + diagram_data[i].key);  
  }
}

function setupDiagram(diagram, array, focusId) {
  diagram.model =
    go.GraphObject.make(go.GraphLinksModel,
      { // declare support for link label nodes
        linkLabelKeysProperty: "labelKeys",
        // this property determines which template is used
        nodeCategoryProperty: "s",
        // create all of the nodes for people
        nodeDataArray: array
      });
  setupMarriages(diagram);
  setupParents(diagram);

  var node = diagram.findNodeForKey(focusId);
  if (node !== null) {
    diagram.select(node);
    node.linksConnected.each(function(l) {
      if (!l.isLabeledLink) return;
      l.opacity = 0;
      var spouse = l.getOtherNode(node);
      spouse.opacity = 0;
      spouse.pickable = false;
    });
  }
}

function findMarriage(diagram, a, b) {
  var nodeA = diagram.findNodeForKey(a);
  var nodeB = diagram.findNodeForKey(b);
  if (nodeA !== null && nodeB !== null) {
    var it = nodeA.findLinksBetween(nodeB);  // in either direction
    while (it.next()) {
      var link = it.value;
      // Link.data.category === "Marriage" means it's a marriage relationship
      if (link.data !== null && link.data.category === "Marriage") return link;
    }
  }
  return null;
}

// now process the node data to determine marriages
function setupMarriages(diagram) {
  var model = diagram.model;
  var nodeDataArray = model.nodeDataArray;
  for (var i = 0; i < nodeDataArray.length; i++) {
    var data = nodeDataArray[i];
    var key = data.key;
    var uxs = data.ux;
    if (uxs !== undefined) {
      if (typeof uxs === "number") uxs = [ uxs ];
      for (var j = 0; j < uxs.length; j++) {
        var wife = uxs[j];
        if (key === wife) {
          // or warn no reflexive marriages
          continue;
        }
        var link = findMarriage(diagram, key, wife);
        if (link === null) {
          // add a label node for the marriage link
          var mlab = { s: "LinkLabel" };
          model.addNodeData(mlab);
          // add the marriage link itself, also referring to the label node
          var mdata = { from: key, to: wife, labelKeys: [mlab.key], category: "Marriage" };
          model.addLinkData(mdata);
        }
      }
    }
    var virs = data.vir;
    if (virs !== undefined) {
      if (typeof virs === "number") virs = [ virs ];
      for (var j = 0; j < virs.length; j++) {
        var husband = virs[j];
        if (key === husband) {
          // or warn no reflexive marriages
          continue;
        }
        var link = findMarriage(diagram, key, husband);
        if (link === null) {
          // add a label node for the marriage link
          var mlab = { s: "LinkLabel" };
          model.addNodeData(mlab);
          // add the marriage link itself, also referring to the label node
          var mdata = { from: key, to: husband, labelKeys: [mlab.key], category: "Marriage" };
          model.addLinkData(mdata);
        }
      }
    }
  }
}

// process parent-child relationships once all marriages are known
function setupParents(diagram) {
  var model = diagram.model;
  var nodeDataArray = model.nodeDataArray;
  for (var i = 0; i < nodeDataArray.length; i++) {
    var data = nodeDataArray[i];
    var key = data.key;
    var mother = data.m;
    var father = data.f;
    if (mother !== undefined && father !== undefined) {
      var link = findMarriage(diagram, mother, father);
      if (link === null) {
        // or warn no known mother or no known father or no known marriage between them
        if (window.console) window.console.log("unknown marriage: " + mother + " & " + father);
        continue;
      }
      var mdata = link.data;
      var mlabkey = mdata.labelKeys[0];
      var cdata = { from: mlabkey, to: key };
      myDiagram.model.addLinkData(cdata);
    }
  }
}


// A custom layout that shows the two families related to a person's parents
function GenogramLayout() {
  go.LayeredDigraphLayout.call(this);
}
go.Diagram.inherit(GenogramLayout, go.LayeredDigraphLayout);

GenogramLayout.prototype.makeNetwork = function(coll) {
  // generate LayoutEdges for each parent-child Link
  var net = this.createNetwork();
  if (coll instanceof go.Diagram) {
    this.add(net, coll.nodes, true);
    this.add(net, coll.links, true);
  } else if (coll instanceof go.Group) {
    this.add(net, coll.memberParts, false);
  } else if (coll.iterator) {
    this.add(net, coll.iterator, false);
  }
  return net;
};

// internal method for creating LayeredDigraphNetwork where husband/wife pairs are represented
// by a single LayeredDigraphVertex corresponding to the label Node on the marriage Link
GenogramLayout.prototype.add = function(net, coll, nonmemberonly) {
  // consider all Nodes in the given collection
  var it = coll.iterator;
  while (it.next()) {
    var node = it.value;
    if (!(node instanceof go.Node)) continue;
    if (!node.isLayoutPositioned || !node.isVisible()) continue;
    if (nonmemberonly && node.containingGroup !== null) continue;
    // if it's an unmarried Node, or if it's a Link Label Node, create a LayoutVertex for it
    if (node.isLinkLabel) {
      // get marriage Link
      var link = node.labeledLink;
      var spouseA = link.fromNode;
      var spouseB = link.toNode;
      // create vertex representing both husband and wife
      var vertex = net.addNode(node);
      // now define the vertex size to be big enough to hold both spouses
      vertex.width = spouseA.actualBounds.width + 30 + spouseB.actualBounds.width;
      vertex.height = Math.max(spouseA.actualBounds.height, spouseB.actualBounds.height);
      vertex.focus = new go.Point(spouseA.actualBounds.width + 30/2, vertex.height/2);
    } else {
      // don't add a vertex for any married person!
      // instead, code above adds label node for marriage link
      // assume a marriage Link has a label Node
      if (!node.linksConnected.any(function(l) { return l.isLabeledLink; })) {
        var vertex = net.addNode(node);
      }
    }
  }
  // now do all Links
  it.reset();
  while (it.next()) {
    var link = it.value;
    if (!(link instanceof go.Link)) continue;
    if (!link.isLayoutPositioned || !link.isVisible()) continue;
    if (nonmemberonly && link.containingGroup !== null) continue;
    // if it's a parent-child link, add a LayoutEdge for it
    if (!link.isLabeledLink) {
      var parent = net.findVertex(link.fromNode);  // should be a label node
      var child = net.findVertex(link.toNode);
      if (child !== null) {  // an unmarried child
        net.linkVertexes(parent, child, link);
      } else {  // a married child
        link.toNode.linksConnected.each(function(l) {
          if (!l.isLabeledLink) return;  // if it has no label node, it's a parent-child link
          // found the Marriage Link, now get its label Node
          var mlab = l.labelNodes.first();
          // parent-child link should connect with the label node,
          // so the LayoutEdge should connect with the LayoutVertex representing the label node
          var mlabvert = net.findVertex(mlab);
          if (mlabvert !== null) {
            net.linkVertexes(parent, mlabvert, link);
          }
        });
      }
    }
  }
};

GenogramLayout.prototype.assignLayers = function() {
  go.LayeredDigraphLayout.prototype.assignLayers.call(this);
  var horiz = this.direction == 0.0 || this.direction == 180.0;
  // for every vertex, record the maximum vertex width or height for the vertex's layer
  var maxsizes = [];
  this.network.vertexes.each(function(v) {
    var lay = v.layer;
    var max = maxsizes[lay];
    if (max === undefined) max = 0;
    var sz = (horiz ? v.width : v.height);
    if (sz > max) maxsizes[lay] = sz;
  });
  // now make sure every vertex has the maximum width or height according to which layer it is in,
  // and aligned on the left (if horizontal) or the top (if vertical)
  this.network.vertexes.each(function(v) {
    var lay = v.layer;
    var max = maxsizes[lay];
    if (horiz) {
      v.focus = new go.Point(0, v.height / 2);
      v.width = max;
    } else {
      v.focus = new go.Point(v.width / 2, 0);
      v.height = max;
    }
  });
  // from now on, the LayeredDigraphLayout will think that the Node is bigger than it really is
  // (other than the ones that are the widest or tallest in their respective layer).
};

GenogramLayout.prototype.commitNodes = function() {
  go.LayeredDigraphLayout.prototype.commitNodes.call(this);
  // position regular nodes
  this.network.vertexes.each(function(v) {
    if (v.node !== null && !v.node.isLinkLabel) {
      v.node.position = new go.Point(v.x, v.y);
    }
  });
  // position the spouses of each marriage vertex
  var layout = this;
  this.network.vertexes.each(function(v) {
    if (v.node === null) return;
    if (!v.node.isLinkLabel) return;
    var labnode = v.node;
    var lablink = labnode.labeledLink;
    // In case the spouses are not actually moved, we need to have the marriage link
    // position the label node, because LayoutVertex.commit() was called above on these vertexes.
    // Alternatively we could override LayoutVetex.commit to be a no-op for label node vertexes.
    lablink.invalidateRoute();
    var spouseA = lablink.fromNode;
    var spouseB = lablink.toNode;
    // see if the parents are on the desired sides, to avoid a link crossing
    var aParentsNode = layout.findParentsMarriageLabelNode(spouseA);
    var bParentsNode = layout.findParentsMarriageLabelNode(spouseB);
    if (aParentsNode !== null && bParentsNode !== null && aParentsNode.position.x > bParentsNode.position.x) {
      // swap the spouses
      spouseA = lablink.toNode;
      spouseB = lablink.fromNode;
    }
    spouseA.position = new go.Point(v.x, v.y);
    spouseB.position = new go.Point(v.x + spouseA.actualBounds.width + 30, v.y);
    if (spouseA.opacity === 0) {
      var pos = new go.Point(v.centerX - spouseA.actualBounds.width/2, v.y);
      spouseA.position = pos;
      spouseB.position = pos;
    } else if (spouseB.opacity === 0) {
      var pos = new go.Point(v.centerX - spouseB.actualBounds.width/2, v.y);
      spouseA.position = pos;
      spouseB.position = pos;
    }
  });
};

GenogramLayout.prototype.findParentsMarriageLabelNode = function(node) {
  var it = node.findNodesInto();
  while (it.next()) {
    var n = it.value;
    if (n.isLinkLabel) return n;
  }
  return null;
};

// highlight specific disease on diagram //
function capture_specific_disease(disease_code) {
    for (key in diagram_data) {
      //  set data to specific node in diagram //
      var data = myDiagram.model.findNodeDataForKey(diagram_data[key]['key']);
      // check node diseases //
      // if they exist remove any reference to "SD" and check if they match dropdown selected disease //
      if (data.diseases) {
          var colors = [];
          var deceased = 0;
          // loop through attributes //
          for (color in data.a) {
            var a = data.a[color];
            // check if string // 
            // if not SD(specific disease) //
            // if not D (dead), add to colors array //
            // else set deceased to one, to add it at the end //
            if (typeof a == "string") {
              if (a!="SD") {
                if (a!="D") {
                  colors.push(a);
                }
                else {
                  deceased = 1;
                }
              }
            }
          }

          for (disease in data.diseases) {
            if (data.diseases[disease]['Disease Code']==disease_code) {
              colors.push("SD");
            }
          }
          // add deceased to end of array if it exists //
          if (deceased) colors.push("D");
          myDiagram.model.setDataProperty(data, "a", colors);
      }
    }
}