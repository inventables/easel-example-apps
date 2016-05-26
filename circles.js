var quantityProperty = {id: 'Circles', type: 'range', min: 1, max: 100, step: 1, value: 50};
var sizeProperty = {id: 'Size', type: 'range', min: 1, max: 100, step: 1, value: 50};

// Define a properties array that returns array of objects representing
// the accepted properties for your application
var properties = [
  quantityProperty,
  sizeProperty
];

var volumeHelper = EASEL.volumeHelper;

// Define an executor function that builds an array of volumes,
// and passes it to the provided success callback, or invokes the failure
// callback if unable to do so
var executor = function(args, success, failure) {
  var quantity = args.params.Circles;
  var materialThickness = args.material.dimensions.z;

  var randomSizeWithin = function(volume) {
    //var boundingBox = volumeHelper.boundingBox([volume]);
    //var maxSize = Math.min(boundingBox.width, boundingBox.height);
    var maxSize = 10;

    return Math.random() * maxSize * (args.params.Size / 100);
  };

  var randomPositionInside = function(volume) {
    //var boundingBox = volumeHelper.boundingBox([volume]);
    var boundingBox = {left: 0, right: 20, bottom: 0, top: 20, width: 20, height: 20};

    return {
      x: boundingBox.left + (Math.random() * boundingBox.width),
      y: boundingBox.bottom + (Math.random() * boundingBox.height)
    };
  };

  var randomDepth = function() {
    //var fraction = Math.ceil(Math.random() * 8) / 16;
    var fraction = 1;
    return fraction * materialThickness;
  };

  var getSelectedVolumes = function(volumes, selectedVolumeIds) {
    return volumes.filter(function(volume) {
      return selectedVolumeIds.indexOf(volume.id) !== -1;
    });
  };

  var intersect = function(designVolume, circleVolumes) {
    return circleVolumes;

    //var solutions = [];
    //var clipVolume;

    //var clippedVolumes = circleVolumes.map(function(circleVolume) {
    //  clipVolume = volumeHelper.intersect([designVolume], [circleVolume]);
    //  if (clipVolume !== null) {
    //    clipVolume.cut = circleVolume.cut;
    //  }
    //  return clipVolume;
    //});

    //return clippedVolumes.filter(function(v) { return v !== null; });
  }

  var buildCircles = function(volume) {
    var volumes = [];
    var size;
    for (var i = quantityProperty.min; i <= quantity; i++) {
      size = randomSizeWithin(volume);
      volumes.push({
        shape: {
          type: 'ellipse',
          center: randomPositionInside(volume),
          width: size,
          height: size,
          flipping: {},
          rotation: 0
        },
        cut: {
          depth: randomDepth(),
          type: Math.random() > 0.5 ? 'outline' : 'fill',
          outlineStyle: 'on-path'
        }
      });
    }
    return volumes;
  };

  var generateCirclesWithinSelectedShapes = function(volumes, selectedVolumeIds) {
    var allVolumes = [];
    var circleVolumes, selectedVolume;

    var selectedVolumes = getSelectedVolumes(volumes, selectedVolumeIds);
    for (var i = 0; i < selectedVolumes.length; i++) {
      selectedVolume = selectedVolumes[i]
      circleVolumes = buildCircles(selectedVolume);
      allVolumes = allVolumes.concat(intersect(selectedVolume, circleVolumes));

      // Make original shapes outlines with outside cuts
      selectedVolume.cut.type = 'outline';
      selectedVolume.cut.outlineStyle = 'outside';
      allVolumes = allVolumes.concat(selectedVolume);
    }

    return allVolumes;
  };

  var generateCirclesWithinCannedRectangle = function() {
    var cannedRectangle = function() {
      return {
        shape: {
          type: 'rectangle',
          flipping: {},
          center: {
            x: 5,
            y: 5
          },
          width: 10,
          height: 10,
          rotation: 2
        },
        cut: {
          depth: randomDepth(),
          type: 'outline',
          outlineStyle: 'on-path'
        }
      }
    };

    var volume = cannedRectangle();
    var circleVolumes = buildCircles(volume);
    return [volume].concat(intersect(volume, circleVolumes));
  };

  var generate = function() {
    var responseVolumes;

    //if (args.selectedVolumeIds.length > 0) {
    //  responseVolumes = generateCirclesWithinSelectedShapes(args.volumes, args.selectedVolumeIds);
    //} else {
      responseVolumes = generateCirclesWithinCannedRectangle();
    //}

    success(responseVolumes);
  };

  generate();
};

