function execRegex(regex, text) {
  const [, result] = regex.exec(text) || [];

  return result;
}

export default execRegex
