export function getNestedElements(array) {
  return array
    .flatMap((item) => {
      if (Boolean(item.active)) {
        return item;
      } else if (Boolean(item.children)) {
        const nested = getNestedElements(item.children);
        Boolean(nested.length > 0) && nested.unshift(item);
        return nested;
      } else return false;
    })
    .filter((item) => Boolean(item));
}
