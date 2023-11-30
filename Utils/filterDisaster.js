export function filterResults(query) {
  const filter = {};

  if (query.typeOfDisaster) {
    filter.typeOfDisaster = query.typeOfDisaster;
  }

  if (query.timestampFrom && query.timestampTo) {
    filter.timestamp = {
      $gte: new Date(query.timestampFrom),
      $lte: new Date(query.timestampTo),
    };
  }

  if (query.agencyName) {
    filter["agencies.name"] = query.agencyName;
  }

  return filter;
}
