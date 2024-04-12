// FIXME: fix types
const parse = (str: any) =>
  str
    .split(";")
    .map((v: any) => v.split("="))
    .reduce((acc: any, v: any) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

export { parse };
