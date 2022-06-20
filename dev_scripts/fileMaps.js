const fileMaps = [
  {
    folder: "components",
    aliases: ["component"],
    files: {
      // "%name%.css": {createStr: ""},
      // "%name%.test.js": {createStr: ""},
      "index.ts": {
        renameContents: true,
        createStr: `export { default } from "./%name%"
export * from "./%name%"`,
      },
      "%name%.css": {createStr: ""},
      "%name%.tsx": {
        renameContents: true,
        createStr: `import React from "react"

import "./%name%.css"

const %name%: React.FC = () => {
	return (
		<>
		</>
	)
}

export default %name%`,
      },
    },
  },
  {
    folder: "context",
    aliases: ["contexts"],
    extension: "Context.tsx",
    file: {
      renameContents: true,
      createStr: `import React, { createContext } from "react"

export const %name%Context = createContext<%name%ContextData>({})

export interface %name%ContextData {

}

export const %name%ContextWrapper: React.FC = ({ children }) => {
	const %name%Data: %name%ContextData = {

	}

	return (
		<%name%Context.Provider value={%name%Data}>
			{children}
		</%name%Context.Provider>
	)
}`,
    },
  },
  {
    folder: "material",
    aliases: [],
    copy: "component",
  },
  {
    folder: "pages",
    aliases: ["page"],
    copy: "component",
  },
];

const replaceTemplate = (str, template, replacement) => {
  const regex = new RegExp(`%${template}%`, "g");
  str = str.replace(regex, replacement);
  return str;
};

const getFileObj = (name) => {
  let returnVal = null;
  fileMaps.forEach((fileMap) => {
    if (fileMap.folder === name || fileMap.aliases.includes(name))
      returnVal = fileMap;
  });
  return returnVal;
};

fileMaps.forEach((fileMap, i) => {
  if (fileMap.copy) {
    fileMaps[i] = {
      ...getFileObj(fileMap.copy),
      ...fileMaps[i],
    };
  }
});

module.exports = {
  fileMaps,
  replaceTemplate,
  getFileObj,
};
