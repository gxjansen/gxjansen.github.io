const e="tsconfig-paths-setup/index.mdx",s="blog",r="tsconfig-paths-setup",i=`TSConfig path aliases are a powerful tool that can help you to improve the readability, maintainability, and error-proofing of your TypeScript code. This allows for easier to read clean code, and enables us to move files around without having to update import paths in every file.

*This is a huge time saver.*

## What Are Path Aliases?

The goal is to replace the following import statements:

\`\`\`ts
// relative import path\r
import MyComponent from "../../../components/MyComponent";
\`\`\`

with these import statements:

\`\`\`ts
// alias import path\r
import MyComponent from "@components/MyComponent";
\`\`\`

We can do this with a \`tsconfig.json\` or \`jsconfig.json\` file. We will be using TypeScript in this post.

## How To Setup Path Aliases

### Adding Path Aliases To Your TSConfig File

We need to update our \`tsconfig.json\` file to enable aliases. We will add a \`paths\` and \`baseUrl\` property to the \`compilerOptions\` object. Each path is relative to the \`baseUrl\`.

This will tell TypeScript to replace the alias with the actual path when compiling the code.

\`\`\`json
{\r
  "compilerOptions": {\r
    "baseUrl": ".", // root of your "paths" below. Required if "paths" is defined\r
    "paths": {\r
      "@components/*": ["src/components/*"] // enables us to use @components/MyComponent\r
    }\r
  }\r
}
\`\`\`

### Using Path Aliases In Your Code

Now in all of your source files, you can import components like this:

\`\`\`ts
// Without path aliases\r
import Hero from "../../../components/Hero";\r
import Footer from "../../../components/Footer";\r
\r
// With path aliases\r
import Hero from "@components/Hero";\r
import Footer from "@components/Footer";
\`\`\`

<Admonition variant="info">
  Frameworks like Astro and Next.js ship with built-in typescript support,\r
  although you may have to create the file \`tsconfig.json\`. Consult your\r
  framework's documentation for more information.
</Admonition>

## Why Should I Do This?

Let's say we have the following file structure:

\`\`\`
.\r
└── src/\r
    ├── components/\r
    │   ├── Hero.tsx\r
    │   └── Footer.tsx\r
    └── pages/\r
        ├── index.tsx\r
        └── solutions.tsx
\`\`\`

### Annoying Relative Imports

If we want to import \`Hero.tsx\` and \`Footer.tsx\` into \`index.tsx\` and \`solutions.tsx\`, we would need the following import statements:

\`\`\`ts
import Hero from "../components/Hero";\r
import Footer from "../components/Footer";
\`\`\`

### Refactoring Relative Imports

Now lets say we want to refactor. We now have multiple "solutions" and want to have each on their own page, and have them under a \`solutions\` directory. The file structure now looks like:

\`\`\`
.\r
└── src/\r
    ├── components/\r
    │   ├── Hero.tsx\r
    │   └── Footer.tsx\r
    └── pages/\r
        ├── index.tsx\r
        └── solutions/\r
            ├── solution.tsx\r
            └── solution2.tsx
\`\`\`

Now we have to update the import paths of \`solution.tsx\`:

\`\`\`ts
import Hero from "../../components/Hero";\r
import Footer from "../../components/Footer";
\`\`\`

You can see how this makes refactoring more of a chore. We have to update the import paths in every file that imports these components. This is a huge time sink and can lead to bugs if you forget to update the import paths.

### Alias Imports Version

Alternatively, if from the start we were using aliases, we would not have to update any files using the components. This is far better for maintainability:

\`\`\`ts
import Hero from "@components/Hero";\r
import Footer from "@components/Footer";
\`\`\`

<Admonition variant="info">
  With this method, *every* file that needs to import these components will\r
  import them the same way. This makes it easier to move files around without\r
  having to update import paths.
</Admonition>

## Additional Paths

This can be extended to any number of path aliases. Some other potential ones you might use:

\`\`\`json
{\r
  "compilerOptions": {\r
    "baseUrl": ".",\r
    "paths": {\r
      "@config/*": ["src/data/*"],\r
      "@js/*": ["src/js/*"],\r
      "@layouts/*": ["src/layouts/*"],\r
      "@components/*": ["src/components/*"],\r
      "@assets/*": ["src/assets/*"]\r
    }\r
  }\r
}
\`\`\`

<Admonition variant="tip">
  When updating \`tsconfig.json\`, you may need to restart your editor for the\r
  changes to take effect.
</Admonition>
`,a={title:"How to Use TSConfig Path Aliases to Improve Your Code",description:"Enable cleaner, more readable import statements with TSConfig path aliases. Learn how to set them up and improve your TypeScript code maintainability.",authors:[{slug:"gxjansen",collection:"authors"}],pubDate:new Date(15973632e5),heroImage:new Proxy({src:"/astro-assets/heroImage.x_EbSBIW.jpg",width:1920,height:1280,format:"jpg",fsPath:"/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/tsconfig-paths-setup/heroImage.jpg"},{get(t,n,o){return n==="clone"?structuredClone(t):n==="fsPath"?"/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/tsconfig-paths-setup/heroImage.jpg":t[n]}}),categories:["productivity"],draft:!1},p={type:"content",filePath:"/Users/gxjansen/Documents/GitHub/gxjansen.github.io/src/content/blog/tsconfig-paths-setup/index.mdx",rawData:void 0};export{p as _internal,i as body,s as collection,a as data,e as id,r as slug};
