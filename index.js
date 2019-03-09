"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const directoryTree = require("levabala_directory-tree");
const shelljs = require("shelljs");
process.argv.shift();
process.argv.shift();
// parse args
const [targetPath] = process.argv;
// check args
if (!targetPath)
    throw new Error("invalid path");
const treeLayers = [];
directoryTree(targetPath, {}, null, (item) => __awaiter(this, void 0, void 0, function* () {
    const depth = item.path.split("/").length;
    if (!(depth in treeLayers))
        treeLayers[depth] = [];
    treeLayers[depth].push(item);
}))
    .then(tree => {
    const fixDirName = (name) => name.replace(/ /g, "-").toLowerCase();
    const reversed = treeLayers.reverse();
    reversed.forEach(layer => layer.forEach(d => {
        const fixedName = fixDirName(d.name);
        if (d.name !== fixedName) {
            const newPathArr = d.path.split("/");
            newPathArr.pop();
            newPathArr.push(fixedName);
            const newPath = newPathArr.join("/");
            console.log(d.path, "->", newPath);
            shelljs.mv(d.path, newPath);
        }
    }));
})
    .catch(err => {
    throw err;
});
