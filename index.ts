import * as directoryTree from 'levabala_directory-tree';
import * as shelljs from 'shelljs';

interface DirectoryTree {
  path: string;
  name: string;
  size: number;
  type: "directory" | "file";
  children?: DirectoryTree[];
  extension?: string;
}

process.argv.shift();
process.argv.shift();

// parse args
const [targetPath] = process.argv;

// check args
if (!targetPath) throw new Error("invalid path");

const treeLayers: DirectoryTree[][] = [];
directoryTree(targetPath, {}, null, async item => {
  const depth = item.path.split("/").length;
  if (!(depth in treeLayers)) treeLayers[depth] = [];

  treeLayers[depth].push(item);
})
  .then(tree => {
    const fixDirName = (name: string) => name.replace(/ /g, "-").toLowerCase();

    const reversed = treeLayers.reverse();
    reversed.forEach(layer =>
      layer.forEach(d => {
        const fixedName = fixDirName(d.name);
        if (d.name !== fixedName) {
          const newPathArr = d.path.split("/");
          newPathArr.pop();
          newPathArr.push(fixedName);

          const newPath = newPathArr.join("/");

          console.log(d.path, "->", newPath);
          shelljs.mv(d.path, newPath);
        }
      })
    );
  })
  .catch(err => {
    throw err;
  });
