export function getXmlNodeValue(
  encodedStr,
  parentTag,
  childTag = null,
  child2Tag = null
) {
  try {
    const parser = new DOMParser();
    const xmlParsed = parser.parseFromString(encodedStr, "application/xml");
    const elements = xmlParsed.getElementsByTagName(parentTag)[0];
    if (childTag) {
      const childElems = elements.getElementsByTagName(childTag)[0];
      if (child2Tag) {
        return (
          childElems.getElementsByTagName(child2Tag)[0].childNodes[0]
            .nodeValue || ""
        );
      }
      return childElems.childNodes[0].nodeValue || "";
    }
    return elements.childNodes[0].nodeValue || "";
  } catch (err) {
    console.error(err);
    return "";
  }
}

export function getXmlNodeValueAttr(encodedStr, parentTag, attr) {
  try {
    const parser = new DOMParser();
    const xmlParsed = parser.parseFromString(encodedStr, "application/xml");
    const elements = xmlParsed.getElementsByTagName(parentTag)[0];
    return elements.getAttributeNode(attr).nodeValue || "";
  } catch (err) {
    console.error(err);
    return "";
  }
}
