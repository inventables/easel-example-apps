properties = (params) ->
  [
    {id: 'Padding', type: 'range', min: 0, max: 50, step: 5, value: 15}
  ]

executor = (args, success, failure) ->
  {volumeHelper} = EASEL

  padding = (1 + args.params.Padding / 100)
  materialThickness = args.material.dimensions.z
  textVolumes = (volume for volume in args.volumes when volume.id in args.selectedVolumeIds and volume.shape.type is "text")

  rectangle = (boundingBox) ->
    {
      shape: {
        type: 'rectangle'
        flipping: {}
        center: {
          x: (boundingBox.minX + boundingBox.maxX) / 2
          y: (boundingBox.minY + boundingBox.maxY) / 2
        }
        width: (boundingBox.maxX - boundingBox.minX) * padding
        height: (boundingBox.maxY - boundingBox.minY) * padding
        rotation: 0
      }
      cut: {
        depth: materialThickness
        type: 'outline'
        outlineStyle: 'outside'
      }
    }

  textPoints = []
  for volume in textVolumes
    textPoints = textPoints.concat(EASEL.segmentVisitor.visit(volume.shape))

  boundingBox = EASEL.pathUtils.pathBoundingBox(textPoints)
  volumes = [rectangle(boundingBox)]

  success volumes.concat(args.volumes)

