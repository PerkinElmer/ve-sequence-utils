const { each, forEach, startsWith, filter } = require("lodash");
const {
  getYOffsetForPotentiallyCircularRange,
  splitRangeIntoTwoPartsIfItIsCircular
} = require("ve-range-utils");

module.exports = function mapAnnotationsToRows(
  annotations,
  sequenceLength,
  bpsPerRow
) {
  const annotationsToRowsMap = {};
  const yOffsetLevelMap = {};
  const wrappedAnnotations = {};

  each(annotations, function(annotation) {
    const containsLocations = !!(
      annotation.locations && annotation.locations.length
    );
    if (annotation.overlapsSelf) {
      //if the annotation overlaps itself, first send a fake full spanning annotation thru the mapping function
      if (!wrappedAnnotations[annotation.id]) {
        mapAnnotationToRows({
          wrappedAnnotations,
          annotation: {
            start: 0,
            end: sequenceLength - 1,
            id: `__tempAnnRemoveMe__${annotation.id}`
          },
          sequenceLength,
          bpsPerRow,
          annotationsToRowsMap,
          yOffsetLevelMap,
          containsLocations
        });
        wrappedAnnotations[annotation.id] = true;
        // annotation.yOffset = wrappedAnnotations[annotation.id];
      }
    }

    mapAnnotationToRows({
      wrappedAnnotations,
      annotation,
      sequenceLength,
      bpsPerRow,
      annotationsToRowsMap,
      yOffsetLevelMap,
      containsLocations
    });
    if (containsLocations) {
      annotation.locations.forEach(location => {
        mapAnnotationToRows({
          wrappedAnnotations,
          annotation,
          sequenceLength,
          bpsPerRow,
          annotationsToRowsMap,
          yOffsetLevelMap,
          location
        });
      });
    }
  });
  forEach(annotationsToRowsMap, (annotationsForRow, i) => {
    annotationsToRowsMap[i] = filter(
      annotationsForRow,
      ann => !startsWith(ann.id, "__tempAnnRemoveMe__")
    );
  });
  return annotationsToRowsMap;
};

function mapAnnotationToRows({
  wrappedAnnotations,
  annotation,
  sequenceLength,
  bpsPerRow,
  annotationsToRowsMap,
  yOffsetLevelMap,
  location,
  containsLocations
}) {
  const ranges = splitRangeIntoTwoPartsIfItIsCircular(
    location || annotation,
    sequenceLength
  );
  ranges.forEach(function(range, index) {
    // if (!isPositiveInteger(range.start)) {}
    const startingRow = Math.floor(range.start / bpsPerRow);
    const endingRow = Math.floor(range.end / bpsPerRow);
    // const numberOfRows = endingRow - startingRow + 1;
    for (let rowNumber = startingRow; rowNumber <= endingRow; rowNumber++) {
      if (!annotationsToRowsMap[rowNumber]) {
        annotationsToRowsMap[rowNumber] = [];
      }
      const annotationsForRow = annotationsToRowsMap[rowNumber];
      if (!yOffsetLevelMap[rowNumber]) {
        yOffsetLevelMap[rowNumber] = [];
      }

      let yOffset;
      const yOffsetsForRow = yOffsetLevelMap[rowNumber];
      const start =
        rowNumber === startingRow ? range.start : rowNumber * bpsPerRow;
      const end =
        rowNumber === endingRow
          ? range.end
          : rowNumber * bpsPerRow + bpsPerRow - 1;
      if (annotation.overlapsSelf) {
        annotationsForRow.forEach(ann => {
          if (ann.id === `__tempAnnRemoveMe__${annotation.id}`) {
            yOffset = ann.yOffset;
          }
        });
      } else {
        if (location) {
          //if there's a location then we will just use the previous yOffset for its parent annotation
          annotationsForRow.forEach(ann => {
            if (ann.id === annotation.id) {
              yOffset = ann.yOffset;
            }
          });
        } else {
          //we need to pass both ranges into this function so that we can correctly
          //get the y-offset for circular features that start and end on the same row
          //we pass the entire annotation range here and compare it only with ranges that have already been added to the row
          if (
            index > 0 && //second half of an annotation range
            annotationsForRow.length && //there are already annotations within the row
            annotationsForRow[annotationsForRow.length - 1].annotation ===
              annotation
          ) {
            //the first chunk of the annotation has already been pushed into the row,
            //so set the yOffset for the range chunk to the already calculated yOffset
            yOffset = annotationsForRow[annotationsForRow.length - 1].yOffset;
          } else {
            yOffset = getYOffsetForPotentiallyCircularRange(
              annotation,
              yOffsetsForRow
            );
          }
          //add the new yOffset to the yOffset array
          if (!yOffsetsForRow[yOffset]) yOffsetsForRow[yOffset] = [];
          yOffsetsForRow[yOffset].push({
            start: start,
            end: end
          });
        }
      }

      annotationsForRow.push({
        id: annotation.id,
        annotation: annotation,
        start: start,
        end: end,
        ...(containsLocations && { containsLocations }),
        ...(location && { isJoinedLocation: !!location }),
        yOffset: yOffset,
        enclosingRangeType: range.type //either "beginning", "end" or "beginningAndEnd"
      });
    }
  });
  // return annotationsToRowsMap;
}
